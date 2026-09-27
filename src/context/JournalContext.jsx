import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useAuth } from './AuthContext.jsx'
import { userStorageKey } from '../lib/storage.js'

const JournalContext = createContext(null)

export function JournalProvider({ children }) {
  const { user } = useAuth()
  const [entries, setEntries] = useLocalStorage(
    userStorageKey('bridge_journal', user?.id),
    [],
    Array.isArray,
  )

  const addEntry = (entry) => setEntries((e) => [{ id: Date.now(), ...entry }, ...e])
  const removeEntry = (id) => setEntries((e) => e.filter((x) => x.id !== id))

  return <JournalContext.Provider value={{ entries, addEntry, removeEntry }}>{children}</JournalContext.Provider>
}

export function useJournal() {
  return useContext(JournalContext)
}
