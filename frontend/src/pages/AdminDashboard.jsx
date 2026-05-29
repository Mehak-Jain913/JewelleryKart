import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate, Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Users, ShoppingBag, Box, DollarSign, LogOut, LayoutDashboard } from 'lucide-react'

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
      className="min-h-screen flex text-white font-sans"
      style={{
        background: 'radial-gradient(circle at 50% 50%, #121212 0%, #080808 100%)'
      }}
    >
      {/* Sidebar */}
      <div 
        className="w-64 min-h-screen p-6 flex flex-col justify-between backdrop-blur-md"
        style={{
          background: 'rgba(10, 10, 10, 0.95)',
          borderRight: '1px solid rgba(212, 175, 55, 0.15)',
          boxShadow: '10px 0 30px rgba(0, 0, 0, 0.8)'
        }}
      >
        <div>
          <div className="mb-10 text-center border-b border-[#D4AF37]/20 pb-6">
            <Link to="/" className="text-3xl font-black font-display tracking-widest text-[#D4AF37] block hover:opacity-80 transition-opacity">
              JEWELUXE
            </Link>
            <p className="text-xs uppercase tracking-widest text-gray-500 mt-2 font-semibold">
              Management Portal
            </p>
          </div>

          <nav className="space-y-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="w-full px-4 py-3.5 rounded-xl transition-all duration-300 flex items-center gap-4 text-sm font-semibold tracking-wide cursor-pointer"
              style={{
                background: activeTab === 'dashboard' ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)' : 'transparent',
                color: activeTab === 'dashboard' ? '#D4AF37' : '#A0A0A0',
                border: activeTab === 'dashboard' ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid transparent',
                boxShadow: activeTab === 'dashboard' ? '0 4px 15px rgba(212, 175, 55, 0.1)' : 'none'
              }}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>

            <Link
              to="/admin"
              className="w-full px-4 py-3.5 rounded-xl transition-all duration-300 flex items-center gap-4 text-sm font-semibold tracking-wide text-[#A0A0A0] hover:text-[#D4AF37] border border-transparent hover:border-[#D4AF37]/20 hover:bg-[#D4AF37]/5"
            >
              <Box className="w-5 h-5" />
              Products List
            </Link>

            <button
              onClick={() => setActiveTab('orders')}
              className="w-full px-4 py-3.5 rounded-xl transition-all duration-300 flex items-center gap-4 text-sm font-semibold tracking-wide cursor-pointer"
              style={{
                background: activeTab === 'orders' ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)' : 'transparent',
                color: activeTab === 'orders' ? '#D4AF37' : '#A0A0A0',
                border: activeTab === 'orders' ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid transparent',
                boxShadow: activeTab === 'orders' ? '0 4px 15px rgba(212, 175, 55, 0.1)' : 'none'
              }}
            >
              <ShoppingBag className="w-5 h-5" />
              Orders
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className="w-full px-4 py-3.5 rounded-xl transition-all duration-300 flex items-center gap-4 text-sm font-semibold tracking-wide cursor-pointer"
              style={{
                background: activeTab === 'users' ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)' : 'transparent',
                color: activeTab === 'users' ? '#D4AF37' : '#A0A0A0',
                border: activeTab === 'users' ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid transparent',
                boxShadow: activeTab === 'users' ? '0 4px 15px rgba(212, 175, 55, 0.1)' : 'none'
              }}
            >
              <Users className="w-5 h-5" />
              Users
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-[#D4AF37]/15">
          <div className="mb-5 px-3">
            <p className="text-sm font-bold text-[#D4AF37] truncate">{user?.name || 'Administrator'}</p>
            <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-4 text-sm font-semibold tracking-wide bg-red-950/20 hover:bg-red-900/30 text-red-300 border border-red-900/30 hover:border-red-500/50 hover:shadow-[0_4px_15px_rgba(239,68,68,0.1)] active:scale-[0.98] cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto flex flex-col">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/30 border border-red-500/50 text-red-200 animate-scale-in text-sm flex items-center gap-3">
            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
            <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-semibold tracking-widest text-[#D4AF37] uppercase">Loading Dashboard...</p>
          </div>
        ) : (
          <div className="animate-fade-in flex-1 flex flex-col">
            {activeTab === 'dashboard' && (
              <div className="space-y-8 flex-1 flex flex-col">
                <div className="flex items-center justify-between border-b border-[#D4AF37]/10 pb-5">
                  <div>
                    <h2 className="text-4xl font-extrabold font-display tracking-tight text-white">
                      Dashboard Overview
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">Real-time boutique performance, statistics, and orders tracking.</p>
                  </div>
                  <div className="text-xs uppercase tracking-widest px-4 py-2 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] font-bold">
                    SYSTEM LIVE
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Card 1 */}
                  <div 
                    className="p-6 rounded-2xl transition-all duration-300 hover:scale-[1.03]"
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(212, 175, 55, 0.15)',
                      backdropFilter: 'blur(12px)',
                      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        Total Users
                      </h3>
                      <div className="p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                        <Users className="w-6 h-6 text-[#D4AF37]" />
                      </div>
                    </div>
                    <p className="text-3xl font-extrabold text-white tracking-tight">
                      {summary?.totalUsers || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Registered client accounts</p>
                  </div>

                  {/* Card 2 */}
                  <div 
                    className="p-6 rounded-2xl transition-all duration-300 hover:scale-[1.03]"
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(212, 175, 55, 0.15)',
                      backdropFilter: 'blur(12px)',
                      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        Total Orders
                      </h3>
                      <div className="p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                        <ShoppingBag className="w-6 h-6 text-[#D4AF37]" />
                      </div>
                    </div>
                    <p className="text-3xl font-extrabold text-white tracking-tight">
                      {summary?.totalOrders || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Completed checkouts</p>
                  </div>

                  {/* Card 3 */}
                  <div 
                    className="p-6 rounded-2xl transition-all duration-300 hover:scale-[1.03]"
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(212, 175, 55, 0.15)',
                      backdropFilter: 'blur(12px)',
                      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        Boutique Items
                      </h3>
                      <div className="p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                        <Box className="w-6 h-6 text-[#D4AF37]" />
                      </div>
                    </div>
                    <p className="text-3xl font-extrabold text-white tracking-tight">
                      {summary?.totalProducts || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Total active catalog products</p>
                  </div>

                  {/* Card 4 */}
                  <div 
                    className="p-6 rounded-2xl transition-all duration-300 hover:scale-[1.03]"
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(212, 175, 55, 0.15)',
                      backdropFilter: 'blur(12px)',
                      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        Total Revenue
                      </h3>
                      <div className="p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                        <DollarSign className="w-6 h-6 text-[#D4AF37]" />
                      </div>
                    </div>
                    <p className="text-3xl font-extrabold text-[#D4AF37] tracking-tight">
                      ${summary?.totalRevenue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Total gross revenue</p>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Sales Chart */}
                  <div 
                    className="p-6 rounded-2xl"
                    style={{
                      background: 'rgba(20, 20, 20, 0.4)',
                      border: '1px solid rgba(212, 175, 55, 0.12)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-white font-display tracking-wide">
                        Sales Performance
                      </h3>
                      <span className="text-xs text-gray-400">Last 12 Months</span>
                    </div>
                    {monthlySalesData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlySalesData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(212, 175, 55, 0.05)" />
                          <XAxis 
                            dataKey="month" 
                            stroke="#8A8A8A"
                            fontSize={11}
                            tickLine={false}
                          />
                          <YAxis 
                            stroke="#8A8A8A"
                            fontSize={11}
                            tickLine={false}
                            tickFormatter={(value) => `$${value}`}
                          />
                          <Tooltip 
                            contentStyle={{
                              background: 'rgba(15, 15, 15, 0.95)',
                              border: '1px solid rgba(212, 175, 55, 0.3)',
                              borderRadius: '12px',
                              color: '#F5F5F5',
                              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                              fontSize: 12
                            }}
                            formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Sales']}
                          />
                          <Bar dataKey="sales" fill="url(#goldGradient)" radius={[6, 6, 0, 0]}>
                            {monthlySalesData.map((entry, index) => (
                              <Cell key={`cell-${index}`} />
                            ))}
                          </Bar>
                          <defs>
                            <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#F5D76E" stopOpacity={1} />
                              <stop offset="100%" stopColor="#B08B3A" stopOpacity={0.8} />
                            </linearGradient>
                          </defs>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-20 text-gray-500 text-sm">
                        No sales data available currently.
                      </div>
                    )}
                  </div>

                  {/* Orders Distribution Pie Chart */}
                  <div 
                    className="p-6 rounded-2xl"
                    style={{
                      background: 'rgba(20, 20, 20, 0.4)',
                      border: '1px solid rgba(212, 175, 55, 0.12)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-white font-display tracking-wide">
                        Top Customers Share
                      </h3>
                      <span className="text-xs text-gray-400">Order Share %</span>
                    </div>
                    {orderDistributionData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={orderDistributionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={85}
                            dataKey="value"
                            fontSize={11}
                          >
                            {orderDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.4)" strokeWidth={2} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{
                              background: 'rgba(15, 15, 15, 0.95)',
                              border: '1px solid rgba(212, 175, 55, 0.3)',
                              borderRadius: '12px',
                              color: '#F5F5F5',
                              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                              fontSize: 12
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-20 text-gray-500 text-sm">
                        No orders data available currently.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6 flex-1 flex flex-col">
                <div className="border-b border-[#D4AF37]/10 pb-5">
                  <h2 className="text-4xl font-extrabold font-display tracking-tight text-white">
                    Order Registers
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">Review and manage recent boutique customer transactions.</p>
                </div>
                
                <div 
                  className="rounded-2xl border overflow-hidden flex-1"
                  style={{
                    background: 'rgba(20, 20, 20, 0.4)',
                    borderColor: 'rgba(212, 175, 55, 0.15)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  <div className="overflow-x-auto h-full">
                    <table className="w-full text-left text-sm text-gray-300">
                      <thead>
                        <tr className="bg-black/60 border-b border-[#D4AF37]/20">
                          <th className="px-6 py-4 font-semibold tracking-wider text-xs uppercase text-[#D4AF37]">Order ID</th>
                          <th className="px-6 py-4 font-semibold tracking-wider text-xs uppercase text-[#D4AF37]">Customer</th>
                          <th className="px-6 py-4 font-semibold tracking-wider text-xs uppercase text-[#D4AF37]">Items Purchased</th>
                          <th className="px-6 py-4 font-semibold tracking-wider text-xs uppercase text-[#D4AF37] text-center">Items Qty</th>
                          <th className="px-6 py-4 font-semibold tracking-wider text-xs uppercase text-[#D4AF37] text-right">Total amount</th>
                          <th className="px-6 py-4 font-semibold tracking-wider text-xs uppercase text-[#D4AF37]">Purchase Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#D4AF37]/10">
                        {orders.length > 0 ? (
                          orders.map((order) => {
                            const totalQuantity = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
                            const productsList = order.items?.map(item => item.product_name).join(', ') || 'N/A'
                            return (
                              <tr 
                                key={order.id}
                                className="hover:bg-[#D4AF37]/5 transition-colors duration-200"
                              >
                                <td className="px-6 py-4 font-mono font-medium text-[#D4AF37]">#{order.id}</td>
                                <td className="px-6 py-4">
                                  <div className="font-semibold text-white">{order.user_name}</div>
                                  <div className="text-xs text-gray-500">{order.user_email}</div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="max-w-xs truncate text-white" title={productsList}>
                                    {productsList}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-center font-semibold text-white">{totalQuantity}</td>
                                <td className="px-6 py-4 text-right font-extrabold text-[#D4AF37]">
                                  ${Number(order.total).toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-gray-400">
                                  {new Date(order.order_date).toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'short', day: 'numeric',
                                    hour: '2-digit', minute: '2-digit'
                                  })}
                                </td>
                              </tr>
                            )
                          })
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                              No customer orders recorded yet.
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
              <div className="space-y-6 flex-1 flex flex-col">
                <div className="border-b border-[#D4AF37]/10 pb-5">
                  <h2 className="text-4xl font-extrabold font-display tracking-tight text-white">
                    User Management
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">Review user roles, emails, and directory listings.</p>
                </div>

                <div 
                  className="rounded-2xl border overflow-hidden flex-1"
                  style={{
                    background: 'rgba(20, 20, 20, 0.4)',
                    borderColor: 'rgba(212, 175, 55, 0.15)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  <div className="overflow-x-auto h-full">
                    <table className="w-full text-left text-sm text-gray-300">
                      <thead>
                        <tr className="bg-black/60 border-b border-[#D4AF37]/20">
                          <th className="px-6 py-4 font-semibold tracking-wider text-xs uppercase text-[#D4AF37]">User ID</th>
                          <th className="px-6 py-4 font-semibold tracking-wider text-xs uppercase text-[#D4AF37]">Full Name</th>
                          <th className="px-6 py-4 font-semibold tracking-wider text-xs uppercase text-[#D4AF37]">Email Address</th>
                          <th className="px-6 py-4 font-semibold tracking-wider text-xs uppercase text-[#D4AF37]">System Access Role</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#D4AF37]/10">
                        {users.length > 0 ? (
                          users.map((u) => (
                            <tr 
                              key={u.id}
                              className="hover:bg-[#D4AF37]/5 transition-colors duration-200"
                            >
                              <td className="px-6 py-4 font-mono font-medium text-[#D4AF37]">#{u.id}</td>
                              <td className="px-6 py-4 font-semibold text-white">{u.name}</td>
                              <td className="px-6 py-4 text-gray-400">{u.email}</td>
                              <td className="px-6 py-4">
                                <span 
                                  className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                                  style={{
                                    background: u.role === 'admin' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                                    color: u.role === 'admin' ? '#D4AF37' : '#B0B0B0',
                                    border: `1px solid ${u.role === 'admin' ? 'rgba(212, 175, 55, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`
                                  }}
                                >
                                  {u.role || 'user'}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                              No registered users found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
