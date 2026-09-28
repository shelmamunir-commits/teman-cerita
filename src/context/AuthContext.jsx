import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { configIssue, invokeAuthenticatedFunction, isSupabaseConfigured, loginIdToInternalEmail, normalizeLoginId, supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [permissions, setPermissions] = useState([])
  const [accountError, setAccountError] = useState('')
  const [loading, setLoading] = useState(isSupabaseConfigured)

  const loadAccount = useCallback(async (nextSession) => {
    if (!supabase || !nextSession?.user) {
      setProfile(null)
      setPermissions([])
      setAccountError('')
      setLoading(false)
      return
    }

    const { data: account, error } = await supabase
      .from('profiles')
      .select('id, login_id, full_name, class_name, status, must_change_password, role_id, roles(id, name, system_key)')
      .eq('id', nextSession.user.id)
      .single()

    if (error || !account) {
      setProfile(null)
      setPermissions([])
      setAccountError('Akun berhasil masuk, tetapi profil Pesma tidak dapat dimuat. Hubungi Sysadmin.')
      setLoading(false)
      return
    }

    const { data: grants, error: grantsError } = await supabase
      .from('role_permissions')
      .select('permissions(key)')
      .eq('role_id', account.role_id)

    if (grantsError) {
      setProfile(null)
      setPermissions([])
      setAccountError('Profil ditemukan, tetapi hak akses tidak dapat dimuat. Coba masuk kembali.')
      setLoading(false)
      return
    }

    setProfile(account)
    setAccountError('')
    setPermissions((grants || []).map((item) => item.permissions?.key).filter(Boolean))
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!supabase) return

    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (error) throw error
        setSession(data.session)
        loadAccount(data.session)
      })
      .catch(() => {
        setSession(null)
        setProfile(null)
        setPermissions([])
        setAccountError('Sesi tidak dapat dipulihkan. Silakan masuk kembali.')
        setLoading(false)
      })

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setTimeout(() => loadAccount(nextSession), 0)
    })

    return () => data.subscription.unsubscribe()
  }, [loadAccount])

  const signIn = async (loginId, password) => {
    if (!supabase) throw new Error(configIssue || 'Supabase belum dikonfigurasi.')
    const normalized = normalizeLoginId(loginId)
    if (!normalized) throw new Error('ID pengguna wajib diisi.')
    const { error } = await supabase.auth.signInWithPassword({
      email: loginIdToInternalEmail(normalized),
      password,
    })
    if (error) {
      const message = String(error.message || '').toLowerCase()
      if (message.includes('invalid login credentials')) throw new Error('ID pengguna atau sandi tidak sesuai.')
      if (message.includes('email not confirmed')) throw new Error('Akun belum diaktifkan. Hubungi Sysadmin.')
      if (message.includes('banned')) throw new Error('Akun sedang dinonaktifkan. Hubungi Sysadmin.')
      if (message.includes('fetch') || message.includes('network')) throw new Error('Tidak dapat terhubung ke server. Periksa koneksi lalu coba lagi.')
      throw new Error('Login belum berhasil. Periksa konfigurasi Supabase atau coba beberapa saat lagi.')
    }
  }

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut()
    setProfile(null)
    setPermissions([])
    setAccountError('')
  }

  const changeInitialPassword = async (password) => {
    await invokeAuthenticatedFunction('change-password', { password })
    const { data } = await supabase.auth.getSession()
    await loadAccount(data.session)
  }

  const hasPermission = useCallback((permission) => permissions.includes(permission), [permissions])

  const value = useMemo(() => ({
    configured: isSupabaseConfigured,
    session,
    user: session?.user || null,
    profile,
    accountError,
    configIssue,
    permissions,
    loading,
    signIn,
    signOut,
    changeInitialPassword,
    refreshProfile: () => loadAccount(session),
    hasPermission,
  }), [session, profile, accountError, permissions, loading, hasPermission, loadAccount])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
