import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

// Protected route component
// If not logged in redirect to login
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      color: '#a78bfa'
    }}>
      Loading...
    </div>
  )

  return user ? children : <Navigate to="/login" />
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected route */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </AuthProvider>
  )
}

export default App