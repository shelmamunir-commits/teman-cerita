import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useAuth } from './AuthContext.jsx'
import { userStorageKey } from '../lib/storage.js'

const MoodContext = createContext(null)

export function MoodProvider({ children }) {
  const { user } = useAuth()
  // entries: { 'YYYY-MM-DD': 0..4 }
  const [entries, setEntries] = useLocalStorage(
    userStorageKey('bridge_mood', user?.id),
    {},
    (value) => value !== null && typeof value === 'object' && !Array.isArray(value),
  )

  const setMood = (dateKey, mood) => setEntries((e) => ({ ...e, [dateKey]: mood }))

  return <MoodContext.Provider value={{ entries, setMood }}>{children}</MoodContext.Provider>
}

export function useMood() {
  return useContext(MoodContext)
}
