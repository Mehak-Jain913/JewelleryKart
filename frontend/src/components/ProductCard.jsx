import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext.jsx'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const ProductCard = ({ product }) => {
  const { token, user } = useAuth()
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [loading, setLoading] = useState(false)

  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  // Check if product is in wishlist
  useEffect(() => {
    if (!token || !user || !product?.id) return

    const checkWishlist = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/api/wishlist/check/${product.id}`,
          { headers }
        )
        setIsInWishlist(res.data.inWishlist)
      } catch (error) {
        // Silently fail if check fails
        console.error('Failed to check wishlist:', error)
      }
    }

    checkWishlist()
  }, [token, user, product?.id])

  const toggleWishlist = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!token || !user) {
      alert('Please login to add items to wishlist')
      return
    }

    setLoading(true)
    try {
      if (isInWishlist) {
        await axios.delete(`${API_BASE}/api/wishlist/remove/${product.id}`, { headers })
        setIsInWishlist(false)
      } else {
        await axios.post(`${API_BASE}/api/wishlist/add/${product.id}`, {}, { headers })
        setIsInWishlist(true)
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error)
      alert('Failed to update wishlist')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card-lux p-4 group relative transition-all duration-300 hover:scale-[1.02]">
      <div className="relative">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-40 object-cover rounded-md mb-3 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-40 bg-gray-100 rounded-md mb-3" />
        )}
        {/* Wishlist Heart Icon */}
        {token && (
          <button
            onClick={toggleWishlist}
            disabled={loading}
            className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all duration-300 hover:scale-110 z-10"
            title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {isInWishlist ? (
              <svg
                className="w-5 h-5 text-red-500 fill-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            )}
          </button>
        )}
      </div>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-bold text-black font-display">{product.name}</h3>
        <span className="text-[#D4AF37] font-semibold">${Number(product.price).toFixed(2)}</span>
      </div>
      <div className="text-sm text-gray-600">Type: {product.type} • Qty: {product.quantity}</div>
      {product.description && (
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>
      )}
    </div>
  )
}

export default ProductCard


