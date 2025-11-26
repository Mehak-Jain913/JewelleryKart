import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext.jsx'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const Orders = () => {
  const { token, user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  useEffect(() => {
    if (!token || !user) {
      setLoading(false)
      return
    }

    const fetchOrders = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await axios.get(`${API_BASE}/api/orders`, { headers })
        setOrders(res.data)
      } catch (e) {
        setError('Failed to load orders')
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [token, user])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!token || !user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please login to view your orders.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-bold text-black mb-6 font-display">Your Orders</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-600">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <p className="text-gray-600 text-lg">You haven't placed any orders yet.</p>
          <p className="text-gray-500 mt-2">Start shopping to see your orders here!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-semibold text-black font-display">
                    Order #{order.id}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatDate(order.order_date)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-xl font-bold text-[#D4AF37]">
                    ${Number(order.total).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Items ({order.items?.length || 0})
                </h4>
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                  >
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-black">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.type} • Qty: {item.quantity} • ${Number(item.price).toFixed(2)} each
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-black">
                        ${(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders

