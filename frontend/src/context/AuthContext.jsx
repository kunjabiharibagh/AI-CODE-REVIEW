import { createContext, useContext, useState, useEffect } from 'react'
import { getProfile } from '../services/api'

// Create context
const AuthContext = createContext()

// Provider component - wraps whole app
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is already logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Verify token is still valid
      getProfile()
        .then(res => {
          setUser(res.data.user)
        })
        .catch(() => {
          // Token invalid - clear it
          localStorage.removeItem('token')
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  // Login - save token and user
  const login = (token, userData) => {
    localStorage.setItem('token', token)
    setUser(userData)
  }

  // Logout - clear token and user
  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  return useContext(AuthContext)
}