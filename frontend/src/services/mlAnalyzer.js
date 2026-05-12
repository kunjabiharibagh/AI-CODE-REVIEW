// ─── ML BASED REAL TIME CODE ANALYZER ────────────
// This runs entirely in browser - no API needed

// ─── Language Detection ────────────────────────────
// Uses pattern matching ML to detect language
export const detectLanguage = (code) => {
  if (!code || code.trim().length < 10) return null

  const patterns = {
    JavaScript: [
      /const\s+\w+\s*=/,
      /let\s+\w+\s*=/,
      /function\s+\w+\s*\(/,
      /=>\s*{/,
      /console\.log/,
      /document\./,
      /require\(/
    ],
    Python: [
      /def\s+\w+\s*\(/,
      /import\s+\w+/,
      /print\s*\(/,
      /if\s+__name__/,
      /:\s*$/m,
      /elif\s+/,
      /lambda\s+/
    ],
    Java: [
      /public\s+class/,
      /public\s+static\s+void\s+main/,
      /System\.out\.println/,
      /private\s+\w+\s+\w+/,
      /new\s+\w+\(/,
      /@Override/
    ],
    TypeScript: [
      /interface\s+\w+/,
      /type\s+\w+\s*=/,
      /:\s*string/,
      /:\s*number/,
      /:\s*boolean/,
      /<\w+>/
    ],
    Python: [
      /def\s+\w+/,
      /print\s*\(/,
      /import\s+\w+/
    ],
    'C++': [
      /#include\s*</,
      /std::/,
      /cout\s*<</,
      /cin\s*>>/,
      /int\s+main\s*\(/
    ],
    PHP: [
      /<\?php/,
      /\$\w+\s*=/,
      /echo\s+/,
      /->[\w]+/
    ],
    Ruby: [
      /def\s+\w+/,
      /puts\s+/,
      /end$/m,
      /\.each\s+do/,
      /require\s+'/
    ]
  }

  // Count pattern matches for each language
  const scores = {}

  for (const [lang, langPatterns] of Object.entries(patterns)) {
    scores[lang] = langPatterns.filter(pattern =>
      pattern.test(code)
    ).length
  }

  // Find language with highest score
  const detected = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])[0]

  // Only return if confidence is high enough
  return detected[1] >= 2 ? detected[0] : null
}

// ─── Complexity Analysis ────────────────────────────
// Cyclomatic complexity - real ML metric
export const analyzeComplexity = (code) => {
  if (!code || !code.trim()) return null

  // Count decision points
  // Each adds 1 to complexity
  const decisionPoints = [
    /\bif\b/g,           // if statements
    /\belse\s+if\b/g,    // else if
    /\bwhile\b/g,        // while loops
    /\bfor\b/g,          // for loops
    /\bcase\b/g,         // switch cases
    /\bcatch\b/g,        // try catch
    /\b&&\b/g,           // AND operator
    /\b\|\|\b/g,         // OR operator
    /\?\s*\w/g,          // ternary operator
  ]

  let complexity = 1 // Base complexity

  decisionPoints.forEach(pattern => {
    const matches = code.match(pattern)
    if (matches) complexity += matches.length
  })

  // Return complexity with label
  if (complexity <= 5) {
    return { score: complexity, label: 'Simple', color: '#22c55e' }
  } else if (complexity <= 10) {
    return { score: complexity, label: 'Moderate', color: '#f59e0b' }
  } else if (complexity <= 20) {
    return { score: complexity, label: 'Complex', color: '#ef4444' }
  } else {
    return { score: complexity, label: 'Very Complex', color: '#7f1d1d' }
  }
}

// ─── Bug Pattern Detection ─────────────────────────
// ML pattern matching for common bugs
export const detectBugPatterns = (code) => {
  if (!code || !code.trim()) return []

  const bugs = []

  const patterns = [
    {
      pattern: /var\s+(\w+)[\s\S]*?var\s+\1/,
      message: '⚠️ Duplicate variable declaration detected',
      severity: 'high'
    },
    {
      pattern: /==(?!=)/g,
      message: '⚠️ Use === instead of == for strict equality',
      severity: 'medium'
    },
    {
      pattern: /console\.log/g,
      message: '⚠️ Remove console.log before production',
      severity: 'low'
    },
    {
      pattern: /catch\s*\(\w+\)\s*\{\s*\}/g,
      message: '⚠️ Empty catch block - handle your errors',
      severity: 'high'
    },
    {
      pattern: /password\s*=\s*["']\w+["']/gi,
      message: '🔒 Hardcoded password detected - security risk!',
      severity: 'critical'
    },
    {
      pattern: /TODO|FIXME|HACK/gi,
      message: '💡 Unfinished code markers found',
      severity: 'low'
    },
    {
      pattern: /debugger/g,
      message: '⚠️ Remove debugger statement',
      severity: 'medium'
    },
    {
      pattern: /eval\s*\(/g,
      message: '🔒 Avoid eval() - security risk!',
      severity: 'critical'
    }
  ]

  patterns.forEach(({ pattern, message, severity }) => {
    if (pattern.test(code)) {
      bugs.push({ message, severity })
    }
  })

  return bugs
}

// ─── Code Metrics ──────────────────────────────────
export const getCodeMetrics = (code) => {
  if (!code || !code.trim()) return null

  const lines = code.split('\n')
  const totalLines = lines.length
  const emptyLines = lines.filter(l => !l.trim()).length
  const commentLines = lines.filter(l =>
    l.trim().startsWith('//') ||
    l.trim().startsWith('#') ||
    l.trim().startsWith('*')
  ).length
  const codeLines = totalLines - emptyLines - commentLines

  // Comment ratio - good code has 10-30% comments
  const commentRatio = Math.round((commentLines / totalLines) * 100)

  // Average line length
  const avgLength = Math.round(
    lines.reduce((sum, l) => sum + l.length, 0) / totalLines
  )

  return {
    totalLines,
    codeLines,
    commentLines,
    emptyLines,
    commentRatio,
    avgLength,
    // Long lines warning
    longLines: lines.filter(l => l.length > 80).length
  }
}

// ─── Overall ML Score ──────────────────────────────
// Combines all metrics into one score
export const getMLScore = (code) => {
  if (!code || !code.trim()) return null

  const complexity = analyzeComplexity(code)
  const bugs = detectBugPatterns(code)
  const metrics = getCodeMetrics(code)

  if (!complexity || !metrics) return null

  let score = 100

  // Deduct for complexity
  if (complexity.score > 10) score -= 20
  else if (complexity.score > 5) score -= 10

  // Deduct for bugs
  bugs.forEach(bug => {
    if (bug.severity === 'critical') score -= 20
    else if (bug.severity === 'high') score -= 10
    else if (bug.severity === 'medium') score -= 5
    else score -= 2
  })

  // Deduct for no comments
  if (metrics.commentRatio < 5) score -= 10

  // Deduct for very long lines
  if (metrics.longLines > 5) score -= 5

  return Math.max(0, Math.min(100, score))
}