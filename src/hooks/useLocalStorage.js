import { useState, useEffect } from 'react'
import { load, save } from '../lib/storage'

export function useLocalStorage(key, initialValue, isValid) {
  const [value, setValue] = useState(() => load(key, initialValue, isValid))

  useEffect(() => {
    save(key, value)
  }, [key, value])

  return [value, setValue]
}
