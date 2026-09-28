import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IdCard, KeyRound, LogOut, ShieldCheck } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import SectionLabel from '../components/ui/SectionLabel'
import { useAuth } from '../context/AuthContext'
import { PERMISSIONS } from '../lib/permissions'

export default function Profile() {
  const { profile, signOut, hasPermission } = useAuth()
  const items = [
    ['ID pengguna', profile.login_id],
    ['Nama lengkap', profile.full_name],
    ['Kelas / kelompok', profile.class_name || '—'],
    ['Role', profile.roles?.name || '—'],
    ['Status', profile.status === 'active' ? 'Aktif' : 'Nonaktif'],
  ]

  return (
    <motion.div className="mx-auto max-w-2xl" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white"><IdCard /></div>
        <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profil saya</h1><p className="text-sm text-slate-500">Identitas akun Pesma</p></div>
      </div>
      <Card className="mt-6">
        <SectionLabel>Informasi akun</SectionLabel>
        <dl className="divide-y divide-slate-100 dark:divide-slate-700">
          {items.map(([label, value]) => (
            <div key={label} className="grid grid-cols-2 gap-4 py-3 text-sm">
              <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
              <dd className="text-right font-bold text-slate-900 dark:text-white">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200">
          <ShieldCheck size={15} className="mr-1 inline" /> Perubahan nama, kelas, dan role dilakukan oleh Sysadmin.
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button as={Link} to="/ganti-sandi" variant="secondary"><KeyRound size={16} /> Ganti sandi</Button>
          {hasPermission(PERMISSIONS.SCREENING_READ_SELF) && <Button as={Link} to="/riwayat-skrining" variant="secondary">Riwayat skrining</Button>}
          {hasPermission(PERMISSIONS.DASHBOARD_READ_ALL) && <Button as={Link} to="/dashboard" variant="secondary">Dashboard Pesma</Button>}
          {[PERMISSIONS.USERS_READ, PERMISSIONS.ROLES_MANAGE, PERMISSIONS.USERS_IMPORT, PERMISSIONS.AUDIT_READ].some(hasPermission) && <Button as={Link} to="/sysadmin" variant="secondary">Pengelolaan sistem</Button>}
          <Button variant="secondary" onClick={signOut}><LogOut size={16} /> Keluar</Button>
        </div>
      </Card>
    </motion.div>
  )
}
