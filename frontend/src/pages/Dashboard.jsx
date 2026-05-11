import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { reviewCode, getHistory } from '../services/api'
import { useNavigate } from 'react-router-dom'

const LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python',
  'Java', 'C++', 'C#', 'Go', 'Rust',
  'PHP', 'Ruby', 'Kotlin', 'Swift'
]

function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('JavaScript')
  const [review, setReview] = useState(null)
  const [score, setScore] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])
  const [tab, setTab] = useState('editor')

  // Load history on page load
  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const res = await getHistory()
      setHistory(res.data.data)
      console.log('History loaded ✅:', res.data.data.length)
    } catch (err) {
      console.log('History error:', err)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleReview = async () => {
    if (!code.trim()) {
      return setError('Please paste some code first')
    }
    setError('')
    setLoading(true)
    setReview(null)
    setScore(null)

    try {
      const res = await reviewCode({ code, language })
      setReview(res.data.data.review)
      setScore(res.data.data.score)
      // Reload history after new review
      loadHistory()
    } catch (err) {
      setError(err.response?.data?.error || 'Review failed.')
    }

    setLoading(false)
  }

  return (
    <div style={styles.container}>

      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navLogo}>
          <div style={styles.logoBox}>{'</>'}</div>
          <span style={styles.logoText}>CodeSense AI</span>
        </div>
        <div style={styles.navRight}>
          <div style={styles.userBadge}>
            <div style={styles.onlineDot}/>
            <span style={styles.userName}>{user?.name}</span>
          </div>
          <div style={styles.reviewCountBadge}>
            🔍 {user?.reviewCount || 0} Reviews
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main */}
      <div style={styles.main}>

        {/* LEFT — Editor */}
        <div style={styles.leftPanel}>
          <div style={styles.panelHeader}>
            <h2 style={styles.panelTitle}>📝 Code Editor</h2>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={styles.select}
            >
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang}
                  style={{ background: '#1e1e2e' }}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// Paste your code here..."
            style={styles.textarea}
            spellCheck={false}
          />

          {error && <div style={styles.error}>⚠️ {error}</div>}

          <button
            onClick={handleReview}
            disabled={loading}
            style={{
              ...styles.analyzeBtn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '🔍 Analyzing...' : '🚀 Analyze with AI'}
          </button>
        </div>

        {/* RIGHT — Tabs */}
        <div style={styles.rightPanel}>

          {/* Tab Buttons */}
          <div style={styles.tabs}>
            <button
              onClick={() => setTab('editor')}
              style={{
                ...styles.tabBtn,
                background: tab === 'editor'
                  ? 'linear-gradient(135deg,#7c3aed,#6d28d9)'
                  : 'transparent',
                color: tab === 'editor' ? '#fff' : '#64748b'
              }}
            >
              🤖 AI Review
            </button>
            <button
              onClick={() => setTab('history')}
              style={{
                ...styles.tabBtn,
                background: tab === 'history'
                  ? 'linear-gradient(135deg,#7c3aed,#6d28d9)'
                  : 'transparent',
                color: tab === 'history' ? '#fff' : '#64748b'
              }}
            >
              📋 History ({history.length})
            </button>
          </div>

          {/* Review Tab */}
          {tab === 'editor' && (
            <div style={styles.reviewBox}>
              {!review && !loading && (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>🔍</div>
                  <p style={styles.emptyTitle}>No review yet</p>
                  <p style={styles.emptySubtitle}>
                    Paste code and click Analyze
                  </p>
                </div>
              )}
              {loading && (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>⏳</div>
                  <p style={styles.emptyTitle}>Analyzing...</p>
                  <p style={styles.emptySubtitle}>
                    AI is reviewing your code
                  </p>
                </div>
              )}
              {review && !loading && (
                <div>
                  {/* Score */}
                  {score !== null && (
                    <div style={{
                      ...styles.scoreBadge,
                      background: score >= 80
                        ? 'rgba(34,197,94,0.15)'
                        : score >= 60
                        ? 'rgba(245,158,11,0.15)'
                        : 'rgba(239,68,68,0.15)',
                      color: score >= 80 ? '#22c55e'
                        : score >= 60 ? '#f59e0b' : '#ef4444',
                      border: `1px solid ${score >= 80
                        ? 'rgba(34,197,94,0.3)'
                        : score >= 60
                        ? 'rgba(245,158,11,0.3)'
                        : 'rgba(239,68,68,0.3)'}`
                    }}>
                      Score: {score}/100 {score >= 80
                        ? '🟢 Excellent'
                        : score >= 60
                        ? '🟡 Good'
                        : '🔴 Needs Work'}
                    </div>
                  )}
                  <pre style={styles.reviewText}>{review}</pre>
                </div>
              )}
            </div>
          )}

          {/* History Tab */}
          {tab === 'history' && (
            <div style={styles.reviewBox}>
              {history.length === 0 ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>📋</div>
                  <p style={styles.emptyTitle}>No history yet</p>
                  <p style={styles.emptySubtitle}>
                    Your reviews will appear here
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {history.map((item) => (
                    <div key={item._id} style={styles.historyCard}>
                      {/* Language + Score */}
                      <div style={styles.historyHeader}>
                        <span style={styles.langBadge}>
                          {item.language}
                        </span>
                        {item.score !== null && (
                          <span style={{
                            fontSize: '13px',
                            fontWeight: '700',
                            color: item.score >= 80 ? '#22c55e'
                              : item.score >= 60 ? '#f59e0b'
                              : '#ef4444'
                          }}>
                            {item.score}/100
                          </span>
                        )}
                      </div>
                      {/* Code preview */}
                      <p style={styles.codePreview}>
                        {item.code.slice(0, 80)}...
                      </p>
                      {/* Date */}
                      <p style={styles.historyDate}>
                        🕐 {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Styles ───────────────────────────────────────
const styles = {
  container: {
    minHeight: '100vh',
    background: '#0a0a0f',
    fontFamily: "'Segoe UI', sans-serif",
    color: '#f1f5f9'
  },
  navbar: {
    height: '60px',
    background: 'rgba(10,10,15,0.95)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  navLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  logoBox: {
    width: '34px',
    height: '34px',
    background: 'linear-gradient(135deg,#7c3aed,#ec4899)',
    borderRadius: '9px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '12px'
  },
  logoText: {
    fontWeight: '700',
    fontSize: '17px',
    background: 'linear-gradient(135deg,#c4b5fd,#f9a8d4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  userBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    background: 'rgba(255,255,255,0.04)',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.08)'
  },
  onlineDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#22c55e'
  },
  userName: {
    fontSize: '13px',
    color: '#94a3b8'
  },
  reviewCountBadge: {
    padding: '6px 12px',
    background: 'rgba(124,58,237,0.1)',
    border: '1px solid rgba(124,58,237,0.2)',
    borderRadius: '20px',
    fontSize: '12px',
    color: '#a78bfa',
    fontWeight: '600'
  },
  logoutBtn: {
    padding: '6px 14px',
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.25)',
    borderRadius: '8px',
    color: '#f87171',
    fontSize: '12px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontWeight: '600'
  },
  main: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  leftPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  rightPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  panelTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#e2e8f0'
  },
  select: {
    padding: '8px 12px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(167,139,250,0.2)',
    borderRadius: '8px',
    color: '#e2e8f0',
    fontSize: '13px',
    fontFamily: 'inherit',
    cursor: 'pointer',
    outline: 'none'
  },
  textarea: {
    width: '100%',
    height: '400px',
    padding: '16px',
    background: '#0d0d18',
    border: '1px solid rgba(167,139,250,0.2)',
    borderRadius: '12px',
    color: '#e2e8f0',
    fontSize: '13px',
    fontFamily: "'Courier New', monospace",
    resize: 'none',
    outline: 'none',
    lineHeight: '1.6',
    boxSizing: 'border-box'
  },
  error: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '10px',
    padding: '12px',
    color: '#f87171',
    fontSize: '13px'
  },
  analyzeBtn: {
    padding: '14px',
    background: 'linear-gradient(135deg,#7c3aed,#6d28d9)',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontSize: '15px',
    fontWeight: '700',
    fontFamily: 'inherit',
    boxShadow: '0 4px 25px rgba(124,58,237,0.4)',
    transition: 'all 0.2s'
  },
  tabs: {
    display: 'flex',
    background: 'rgba(255,255,255,0.04)',
    borderRadius: '10px',
    padding: '4px',
    gap: '4px'
  },
  tabBtn: {
    flex: 1,
    padding: '9px 0',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.2s'
  },
  reviewBox: {
    flex: 1,
    background: '#0d0d18',
    border: '1px solid rgba(167,139,250,0.2)',
    borderRadius: '12px',
    padding: '20px',
    minHeight: '400px',
    overflowY: 'auto',
    maxHeight: '600px'
  },
  emptyState: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    paddingTop: '80px'
  },
  emptyIcon: { fontSize: '40px' },
  emptyTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#475569'
  },
  emptySubtitle: {
    fontSize: '13px',
    color: '#334155',
    textAlign: 'center'
  },
  reviewText: {
    fontSize: '13px',
    color: '#cbd5e1',
    lineHeight: '1.8',
    whiteSpace: 'pre-wrap',
    fontFamily: "'Segoe UI', sans-serif",
    margin: 0
  },
  scoreBadge: {
    padding: '10px 16px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
    marginBottom: '16px',
    display: 'block'
  },
  historyCard: {
    padding: '14px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  historyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  langBadge: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#a78bfa',
    background: 'rgba(167,139,250,0.1)',
    padding: '2px 8px',
    borderRadius: '5px'
  },
  codePreview: {
    fontSize: '11px',
    color: '#475569',
    fontFamily: "'Courier New', monospace",
    margin: '0 0 6px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  historyDate: {
    fontSize: '11px',
    color: '#334155',
    margin: 0
  }
}

export default Dashboard