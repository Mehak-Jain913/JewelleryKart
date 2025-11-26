import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('auth')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setUser(parsed.user)
        setToken(parsed.token)
      } catch {}
    }
  }, [])

  const login = (nextUser, nextToken) => {
    setUser(nextUser)
    setToken(nextToken)
    localStorage.setItem('auth', JSON.stringify({ user: nextUser, token: nextToken }))
    if (nextUser?.role) {
      localStorage.setItem('userRole', nextUser.role)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('auth')
    localStorage.removeItem('userRole')
  }

  const value = useMemo(() => ({ user, token, login, logout }), [user, token])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)




