import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ProductCard from '../components/ProductCard.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const Products = () => {
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = {}
        if (query) params.q = query
        if (typeFilter) params.type = typeFilter
        if (minPrice) params.minPrice = minPrice
        if (maxPrice) params.maxPrice = maxPrice
        const res = await axios.get(`${API_BASE}/api/products`, { params })
        setProducts(res.data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [query, typeFilter, minPrice, maxPrice])

  const types = useMemo(() => {
    const set = new Set(products.map(p => p.type))
    return Array.from(set)
  }, [products])

  // FIX: Implement proper filtering logic (only show in-stock products with quantity > 0)
  const filtered = useMemo(() => {
    return products.filter(p => {
      // Stock availability check
      if (Number(p.quantity) <= 0) {
        return false
      }
      // Search filter
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) {
        return false
      }
      // Type filter
      if (typeFilter && p.type !== typeFilter) {
        return false
      }
      // Price filters
      const price = Number(p.price)
      if (minPrice && price < Number(minPrice)) {
        return false
      }
      if (maxPrice && price > Number(maxPrice)) {
        return false
      }
      return true
    })
  }, [products, query, typeFilter, minPrice, maxPrice])

  const addToCart = async (productId) => {
    setError('')
    if (!token) {
      const confirmLogin = window.confirm('Please login to add items to your cart. Do you want to login now?')
      if (confirmLogin) {
        navigate('/auth')
      }
      return
    }
    try {
      await axios.post(`${API_BASE}/api/cart`, { productId, quantity: 1 }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('Product added to cart successfully!')
    } catch (e) {
      setError('Failed to add to cart')
    }
  }

  return (
    <div className="animate-fade-in py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-[#E8D8A6]/30 pb-6">
        <div>
          <h2 className="text-4xl font-extrabold text-black font-display tracking-tight">Our Collection</h2>
          <p className="text-gray-500 mt-2 text-sm">Explore our curated selection of premium, handcrafted luxury jewelry.</p>
        </div>
        <div className="text-sm font-semibold px-4 py-2 bg-amber-50 rounded-lg text-[#B08B3A] border border-[#E8D8A6]/40 self-start md:self-auto">
          Showing {filtered.length} exclusive items
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm animate-scale-in">
          {error}
        </div>
      )}

      {/* Luxury Filter Bar */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8D8A6]/30 shadow-sm flex flex-wrap gap-4 items-center mb-8">
        <div className="flex-1 min-w-[240px]">
          <input
            placeholder="Search by name..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full border rounded-lg px-4 py-2.5 border-[#E8D8A6]/60 bg-[#F5F5F5]/30 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-sm transition-all duration-300"
          />
        </div>
        <div>
          <select 
            value={typeFilter} 
            onChange={e => setTypeFilter(e.target.value)} 
            className="border rounded-lg px-4 py-2.5 border-[#E8D8A6]/60 bg-white focus:border-[#D4AF37] outline-none text-sm cursor-pointer transition-all duration-300"
          >
            <option value="">All Categories</option>
            {types.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min ($)"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            className="w-28 border rounded-lg px-3 py-2.5 border-[#E8D8A6]/60 bg-white focus:border-[#D4AF37] outline-none text-sm transition-all duration-300"
          />
          <span className="text-gray-400 text-xs">to</span>
          <input
            type="number"
            min="0"
            placeholder="Max ($)"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            className="w-28 border rounded-lg px-3 py-2.5 border-[#E8D8A6]/60 bg-white focus:border-[#D4AF37] outline-none text-sm transition-all duration-300"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-3">
          <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium tracking-wide">Loading boutique items...</p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filtered.map(p => (
              <div key={p.id} className="flex flex-col justify-between h-full bg-white rounded-2xl overflow-hidden border border-[#E8D8A6]/20 shadow-sm hover:shadow-lg transition-all duration-300 group">
                <div className="flex-1">
                  <ProductCard product={p} />
                </div>
                <div className="p-4 pt-0">
                  <button 
                    onClick={() => addToCart(p.id)} 
                    className="w-full py-3 bg-black hover:bg-[#D4AF37] text-white hover:text-black font-semibold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98]"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-[#E8D8A6]/20">
              <p className="text-gray-500 text-lg font-medium">No items found matching your filters.</p>
              <p className="text-gray-400 mt-2 text-sm">Try clearing your filters or checking back later!</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Products
