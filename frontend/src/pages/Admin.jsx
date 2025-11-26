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
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
        padding: '20px 0'
      }}
    >
      {/* Top Bar with Brand */}
      <div 
        className="mb-8 py-4 px-6 rounded-lg"
        style={{
          background: 'linear-gradient(90deg, #D4AF37, #F5D76E)',
          boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)'
        }}
      >
        <div className="container mx-auto flex items-center justify-between">
          <h2 
            className="text-4xl font-bold font-display"
            style={{ color: '#000000' }}
          >
            Admin Dashboard
          </h2>
          <Link
            to="/admin-dashboard"
            className="px-6 py-2 rounded-lg font-semibold transition-all duration-300"
            style={{
              background: '#000000',
              color: '#D4AF37',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#1a1a1a'
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#000000'
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)'
            }}
          >
            View Dashboard
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6">
        {/* Error Message */}
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

        {/* Add New Product Section */}
        <div 
          className="mb-8 p-6 rounded-xl"
          style={{
            background: 'rgba(212, 175, 55, 0.1)',
            border: '2px solid rgba(212, 175, 55, 0.3)',
            boxShadow: '0 4px 15px rgba(212, 175, 55, 0.2)',
            color: '#ffff'
          }}
        >
          <h3 
            className="text-2xl font-semibold mb-4 font-display"
            style={{ color: '#D4AF37' }}
          >
            Add New Product
          </h3>
          <ProductForm onSubmit={handleCreate} submitLabel="Add" />
        </div>

        {/* Manage Products Section */}
        <div 
          className="p-6 rounded-xl overflow-x-auto"
          style={{
            background: 'rgba(245, 245, 245, 0.05)',
            border: '2px solid rgba(212, 175, 55, 0.3)',
            boxShadow: '0 4px 15px rgba(212, 175, 55, 0.2)'
          }}
        >
          <h3 
            className="text-2xl font-semibold mb-6 font-display"
            style={{ color: '#D4AF37' }}
          >
            Manage Products
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
                  <tr>
                    <th 
                      className="py-3 px-4 text-sm font-semibold"
                      style={{ color: '#D4AF37', borderBottom: '2px solid rgba(212, 175, 55, 0.3)' }}
                    >
                      ID
                    </th>
                    <th 
                      className="py-3 px-4 text-sm font-semibold"
                      style={{ color: '#D4AF37', borderBottom: '2px solid rgba(212, 175, 55, 0.3)' }}
                    >
                      Name
                    </th>
                    <th 
                      className="py-3 px-4 text-sm font-semibold"
                      style={{ color: '#D4AF37', borderBottom: '2px solid rgba(212, 175, 55, 0.3)' }}
                    >
                      Type
                    </th>
                    <th 
                      className="py-3 px-4 text-sm font-semibold"
                      style={{ color: '#D4AF37', borderBottom: '2px solid rgba(212, 175, 55, 0.3)' }}
                    >
                      Price
                    </th>
                    <th 
                      className="py-3 px-4 text-sm font-semibold"
                      style={{ color: '#D4AF37', borderBottom: '2px solid rgba(212, 175, 55, 0.3)' }}
                    >
                      Qty
                    </th>
                    <th 
                      className="py-3 px-4 text-sm font-semibold"
                      style={{ color: '#D4AF37', borderBottom: '2px solid rgba(212, 175, 55, 0.3)' }}
                    >
                      Image
                    </th>
                    <th 
                      className="py-3 px-4 text-sm font-semibold"
                      style={{ color: '#D4AF37', borderBottom: '2px solid rgba(212, 175, 55, 0.3)' }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr 
                      key={p.id} 
                      className="align-top"
                      style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.1)' }}
                    >
                      <td 
                        className="py-4 px-4"
                        style={{ color: '#F5F5F5' }}
                      >
                        {p.id}
                      </td>
                      <td className="py-4 px-4">
                        {editing === p.id ? (
                          <ProductForm 
                            initialValues={p} 
                            onSubmit={(data) => handleUpdate(p.id, data)} 
                            submitLabel="Update" 
                            onCancel={() => setEditing(null)} 
                          />
                        ) : (
                          <div>
                            <div 
                              className="font-semibold mb-1"
                              style={{ color: '#F5F5F5' }}
                            >
                              {p.name}
                            </div>
                            <div 
                              className="text-sm max-w-md line-clamp-2"
                              style={{ color: '#D4AF37' }}
                            >
                              {p.description}
                            </div>
                          </div>
                        )}
                      </td>
                      <td 
                        className="py-4 px-4"
                        style={{ color: '#F5F5F5' }}
                      >
                        {p.type}
                      </td>
                      <td 
                        className="py-4 px-4 font-semibold"
                        style={{ color: '#D4AF37' }}
                      >
                        ${Number(p.price).toFixed(2)}
                      </td>
                      <td 
                        className="py-4 px-4"
                        style={{ color: '#F5F5F5' }}
                      >
                        {p.quantity}
                      </td>
                      <td 
                        className="py-4 px-4 truncate max-w-[200px]"
                        style={{ color: '#F5F5F5' }}
                      >
                        {p.image_url || '-'}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {editing === p.id ? null : (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setEditing(p.id)} 
                              className="px-4 py-2 rounded-lg font-semibold transition-all duration-300"
                              style={{
                                background: 'rgba(212, 175, 55, 0.2)',
                                color: '#D4AF37',
                                border: '1px solid rgba(212, 175, 55, 0.5)'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(212, 175, 55, 0.3)'
                                e.target.style.transform = 'scale(1.05)'
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(212, 175, 55, 0.2)'
                                e.target.style.transform = 'scale(1)'
                              }}
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(p.id)} 
                              className="px-4 py-2 rounded-lg font-semibold transition-all duration-300"
                              style={{
                                background: 'rgba(220, 38, 38, 0.2)',
                                color: '#FCA5A5',
                                border: '1px solid rgba(220, 38, 38, 0.5)'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(220, 38, 38, 0.3)'
                                e.target.style.transform = 'scale(1.05)'
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(220, 38, 38, 0.2)'
                                e.target.style.transform = 'scale(1)'
                              }}
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
                        className="py-8 text-center" 
                        colSpan={7}
                        style={{ color: '#F5F5F5' }}
                      >
                        No products yet.
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


