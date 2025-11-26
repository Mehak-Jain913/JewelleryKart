import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const Wishlist = () => {
  const { token, user } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  useEffect(() => {
    if (!token || !user) {
      setLoading(false)
      return
    }

    const fetchWishlist = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await axios.get(`${API_BASE}/api/wishlist/${user.id}`, { headers })
        setItems(res.data)
      } catch (e) {
        setError('Failed to load wishlist')
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [token, user])

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`${API_BASE}/api/wishlist/remove/${productId}`, { headers })
      setItems(prev => prev.filter(item => item.product_id !== productId))
    } catch (e) {
      setError('Failed to remove item')
      console.error(e)
    }
  }

  const addToCart = async (productId) => {
    try {
      await axios.post(
        `${API_BASE}/api/cart`,
        { productId, quantity: 1 },
        { headers }
      )
      // Optionally show success message or navigate to cart
      navigate('/cart')
    } catch (e) {
      setError('Failed to add to cart')
      console.error(e)
    }
  }

  if (!token || !user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please login to view your wishlist.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-bold text-black mb-6 font-display">Your Wishlist</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-600">Loading wishlist...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <p className="text-gray-600 text-lg">Your wishlist is empty.</p>
          <p className="text-gray-500 mt-2">Start adding products to your wishlist!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="card-lux p-4 group relative transition-all duration-300 hover:scale-[1.02]"
            >
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-md mb-3 transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded-md mb-3" />
              )}
              
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold text-black font-display line-clamp-1">
                  {item.name}
                </h3>
              </div>
              
              <div className="text-sm text-gray-600 mb-2">
                Type: {item.type} • Qty: {item.quantity}
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl font-bold text-[#D4AF37]">
                  ${Number(item.price).toFixed(2)}
                </span>
              </div>

              {item.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {item.description}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => addToCart(item.product_id)}
                  className="flex-1 btn-gold text-sm py-2 transition-all duration-300 hover:shadow-lg"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(item.product_id)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-red-50 hover:border-red-300 transition-colors duration-300"
                  title="Remove from wishlist"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Wishlist


