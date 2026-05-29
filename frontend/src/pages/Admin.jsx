import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import ProductForm from '../components/ProductForm.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const Admin = () => {
  const { token } = useAuth()
  const [products, setProducts] = useState([])
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // FIX: Added authentication headers for API calls
  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  const load = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_BASE}/api/products`)
      setProducts(res.data)
    } catch (e) {
      console.error(e)
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (data) => {
    setError('')
    try {
      await axios.post(`${API_BASE}/api/products`, data, { headers })
      await load()
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to create product')
      console.error(e)
    }
  }

  const handleUpdate = async (id, data) => {
    setError('')
    try {
      await axios.put(`${API_BASE}/api/products/${id}`, data, { headers })
      setEditing(null)
      await load()
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to update product')
      console.error(e)
    }
  }

  const handleDelete = async (id) => {
    setError('')
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      await axios.delete(`${API_BASE}/api/products/${id}`, { headers })
      await load()
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to delete product')
      console.error(e)
    }
  }

  return (
    <div 
      className="min-h-screen text-white font-sans"
      style={{
        background: 'radial-gradient(circle at 50% 50%, #121212 0%, #080808 100%)',
        padding: '30px 0'
      }}
    >
      {/* Top Bar with Brand */}
      <div 
        className="mb-10 py-5 px-8 rounded-2xl border"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          borderColor: 'rgba(212, 175, 55, 0.25)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 
              className="text-4xl font-extrabold font-display tracking-tight"
              style={{ color: '#D4AF37' }}
            >
              Product Inventory
            </h2>
            <p className="text-gray-400 text-sm mt-1">Add, update, or remove products from the boutique registry.</p>
          </div>
          <Link
            to="/admin-dashboard"
            className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-[#000000] bg-[#D4AF37] hover:bg-[#F5D76E] transition-all duration-300 shadow-[0_4px_15px_rgba(212,175,55,0.2)] active:scale-[0.98] cursor-pointer"
          >
            Go To Analytics Dashboard
          </Link>
        </div>
      </div>

      <div className="container mx-auto">
        {/* Error Message */}
        {error && (
          <div 
            className="mb-6 p-4 rounded-xl text-sm border bg-red-950/30 border-red-500/50 text-red-200 animate-scale-in flex items-center gap-3"
          >
            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        {/* Add New Product Section */}
        <div 
          className="mb-10 p-6 rounded-2xl border"
          style={{
            background: 'rgba(255, 255, 255, 0.01)',
            borderColor: 'rgba(212, 175, 55, 0.15)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)'
          }}
        >
          <h3 
            className="text-2xl font-bold mb-5 font-display text-[#D4AF37]"
          >
            Create New Product Listing
          </h3>
          <div className="text-white">
            <ProductForm onSubmit={handleCreate} submitLabel="Register Product" />
          </div>
        </div>

        {/* Manage Products Section */}
        <div 
          className="p-6 rounded-2xl border overflow-x-auto"
          style={{
            background: 'rgba(255, 255, 255, 0.01)',
            borderColor: 'rgba(212, 175, 55, 0.15)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)'
          }}
        >
          <h3 
            className="text-2xl font-bold mb-6 font-display text-[#D4AF37]"
          >
            Active Catalog Listings
          </h3>
          {loading ? (
            <div 
              className="text-center py-8"
              style={{ color: '#F5F5F5' }}
            >
              Loading...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-white">
                <thead>
                  <tr className="border-b border-[#D4AF37]/30 bg-black/40">
                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">ID</th>
                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Name & Description</th>
                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Category</th>
                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Price</th>
                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Quantity</th>
                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Image Link</th>
                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-wider text-[#D4AF37] text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4AF37]/10">
                  {products.map(p => (
                    <tr 
                      key={p.id} 
                      className="align-middle hover:bg-[#D4AF37]/5 transition-colors duration-200"
                    >
                      <td className="py-4 px-4 font-mono text-sm text-[#D4AF37]">#{p.id}</td>
                      <td className="py-4 px-4">
                        {editing === p.id ? (
                          <div className="bg-[#121212]/90 p-4 rounded-xl border border-[#D4AF37]/30">
                            <ProductForm 
                              initialValues={p} 
                              onSubmit={(data) => handleUpdate(p.id, data)} 
                              submitLabel="Save Changes" 
                              onCancel={() => setEditing(null)} 
                            />
                          </div>
                        ) : (
                          <div>
                            <div className="font-bold text-white mb-0.5 text-base">{p.name}</div>
                            <div className="text-xs text-gray-400 max-w-md line-clamp-2">{p.description || 'No description provided.'}</div>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 font-semibold text-gray-300">{p.type}</td>
                      <td className="py-4 px-4 font-extrabold text-[#D4AF37]">${Number(p.price).toFixed(2)}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${p.quantity > 0 ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-500/20' : 'bg-rose-950/30 text-rose-400 border border-rose-500/20'}`}>
                          {p.quantity} in stock
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {p.image_url ? (
                          <div className="flex items-center gap-3">
                            <img src={p.image_url} alt="" className="w-10 h-10 object-cover rounded-lg border border-[#D4AF37]/20" />
                            <span className="text-xs text-gray-500 truncate max-w-[120px]">{p.image_url}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500 font-medium">No image</span>
                        )}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-center">
                        {editing === p.id ? null : (
                          <div className="flex gap-2 justify-center">
                            <button 
                              onClick={() => setEditing(p.id)} 
                              className="px-3.5 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-300 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/35 text-[#D4AF37] border border-[#D4AF37]/35 hover:shadow-[0_2px_8px_rgba(212,175,55,0.15)] cursor-pointer"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(p.id)} 
                              className="px-3.5 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-300 bg-red-950/20 hover:bg-red-900/30 text-red-300 border border-red-900/30 hover:border-red-500/50 hover:shadow-[0_2px_8px_rgba(239,68,68,0.15)] cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td 
                        className="py-12 text-center text-gray-500" 
                        colSpan={7}
                      >
                        No boutique inventory products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Admin


