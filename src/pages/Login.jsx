import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { KeyRound, LogIn } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Logo from '../components/ui/Logo'
import { useAuth } from '../context/AuthContext'
import PasswordField from '../components/auth/PasswordField'

function landingPage(profile) {
  if (profile?.roles?.system_key === 'sysadmin') return '/sysadmin'
  if (profile?.roles?.system_key === 'admin') return '/dashboard'
  if (profile?.roles?.system_key === 'student' && !profile.profile_completed_at) return '/profil?lengkapi=1'
  return '/'
}

export default function Login() {
  const { configured, user, profile, accountError, configIssue, signIn, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [capsLock, setCapsLock] = useState(false)

  useEffect(() => {
    if (user && profile) navigate(profile.must_change_password ? '/ganti-sandi' : (location.state?.from || landingPage(profile)), { replace: true })
  }, [user, profile, navigate, location.state])

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      await signIn(loginId, password)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <motion.div className="mx-auto max-w-md" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="text-center">
        <Logo className="mx-auto h-24 w-24 rounded-2xl bg-white object-contain p-1 shadow-sm" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Masuk ke Teman Cerita</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Gunakan ID yang diberikan oleh pengelola Pesma.</p>
      </div>

      <Card className="mt-6">
        {!configured && (
          <div className="mb-5 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
            {configIssue} Salin <b>.env.example</b> menjadi <b>.env.local</b>, lalu isi URL proyek dasar dan publishable key.
          </div>
        )}
        {accountError && (
          <div className="mb-5 rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs leading-relaxed text-rose-800 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200">
            {accountError} <button onClick={signOut} className="font-bold underline">Keluar dan coba lagi</button>
          </div>
        )}
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            ID pengguna
            <input
              autoComplete="username"
              autoFocus
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="Contoh: SNT-001"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-900"
            />
          </label>
          <PasswordField value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" onCapsLock={setCapsLock} />
          {capsLock && <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">Caps Lock sedang aktif.</p>}
          {error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm font-semibold text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">{error}</p>}
          <Button type="submit" disabled={!configured || busy || !loginId.trim() || !password} className="w-full">
            <LogIn size={17} /> {busy ? 'Memeriksa…' : 'Masuk'}
          </Button>
        </form>
        <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          <KeyRound size={15} className="mt-0.5 shrink-0" /> Lupa sandi? Hubungi Sysadmin Pesma untuk mendapatkan sandi sementara baru.
        </p>
        <div className="mt-4 border-t border-slate-100 pt-4 text-center text-xs text-slate-500 dark:border-slate-700">
          Belum memiliki akun? Hubungi pengelola Pesma. <Link to="/help" className="font-bold text-brand-deep dark:text-brand">Lihat bantuan</Link>
        </div>
      </Card>
    </motion.div>
  )
}
