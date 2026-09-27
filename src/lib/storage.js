export function load(key, fallback, isValid) {
  try {
    const raw = localStorage.getItem(key)
    if (raw == null) return fallback
    const value = JSON.parse(raw)
    return !isValid || isValid(value) ? value : fallback
  } catch {
    return fallback
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore quota / private mode errors */
  }
}

export function userStorageKey(baseKey, userId) {
  return `${baseKey}:${userId || 'guest'}`
}
