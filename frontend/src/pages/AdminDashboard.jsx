import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate, Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const AdminDashboard = () => {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [summary, setSummary] = useState(null)
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  useEffect(() => {
    if (token) {
      fetchData()
    }
  }, [token, activeTab])

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      if (activeTab === 'dashboard') {
        const [summaryRes, statsRes, ordersRes] = await Promise.all([
          axios.get(`${API_BASE}/api/admin/summary`, { headers }),
          axios.get(`${API_BASE}/api/admin/stats`, { headers }),
          axios.get(`${API_BASE}/api/admin/orders?limit=100`, { headers })
        ])
        setSummary(summaryRes.data)
        setStats(statsRes.data)
        setOrders(ordersRes.data)
      } else if (activeTab === 'orders') {
        const res = await axios.get(`${API_BASE}/api/admin/orders`, { headers })
        setOrders(res.data)
      } else if (activeTab === 'users') {
        const res = await axios.get(`${API_BASE}/api/admin/users`, { headers })
        setUsers(res.data)
      }
    } catch (e) {
      setError('Failed to load data')
      console.error(e)
      if (e.response?.status === 403) {
        logout()
        navigate('/auth')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  // Prepare chart data
  const monthlySalesData = (() => {
    if (!stats?.monthlySales || stats.monthlySales.length === 0) return []
    
    // Check if it's the new format (array of objects) or old format (array of numbers)
    if (typeof stats.monthlySales[0] === 'object' && stats.monthlySales[0] !== null) {
      // New format with month labels
      return stats.monthlySales.map((item) => ({
        month: item.monthLabel || item.month || 'Unknown',
        sales: item.sales || 0
      }))
    } else {
      // Old format (array of numbers) - fallback
      return stats.monthlySales.map((sales, index) => ({
        month: `Month ${index + 1}`,
        sales: typeof sales === 'number' ? sales : 0
      }))
    }
  })()

  // Prepare pie chart data for order distribution by user
  const orderDistributionData = (() => {
    if (orders.length === 0) return []
    
    const userOrderCount = {}
    orders.forEach(order => {
      const userName = order.user_name || 'Unknown'
      userOrderCount[userName] = (userOrderCount[userName] || 0) + 1
    })
    
    // Get top 5 users
    const sortedUsers = Object.entries(userOrderCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }))
    
    // If more than 5 users, group the rest as "Others"
    if (Object.keys(userOrderCount).length > 5) {
      const othersCount = Object.entries(userOrderCount)
        .sort((a, b) => b[1] - a[1])
        .slice(5)
        .reduce((sum, [, count]) => sum + count, 0)
      if (othersCount > 0) {
        sortedUsers.push({ name: 'Others', value: othersCount })
      }
    }
    
    return sortedUsers
  })()

  const COLORS = ['#D4AF37', '#F5D76E', '#B08B3A', '#8B6914', '#C9A961', '#E6D5A8', '#F4E5C2']

  if (!token || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)' }}>
        <p style={{ color: '#F5F5F5' }}>Please login to view admin dashboard.</p>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen flex"
      style={{
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)'
      }}
    >
      {/* Sidebar */}
      <div 
        className="w-64 min-h-screen p-6"
        style={{
          background: 'linear-gradient(180deg, #1a1a1a 0%, #000000 100%)',
          borderRight: '2px solid rgba(212, 175, 55, 0.3)',
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div className="mb-8">
          <h1 
            className="text-2xl font-bold mb-2"
            style={{ color: '#D4AF37' }}
          >
            JewelleryKart
          </h1>
          <p 
            className="text-sm"
            style={{ color: '#F5F5F5' }}
          >
            Admin Dashboard
          </p>
        </div>

        <nav className="space-y-2 mb-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-3"
            style={{
              background: activeTab === 'dashboard' ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
              color: activeTab === 'dashboard' ? '#D4AF37' : '#F5F5F5',
              border: activeTab === 'dashboard' ? '1px solid rgba(212, 175, 55, 0.5)' : '1px solid transparent'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'dashboard') {
                e.target.style.background = 'rgba(212, 175, 55, 0.1)'
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'dashboard') {
                e.target.style.background = 'transparent'
              }
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </button>

          <Link
            to="/admin"
            className="w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-3 block"
            style={{
              color: '#F5F5F5',
              border: '1px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(212, 175, 55, 0.1)'
              e.target.style.borderColor = 'rgba(212, 175, 55, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent'
              e.target.style.borderColor = 'transparent'
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Products
          </Link>

          <button
            onClick={() => setActiveTab('orders')}
            className="w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-3"
            style={{
              background: activeTab === 'orders' ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
              color: activeTab === 'orders' ? '#D4AF37' : '#F5F5F5',
              border: activeTab === 'orders' ? '1px solid rgba(212, 175, 55, 0.5)' : '1px solid transparent'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'orders') {
                e.target.style.background = 'rgba(212, 175, 55, 0.1)'
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'orders') {
                e.target.style.background = 'transparent'
              }
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Orders
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className="w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-3"
            style={{
              background: activeTab === 'users' ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
              color: activeTab === 'users' ? '#D4AF37' : '#F5F5F5',
              border: activeTab === 'users' ? '1px solid rgba(212, 175, 55, 0.5)' : '1px solid transparent'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'users') {
                e.target.style.background = 'rgba(212, 175, 55, 0.1)'
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'users') {
                e.target.style.background = 'transparent'
              }
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Users
          </button>
        </nav>

        <div className="mt-auto pt-8 border-t" style={{ borderColor: 'rgba(212, 175, 55, 0.3)' }}>
          <div className="mb-4 px-4">
            <p 
              className="text-sm font-semibold"
              style={{ color: '#D4AF37' }}
            >
              {user?.name || 'Admin'}
            </p>
            <p 
              className="text-xs"
              style={{ color: '#F5F5F5' }}
            >
              {user?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-3"
            style={{
              background: 'rgba(220, 38, 38, 0.2)',
              color: '#FCA5A5',
              border: '1px solid rgba(220, 38, 38, 0.5)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(220, 38, 38, 0.3)'
              e.target.style.transform = 'scale(1.02)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(220, 38, 38, 0.2)'
              e.target.style.transform = 'scale(1)'
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {error && (
          <div 
            className="mb-6 p-4 rounded-lg"
            style={{
              background: 'rgba(220, 38, 38, 0.2)',
              border: '1px solid rgba(220, 38, 38, 0.5)',
              color: '#FCA5A5'
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12" style={{ color: '#F5F5F5' }}>
            Loading...
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <h2 
                  className="text-4xl font-bold mb-8"
                  style={{ color: '#D4AF37' }}
                >
                  Dashboard Overview
                </h2>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div 
                    className="p-6 rounded-xl transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'rgba(212, 175, 55, 0.1)',
                      border: '2px solid rgba(212, 175, 55, 0.3)',
                      boxShadow: '0 4px 15px rgba(212, 175, 55, 0.2)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 
                        className="text-sm font-semibold uppercase"
                        style={{ color: '#D4AF37' }}
                      >
                        Total Users
                      </h3>
                      <svg className="w-8 h-8" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <p 
                      className="text-3xl font-bold"
                      style={{ color: '#F5F5F5' }}
                    >
                      {summary?.totalUsers || 0}
                    </p>
                  </div>

                  <div 
                    className="p-6 rounded-xl transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'rgba(212, 175, 55, 0.1)',
                      border: '2px solid rgba(212, 175, 55, 0.3)',
                      boxShadow: '0 4px 15px rgba(212, 175, 55, 0.2)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 
                        className="text-sm font-semibold uppercase"
                        style={{ color: '#D4AF37' }}
                      >
                        Total Orders
                      </h3>
                      <svg className="w-8 h-8" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <p 
                      className="text-3xl font-bold"
                      style={{ color: '#F5F5F5' }}
                    >
                      {summary?.totalOrders || 0}
                    </p>
                  </div>

                  <div 
                    className="p-6 rounded-xl transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'rgba(212, 175, 55, 0.1)',
                      border: '2px solid rgba(212, 175, 55, 0.3)',
                      boxShadow: '0 4px 15px rgba(212, 175, 55, 0.2)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 
                        className="text-sm font-semibold uppercase"
                        style={{ color: '#D4AF37' }}
                      >
                        Total Products
                      </h3>
                      <svg className="w-8 h-8" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <p 
                      className="text-3xl font-bold"
                      style={{ color: '#F5F5F5' }}
                    >
                      {summary?.totalProducts || 0}
                    </p>
                  </div>

                  <div 
                    className="p-6 rounded-xl transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'rgba(212, 175, 55, 0.1)',
                      border: '2px solid rgba(212, 175, 55, 0.3)',
                      boxShadow: '0 4px 15px rgba(212, 175, 55, 0.2)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 
                        className="text-sm font-semibold uppercase"
                        style={{ color: '#D4AF37' }}
                      >
                        Total Revenue
                      </h3>
                      <svg className="w-8 h-8" style={{ color: '#D4AF37' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p 
                      className="text-3xl font-bold"
                      style={{ color: '#F5F5F5' }}
                    >
                      ${summary?.totalRevenue?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Sales Chart */}
                  <div 
                    className="p-6 rounded-xl"
                    style={{
                      background: 'rgba(245, 245, 245, 0.05)',
                      border: '2px solid rgba(212, 175, 55, 0.3)',
                      boxShadow: '0 4px 15px rgba(212, 175, 55, 0.2)'
                    }}
                  >
                    <h3 
                      className="text-xl font-bold mb-4"
                      style={{ color: '#D4AF37' }}
                    >
                      Monthly Sales
                    </h3>
                    {monthlySalesData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlySalesData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(212, 175, 55, 0.2)" />
                          <XAxis 
                            dataKey="month" 
                            stroke="#D4AF37"
                            angle={-45}
                            textAnchor="end"
                            height={80}
                          />
                          <YAxis 
                            stroke="#D4AF37"
                            tickFormatter={(value) => `$${value.toFixed(0)}`}
                          />
                          <Tooltip 
                            contentStyle={{
                              background: '#1a1a1a',
                              border: '1px solid rgba(212, 175, 55, 0.3)',
                              color: '#F5F5F5'
                            }}
                            formatter={(value) => `$${Number(value).toFixed(2)}`}
                          />
                          <Legend />
                          <Bar dataKey="sales" fill="#D4AF37" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-12" style={{ color: '#F5F5F5' }}>
                        No sales data available
                      </div>
                    )}
                  </div>

                  {/* Orders Distribution Pie Chart */}
                  <div 
                    className="p-6 rounded-xl"
                    style={{
                      background: 'rgba(245, 245, 245, 0.05)',
                      border: '2px solid rgba(212, 175, 55, 0.3)',
                      boxShadow: '0 4px 15px rgba(212, 175, 55, 0.2)'
                    }}
                  >
                    <h3 
                      className="text-xl font-bold mb-4"
                      style={{ color: '#D4AF37' }}
                    >
                      Orders Distribution
                    </h3>
                    {orderDistributionData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={orderDistributionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {orderDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{
                              background: '#1a1a1a',
                              border: '1px solid rgba(212, 175, 55, 0.3)',
                              color: '#F5F5F5'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-12" style={{ color: '#F5F5F5' }}>
                        No orders data available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 
                  className="text-4xl font-bold mb-8"
                  style={{ color: '#D4AF37' }}
                >
                  Recent Orders
                </h2>
                <div 
                  className="rounded-xl overflow-hidden"
                  style={{
                    background: 'rgba(245, 245, 245, 0.05)',
                    border: '2px solid rgba(212, 175, 55, 0.3)',
                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.2)'
                  }}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ borderBottom: '2px solid rgba(212, 175, 55, 0.3)' }}>
                          <th className="px-6 py-4 text-left" style={{ color: '#D4AF37' }}>Order ID</th>
                          <th className="px-6 py-4 text-left" style={{ color: '#D4AF37' }}>User</th>
                          <th className="px-6 py-4 text-left" style={{ color: '#D4AF37' }}>Product</th>
                          <th className="px-6 py-4 text-left" style={{ color: '#D4AF37' }}>Quantity</th>
                          <th className="px-6 py-4 text-left" style={{ color: '#D4AF37' }}>Total</th>
                          <th className="px-6 py-4 text-left" style={{ color: '#D4AF37' }}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.length > 0 ? (
                          orders.map((order) => {
                            const totalQuantity = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
                            const productsList = order.items?.map(item => item.product_name).join(', ') || 'N/A'
                            return (
                              <tr 
                                key={order.id}
                                style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.1)' }}
                                className="hover:bg-opacity-10"
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)'
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'transparent'
                                }}
                              >
                                <td className="px-6 py-4" style={{ color: '#F5F5F5' }}>{order.id}</td>
                                <td className="px-6 py-4" style={{ color: '#F5F5F5' }}>{order.user_name}</td>
                                <td className="px-6 py-4" style={{ color: '#F5F5F5' }}>
                                  <div className="max-w-xs truncate" title={productsList}>
                                    {productsList}
                                  </div>
                                </td>
                                <td className="px-6 py-4" style={{ color: '#F5F5F5' }}>{totalQuantity}</td>
                                <td className="px-6 py-4" style={{ color: '#D4AF37', fontWeight: 'bold' }}>
                                  ${Number(order.total).toFixed(2)}
                                </td>
                                <td className="px-6 py-4" style={{ color: '#F5F5F5' }}>
                                  {new Date(order.order_date).toLocaleDateString()}
                                </td>
                              </tr>
                            )
                          })
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-6 py-8 text-center" style={{ color: '#F5F5F5' }}>
                              No orders found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <h2 
                  className="text-4xl font-bold mb-8"
                  style={{ color: '#D4AF37' }}
                >
                  User Management
                </h2>
                <div 
                  className="rounded-xl overflow-hidden"
                  style={{
                    background: 'rgba(245, 245, 245, 0.05)',
                    border: '2px solid rgba(212, 175, 55, 0.3)',
                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.2)'
                  }}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ borderBottom: '2px solid rgba(212, 175, 55, 0.3)' }}>
                          <th className="px-6 py-4 text-left" style={{ color: '#D4AF37' }}>ID</th>
                          <th className="px-6 py-4 text-left" style={{ color: '#D4AF37' }}>Name</th>
                          <th className="px-6 py-4 text-left" style={{ color: '#D4AF37' }}>Email</th>
                          <th className="px-6 py-4 text-left" style={{ color: '#D4AF37' }}>Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length > 0 ? (
                          users.map((user) => (
                            <tr 
                              key={user.id}
                              style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.1)' }}
                              className="hover:bg-opacity-10"
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent'
                              }}
                            >
                              <td className="px-6 py-4" style={{ color: '#F5F5F5' }}>{user.id}</td>
                              <td className="px-6 py-4" style={{ color: '#F5F5F5' }}>{user.name}</td>
                              <td className="px-6 py-4" style={{ color: '#F5F5F5' }}>{user.email}</td>
                              <td className="px-6 py-4">
                                <span 
                                  className="px-3 py-1 rounded-full text-xs font-semibold"
                                  style={{
                                    background: user.role === 'admin' ? 'rgba(212, 175, 55, 0.2)' : 'rgba(245, 245, 245, 0.1)',
                                    color: user.role === 'admin' ? '#D4AF37' : '#F5F5F5',
                                    border: `1px solid ${user.role === 'admin' ? 'rgba(212, 175, 55, 0.5)' : 'rgba(245, 245, 245, 0.3)'}`
                                  }}
                                >
                                  {user.role || 'user'}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="px-6 py-8 text-center" style={{ color: '#F5F5F5' }}>
                              No users found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
