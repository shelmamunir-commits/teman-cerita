import { createContext, useContext, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { load } from '../lib/storage'

const SettingsContext = createContext(null)

const DATA_KEYS = [
  'bridge_name', 'bridge_goal', 'bridge_mood', 'bridge_journal',
  'bridge_done', 'bridge_feedback', 'bridge_cases', 'bridge_posts',
  'bridge_consent', 'bridge_theme', 'bridge_result', 'bridge_problem',
  'bridge_need', 'bridge_pathway', 'bridge_chat', 'bridge_onboarded',
  'bridge_reduce_motion', 'bridge_font_scale', 'bridge_reminder',
]

export function SettingsProvider({ children }) {
  const [reduceMotion, setReduceMotion] = useLocalStorage('bridge_reduce_motion', false)
  const [fontScale, setFontScale] = useLocalStorage('bridge_font_scale', 1)
  const [consent, setConsent] = useLocalStorage('bridge_consent', false)
  const [onboarded, setOnboarded] = useLocalStorage('bridge_onboarded', false)
  const [reminder, setReminder] = useLocalStorage('bridge_reminder', true)

  useEffect(() => {
    const root = document.documentElement
    root.style.fontSize = `${Math.min(Math.max(fontScale, 0.85), 1.3) * 100}%`
    return () => { root.style.fontSize = '' }
  }, [fontScale])

  const clearAllData = () => {
    DATA_KEYS.forEach((k) => {
      try { localStorage.removeItem(k) } catch { /* ignore */ }
    })
    window.location.reload()
  }

  const value = {
    reduceMotion, setReduceMotion,
    fontScale, setFontScale,
    consent, setConsent,
    onboarded, setOnboarded,
    reminder, setReminder,
    clearAllData,
  }

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  return useContext(SettingsContext)
}
