import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { analyze } from '../engine/analyzer'
import { buildPathway } from '../engine/pathwayEngine'
import { useAuth } from './AuthContext'
import { supabase } from '../lib/supabase'
import { userStorageKey } from '../lib/storage'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const { user } = useAuth()
  const scopedKey = (key) => userStorageKey(key, user?.id)
  const [name, setName] = useLocalStorage(scopedKey('bridge_name'), '')
  const [goal, setGoal] = useLocalStorage(scopedKey('bridge_goal'), null)
  const [result, setResult] = useLocalStorage(scopedKey('bridge_result'), null)
  const [problem, setProblem] = useLocalStorage(scopedKey('bridge_problem'), null)
  const [need, setNeed] = useLocalStorage(scopedKey('bridge_need'), null)
  const [pathway, setPathway] = useLocalStorage(scopedKey('bridge_pathway'), [])
  const [done, setDone] = useLocalStorage(scopedKey('bridge_done'), {})
  const [feedback, setFeedback] = useLocalStorage(scopedKey('bridge_feedback'), {})

  const applyResult = async (analysis, path = 'Screening mandiri') => {
    if (supabase && user) {
      const { error } = await supabase.from('screening_submissions').insert({
        user_id: user.id,
        instrument: analysis.quizTitle || path,
        source_code: analysis.code || null,
        category: analysis.category,
        total_score: analysis.phq4?.total ?? analysis.totalScore ?? null,
        domain_scores: analysis.domainScores || {},
        summary: analysis.explain || null,
      })
      if (error) throw new Error('Hasil belum dapat disimpan ke riwayat. Periksa koneksi lalu coba lagi.')
    }
    setResult(analysis)
    setProblem(null)
    setNeed(null)
    setPathway([])
  }

  const submitResult = async (code) => {
    const analysis = analyze(code)
    if (!analysis) return false
    await applyResult(analysis, 'CKG')
    return true
  }

  const submitQuizResult = (analysis) => applyResult(analysis, 'Screening mandiri')

  const buildPath = () => {
    if (!result || !problem || !need) return
    setPathway(buildPathway(result.category, problem, need))
  }

  const toggleDone = (id) => setDone((d) => ({ ...d, [id]: !d[id] }))

  const rateModule = (id, rating) => setFeedback((f) => ({ ...f, [id]: rating }))

  const value = {
    name, setName,
    goal, setGoal,
    result, submitResult, submitQuizResult,
    problem, setProblem,
    need, setNeed,
    pathway, buildPath,
    done, toggleDone,
    feedback, rateModule,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  return useContext(AppContext)
}
