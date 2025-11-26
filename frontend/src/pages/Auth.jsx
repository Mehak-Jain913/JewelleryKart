import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const Auth = () => {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'signup') {
        if (!name.trim()) return setError('Name is required')
      }
      if (!email.includes('@')) return setError('Valid email is required')
      if (password.length < 6) return setError('Password must be at least 6 characters')
      const url = mode === 'login' ? `${API_BASE}/api/users/login` : `${API_BASE}/api/users/register`
      const payload = mode === 'login' ? { email, password } : { name, email, password }
      const res = await axios.post(url, payload)
      login(res.data.user, res.data.token)
      // Redirect admin to admin dashboard, regular users to products
      if (res.data.user?.role === 'admin') {
        navigate('/admin-dashboard')
      } else {
        navigate('/products')
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{
        background: 'linear-gradient(135deg, #000000 0%, #D4AF37 100%)'
      }}
    >
      <div 
        className="w-full max-w-md animate-scale-in"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          padding: '40px',
          borderRadius: '15px',
          boxShadow: '0 0 30px rgba(212, 175, 55, 0.4)',
          border: '1px solid rgba(212, 175, 55, 0.3)'
        }}
      >
        <h2 
          className="text-4xl font-bold mb-8 text-center font-display"
          style={{ color: '#F5F5F5' }}
        >
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        <form onSubmit={onSubmit} className="space-y-6">
          {mode === 'signup' && (
            <div>
              <label 
                className="block text-sm font-semibold mb-2"
                style={{ color: '#D4AF37' }}
              >
                Name
              </label>
              <input 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full rounded-lg px-4 py-3 border-2 transition-all duration-300 focus:outline-none"
                style={{
                  borderColor: '#D4AF37',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  color: '#000000'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#F5D76E'
                  e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.2)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#D4AF37'
                  e.target.style.boxShadow = 'none'
                }}
                placeholder="Enter your name"
              />
            </div>
          )}
          
          <div>
            <label 
              className="block text-sm font-semibold mb-2"
              style={{ color: '#D4AF37' }}
            >
              Email
            </label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full rounded-lg px-4 py-3 border-2 transition-all duration-300 focus:outline-none"
              style={{
                borderColor: '#D4AF37',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: '#000000'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#F5D76E'
                e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.2)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#D4AF37'
                e.target.style.boxShadow = 'none'
              }}
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label 
              className="block text-sm font-semibold mb-2"
              style={{ color: '#D4AF37' }}
            >
              Password
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full rounded-lg px-4 py-3 border-2 transition-all duration-300 focus:outline-none"
              style={{
                borderColor: '#D4AF37',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: '#000000'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#F5D76E'
                e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.2)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#D4AF37'
                e.target.style.boxShadow = 'none'
              }}
              placeholder="Enter your password"
            />
          </div>
          
          {error && (
            <div 
              className="text-sm p-3 rounded-lg"
              style={{
                backgroundColor: 'rgba(220, 38, 38, 0.2)',
                color: '#FEE2E2',
                border: '1px solid rgba(220, 38, 38, 0.5)'
              }}
            >
              {error}
            </div>
          )}
          
          <button 
            disabled={loading} 
            className="w-full py-3 rounded-lg font-semibold text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(90deg, #D4AF37, #F5D76E)',
              boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'scale(1.05)'
                e.target.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.5)'
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)'
              e.target.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.3)'
            }}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>
        
        <div className="text-center mt-6">
          {mode === 'login' ? (
            <button 
              onClick={() => setMode('signup')} 
              className="text-sm transition-colors duration-300"
              style={{ color: '#F5F5F5' }}
              onMouseEnter={(e) => e.target.style.color = '#D4AF37'}
              onMouseLeave={(e) => e.target.style.color = '#F5F5F5'}
            >
              Don't have an account? <span className="font-semibold underline">Sign up</span>
            </button>
          ) : (
            <button 
              onClick={() => setMode('login')} 
              className="text-sm transition-colors duration-300"
              style={{ color: '#F5F5F5' }}
              onMouseEnter={(e) => e.target.style.color = '#D4AF37'}
              onMouseLeave={(e) => e.target.style.color = '#F5F5F5'}
            >
              Already have an account? <span className="font-semibold underline">Login</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Auth


