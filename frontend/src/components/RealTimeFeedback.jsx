import { useEffect, useState } from 'react'
import {
  detectLanguage,
  analyzeComplexity,
  detectBugPatterns,
  getCodeMetrics,
  getMLScore
} from '../services/mlAnalyzer'

function RealTimeFeedback({ code, onLanguageDetected }) {
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    // Debounce - wait 800ms after user stops typing
    const timer = setTimeout(() => {
      if (!code || code.trim().length < 20) {
        setFeedback(null)
        return
      }

      // Run all ML analysis
      const language = detectLanguage(code)
      const complexity = analyzeComplexity(code)
      const bugs = detectBugPatterns(code)
      const metrics = getCodeMetrics(code)
      const mlScore = getMLScore(code)

      // Auto set language if detected
      if (language) onLanguageDetected(language)

      setFeedback({ language, complexity, bugs, metrics, mlScore })

    }, 800) // 800ms debounce

    return () => clearTimeout(timer)
  }, [code])

  if (!feedback) return null

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <span style={styles.headerTitle}>
          ⚡ Real-Time ML Analysis
        </span>
        <span style={styles.live}>● LIVE</span>
      </div>

      {/* ML Score */}
      {feedback.mlScore !== null && (
        <div style={styles.scoreRow}>
          <span style={styles.metricLabel}>ML Score</span>
          <div style={styles.scoreBar}>
            <div style={{
              ...styles.scoreBarFill,
              width: `${feedback.mlScore}%`,
              background: feedback.mlScore >= 80
                ? '#22c55e'
                : feedback.mlScore >= 60
                ? '#f59e0b'
                : '#ef4444'
            }}/>
          </div>
          <span style={{
            fontSize: '13px',
            fontWeight: '700',
            color: feedback.mlScore >= 80
              ? '#22c55e'
              : feedback.mlScore >= 60
              ? '#f59e0b'
              : '#ef4444'
          }}>
            {feedback.mlScore}/100
          </span>
        </div>
      )}

      {/* Metrics Row */}
      <div style={styles.metricsGrid}>

        {/* Language */}
        {feedback.language && (
          <div style={styles.metricCard}>
            <span style={styles.metricValue}>
              {feedback.language}
            </span>
            <span style={styles.metricLabel}>
              🔍 Auto Detected
            </span>
          </div>
        )}

        {/* Complexity */}
        {feedback.complexity && (
          <div style={styles.metricCard}>
            <span style={{
              ...styles.metricValue,
              color: feedback.complexity.color
            }}>
              {feedback.complexity.label}
            </span>
            <span style={styles.metricLabel}>
              🧮 Complexity ({feedback.complexity.score})
            </span>
          </div>
        )}

        {/* Lines */}
        {feedback.metrics && (
          <div style={styles.metricCard}>
            <span style={styles.metricValue}>
              {feedback.metrics.totalLines}
            </span>
            <span style={styles.metricLabel}>
              📄 Total Lines
            </span>
          </div>
        )}

        
      </div>

      {/* Bug Patterns */}
      {feedback.bugs && feedback.bugs.length > 0 && (
        <div style={styles.bugsSection}>
          <p style={styles.bugsTitle}>
            🐛 ML Detected Issues ({feedback.bugs.length})
          </p>
          {feedback.bugs.map((bug, i) => (
            <div key={i} style={{
              ...styles.bugItem,
              borderLeft: `3px solid ${
                bug.severity === 'critical' ? '#7f1d1d'
                : bug.severity === 'high' ? '#ef4444'
                : bug.severity === 'medium' ? '#f59e0b'
                : '#64748b'
              }`
            }}>
              <span style={styles.bugMessage}>{bug.message}</span>
              <span style={{
                ...styles.severityBadge,
                background: bug.severity === 'critical'
                  ? 'rgba(127,29,29,0.3)'
                  : bug.severity === 'high'
                  ? 'rgba(239,68,68,0.15)'
                  : bug.severity === 'medium'
                  ? 'rgba(245,158,11,0.15)'
                  : 'rgba(100,116,139,0.15)',
                color: bug.severity === 'critical' ? '#fca5a5'
                  : bug.severity === 'high' ? '#f87171'
                  : bug.severity === 'medium' ? '#fbbf24'
                  : '#94a3b8'
              }}>
                {bug.severity}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* No bugs */}
      {feedback.bugs && feedback.bugs.length === 0 && (
        <div style={styles.noBugs}>
          ✅ No common bug patterns detected
        </div>
      )}

    </div>
  )
}

// ─── Styles ───────────────────────────────────────
const styles = {
  container: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(167,139,250,0.2)',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#a78bfa'
  },
  live: {
    fontSize: '11px',
    color: '#22c55e',
    fontWeight: '700',
    animation: 'pulse 1.5s ease infinite'
  },
  scoreRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  metricLabel: {
    fontSize: '11px',
    color: '#64748b',
    whiteSpace: 'nowrap'
  },
  scoreBar: {
    flex: 1,
    height: '6px',
    background: 'rgba(255,255,255,0.06)',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.5s ease'
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px'
  },
  metricCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '8px',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  metricValue: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#e2e8f0'
  },
  bugsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  bugsTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#94a3b8',
    margin: 0
  },
  bugItem: {
    padding: '8px 10px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '6px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px'
  },
  bugMessage: {
    fontSize: '12px',
    color: '#cbd5e1',
    flex: 1
  },
  severityBadge: {
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 6px',
    borderRadius: '4px',
    textTransform: 'uppercase',
    flexShrink: 0
  },
  noBugs: {
    fontSize: '12px',
    color: '#22c55e',
    padding: '8px',
    background: 'rgba(34,197,94,0.05)',
    borderRadius: '6px',
    textAlign: 'center'
  }
}

export default RealTimeFeedback