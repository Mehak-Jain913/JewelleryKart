import { useEffect, useMemo, useState } from 'react'
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

  // FIX: Implement proper filtering logic
  const filtered = useMemo(() => {
    return products.filter(p => {
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
    try {
      if (!token) {
        setError('Please login to add to cart')
        return
      }
      await axios.post(`${API_BASE}/api/cart`, { productId, quantity: 1 }, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch {
      setError('Failed to add to cart')
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-black mb-6">Products</h2>
      {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
      <div className="flex flex-wrap gap-3 items-center mb-6">
        <input
          placeholder="Search by name"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="border rounded-md px-3 py-2 border-[#E8D8A6] bg-white"
        />
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="border rounded-md px-3 py-2 border-[#E8D8A6] bg-white">
          <option value="">All Types</option>
          {types.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <input
          type="number"
          min="0"
          placeholder="Min Price"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
          className="w-32 border rounded-md px-3 py-2 border-[#E8D8A6] bg-white"
        />
        <input
          type="number"
          min="0"
          placeholder="Max Price"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
          className="w-32 border rounded-md px-3 py-2 border-[#E8D8A6] bg-white"
        />
      </div>
      {loading ? (
        <div className="text-gray-600">Loading...</div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(p => (
            <div key={p.id} className="flex flex-col gap-3">
              <ProductCard product={p} />
              <button onClick={() => addToCart(p.id)} className="w-full btn-black text-sm">
                Add to Cart
              </button>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-gray-600">No products found.</div>
          )}
        </div>
      )}
    </div>
  )
}

export default Products


