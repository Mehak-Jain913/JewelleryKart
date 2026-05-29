import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const Cart = () => {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  const fetchCart = async () => {
    if (!token) {
      setItems([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await axios.get(`${API_BASE}/api/cart`, { headers })
      setItems(res.data)
    } catch (e) {
      setError('Failed to load cart')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const removeItem = async (productId) => {
    try {
      await axios.delete(`${API_BASE}/api/cart/${productId}`, { headers })
      setItems(prev => prev.filter(i => i.product_id !== productId))
    } catch {
      setError('Failed to remove item')
    }
  }

  const total = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0)

  const handleCheckout = async () => {
    if (items.length === 0) {
      setError('Cart is empty')
      return
    }

    if (!token) {
      setError('Please login to checkout')
      return
    }

    setLoading(true)
    setError('')
    try {
      await axios.post(`${API_BASE}/api/orders/checkout`, {}, { headers })
      // Clear cart items from state
      setItems([])
      // Show success message and navigate to orders page
      alert('Order placed successfully! Redirecting to orders page...')
      navigate('/orders')
    } catch (e) {
      const errMsg = e.response?.data?.message || 'Failed to complete checkout. Please try again.'
      setError(errMsg)
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-black mb-6 font-display">Your Cart</h2>
      {!token && <div className="text-gray-600">Please login to view your cart.</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}
      {loading ? (
        <div className="text-gray-600">Loading...</div>
      ) : (
        <>
          {items.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <p className="text-gray-600 text-lg">Your cart is empty.</p>
              <p className="text-gray-500 mt-2">Start adding products to your cart!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow duration-300">
                  {item.image_url && (
                    <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                  )}
                  <div className="flex-1">
                    <div className="font-semibold text-black">{item.name}</div>
                    <div className="text-sm text-gray-600">Qty: {item.quantity} • ${Number(item.price).toFixed(2)} each</div>
                  </div>
                  <div className="font-semibold text-black">${(Number(item.price) * item.quantity).toFixed(2)}</div>
                  <button 
                    onClick={() => removeItem(item.product_id)} 
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-red-50 hover:border-red-300 transition-colors duration-300"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-xl">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <div className="text-2xl font-bold text-[#D4AF37]">${total.toFixed(2)}</div>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="btn-gold px-6 py-3 text-lg font-semibold transition-all duration-300 hover:shadow-lg"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Proceed to Checkout'}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Cart


