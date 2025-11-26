import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useEffect } from 'react'

const ProtectedAdminRoute = ({ children }) => {
  const { user } = useAuth()
  const navigate = useNavigate()

  // FIX: Added email verification for admin access
  const ADMIN_EMAIL = "mehakj1208@gmail.com"

  useEffect(() => {
    if (user && (user.role !== 'admin' || user.email !== ADMIN_EMAIL)) {
      // Redirect after showing message briefly
      const timer = setTimeout(() => {
        navigate('/', { replace: true })
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [user, navigate])

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  // IMPROVED: Check both role and email for admin access
  if (user.role !== 'admin' || user.email !== ADMIN_EMAIL) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)'
        }}
      >
        <div 
          className="text-center p-8 rounded-xl max-w-md w-full animate-scale-in"
          style={{
            background: 'rgba(212, 175, 55, 0.1)',
            border: '2px solid rgba(220, 38, 38, 0.5)',
            boxShadow: '0 4px 20px rgba(220, 38, 38, 0.3)'
          }}
        >
          <h2 
            className="text-3xl font-bold mb-4"
            style={{ color: '#FCA5A5' }}
          >
            Access Denied
          </h2>
          <p 
            className="text-lg mb-6"
            style={{ color: '#F5F5F5' }}
          >
            You do not have permission to access this page. Admin privileges required.
          </p>
          <p 
            className="text-sm"
            style={{ color: '#D4AF37' }}
          >
            Redirecting to home...
          </p>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedAdminRoute

