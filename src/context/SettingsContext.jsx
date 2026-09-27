import { createContext, useContext, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const SettingsContext = createContext(null)

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
    Object.keys(localStorage).filter((key) => key.startsWith('bridge_')).forEach((key) => {
      try { localStorage.removeItem(key) } catch { /* ignore */ }
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
