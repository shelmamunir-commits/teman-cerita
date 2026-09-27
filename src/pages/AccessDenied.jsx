import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, LockKeyhole } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

export default function AccessDenied() {
  const { profile, hasPermission } = useAuth()
  const location = useLocation()
  const destination = hasPermission('dashboard.read_all') ? '/dashboard' : hasPermission('screening.read_self') ? '/riwayat-skrining' : '/'

  return (
    <motion.div className="mx-auto max-w-lg py-8" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"><LockKeyhole size={27} /></div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Akses tidak tersedia</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{location.state?.reason || `Role ${profile?.roles?.name || 'akun Anda'} tidak memiliki izin untuk membuka halaman ini.`}</p>
        {location.state?.from && <p className="mt-2 text-xs text-slate-400">Halaman: {location.state.from}</p>}
        <Button as={Link} to={destination} className="mt-6"><ArrowLeft size={16} /> Kembali ke halaman utama saya</Button>
      </Card>
    </motion.div>
  )
}
