import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { analyze } from '../engine/analyzer'
import { buildPathway } from '../engine/pathwayEngine'
import { seedCases } from '../data/dashboard'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [name, setName] = useLocalStorage('bridge_name', '')
  const [goal, setGoal] = useLocalStorage('bridge_goal', null)
  const [result, setResult] = useLocalStorage('bridge_result', null)
  const [problem, setProblem] = useLocalStorage('bridge_problem', null)
  const [need, setNeed] = useLocalStorage('bridge_need', null)
  const [pathway, setPathway] = useLocalStorage('bridge_pathway', [])
  const [done, setDone] = useLocalStorage('bridge_done', {})
  const [feedback, setFeedback] = useLocalStorage('bridge_feedback', {})
  const [dashCases, setDashCases] = useLocalStorage('bridge_cases', seedCases())

  const applyResult = (analysis, path = 'Screening mandiri') => {
    setResult(analysis)
    setProblem(null)
    setNeed(null)
    setPathway([])
    setDashCases((cases) => [
      {
        id: 'self-' + Date.now(),
        name: (name || 'Siswa Baru') + ' (' + path + ')',
        path,
        urgency: analysis.category,
        status: 'Menunggu ditinjau',
        isNew: true,
        domainScores: { ...analysis.domainScores },
        why: analysis.topDomains.length
          ? analysis.topDomains.map((k) => `Sinyal ${k} relatif menonjol dari jawaban screening`)
          : ['Hasil screening mandiri'],
      },
      ...cases,
    ])
  }

  const submitResult = (code) => {
    const analysis = analyze(code)
    if (!analysis) return false
    applyResult(analysis, 'CKG')
    return true
  }

  const submitQuizResult = (analysis) => {
    applyResult(analysis, 'Screening mandiri')
  }

  const buildPath = () => {
    if (!result || !problem || !need) return
    setPathway(buildPathway(result.category, problem, need))
  }

  const toggleDone = (id) => setDone((d) => ({ ...d, [id]: !d[id] }))

  const rateModule = (id, rating) => setFeedback((f) => ({ ...f, [id]: rating }))

  const updateCase = (id, patch) =>
    setDashCases((cases) => cases.map((c) => (c.id === id ? { ...c, ...patch } : c)))

  const value = {
    name, setName,
    goal, setGoal,
    result, submitResult, submitQuizResult,
    problem, setProblem,
    need, setNeed,
    pathway, buildPath,
    done, toggleDone,
    feedback, rateModule,
    dashCases, updateCase,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  return useContext(AppContext)
}
