import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { KeyRound } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import PasswordField from '../components/auth/PasswordField'
import { Check, Circle } from 'lucide-react'

export default function ChangePassword() {
  const { changeInitialPassword, profile } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const requirements = [
    ['Minimal 10 karakter', password.length >= 10],
    ['Mengandung huruf besar dan kecil', /[A-Z]/.test(password) && /[a-z]/.test(password)],
    ['Mengandung angka', /\d/.test(password)],
  ]
  const valid = requirements.every(([, met]) => met) && password === confirm

  const submit = async (event) => {
    event.preventDefault()
    if (!requirements.every(([, met]) => met)) return setError('Sandi belum memenuhi semua ketentuan.')
    if (password !== confirm) return setError('Konfirmasi sandi belum sama.')
    setBusy(true)
    setError('')
    try {
      await changeInitialPassword(password)
      navigate(profile?.roles?.system_key === 'sysadmin' ? '/sysadmin' : profile?.roles?.system_key === 'admin' ? '/dashboard' : '/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <motion.div className="mx-auto max-w-md" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <KeyRound className="text-brand" size={28} />
        <h1 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">{profile?.must_change_password ? 'Buat sandi baru' : 'Ganti sandi'}</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{profile?.must_change_password ? 'Sandi sementara harus diganti sebelum melanjutkan.' : 'Gunakan sandi baru yang kuat dan tidak dipakai pada layanan lain.'}</p>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <PasswordField label="Sandi baru" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan sandi baru" autoFocus />
          <ul className="space-y-1.5 text-xs">{requirements.map(([label, met]) => <li key={label} className={met ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}>{met ? <Check size={14} className="mr-1.5 inline" /> : <Circle size={14} className="mr-1.5 inline" />}{label}</li>)}</ul>
          <PasswordField label="Ulangi sandi baru" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Ketik ulang sandi" />
          {confirm && password !== confirm && <p className="text-xs font-semibold text-amber-600">Konfirmasi sandi belum sama.</p>}
          {error && <p role="alert" className="text-sm font-semibold text-rose-600">{error}</p>}
          <Button type="submit" disabled={busy || !valid} className="w-full">{busy ? 'Menyimpan…' : 'Simpan sandi baru'}</Button>
        </form>
      </Card>
    </motion.div>
  )
}
