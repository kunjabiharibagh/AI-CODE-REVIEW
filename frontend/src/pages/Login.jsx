import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginUser } from '../services/api'

function Login() {
  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Get login function from context
  const { login } = useAuth()

  // For redirecting after login
  const navigate = useNavigate()

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('Logging in...')

      // Call backend login API
      const res = await loginUser({ email, password })
      console.log('Login response:', res.data)

      // Save token and user in context
      login(res.data.token, res.data.user)

      // Redirect to dashboard
      navigate('/dashboard')

    } catch (err) {
      console.log('Login error:', err)
      // Show error message from backend
      setError(err.response?.data?.error || 'Login failed. Try again.')
    }

    setLoading(false)
  }

  return (
    <div style={styles.container}>

      {/* Card */}
      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logoBox}>
          <span style={styles.logoIcon}>{'</>'}</span>
        </div>
        <h1 style={styles.title}>CodeSense AI</h1>
        <p style={styles.subtitle}>Sign in to your account</p>

        {/* Error Message */}
        {error && (
          <div style={styles.error}>
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>

          {/* Email */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          {/* Password */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>

        </form>

        {/* Register Link */}
        <p style={styles.bottomText}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>
            Register free
          </Link>
        </p>

      </div>
    </div>
  )
}

// ─── Styles ───────────────────────────────────────
const styles = {
  container: {
    minHeight: '100vh',
    background: '#0a0a0f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: "'Segoe UI', sans-serif"
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(167,139,250,0.2)',
    borderRadius: '20px',
    padding: '40px',
    textAlign: 'center',
    animation: 'fadeIn 0.4s ease'
  },
  logoBox: {
    width: '60px',
    height: '60px',
    background: 'linear-gradient(135deg,#7c3aed,#ec4899)',
    borderRadius: '16px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px'
  },
  logoIcon: {
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold'
  },
  title: {
    fontSize: '26px',
    fontWeight: '700',
    background: 'linear-gradient(135deg,#c4b5fd,#f9a8d4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '0 0 8px'
  },
  subtitle: {
    color: '#64748b',
    fontSize: '14px',
    marginBottom: '28px'
  },
  error: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '10px',
    padding: '12px',
    color: '#f87171',
    fontSize: '13px',
    marginBottom: '20px',
    textAlign: 'left'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    textAlign: 'left'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#94a3b8'
  },
  input: {
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(167,139,250,0.25)',
    borderRadius: '10px',
    color: '#f1f5f9',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s'
  },
  button: {
    marginTop: '8px',
    padding: '13px',
    background: 'linear-gradient(135deg,#7c3aed,#6d28d9)',
    border: 'none',
    borderRadius: '10px',
    color: 'white',
    fontSize: '15px',
    fontWeight: '700',
    fontFamily: 'inherit',
    boxShadow: '0 4px 20px rgba(124,58,237,0.35)',
    transition: 'all 0.2s'
  },
  bottomText: {
    marginTop: '24px',
    fontSize: '13px',
    color: '#475569'
  },
  link: {
    color: '#a78bfa',
    textDecoration: 'none',
    fontWeight: '600'
  }
}

export default Login