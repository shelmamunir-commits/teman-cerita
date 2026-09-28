import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CircleCheck, IdCard, KeyRound, LogOut, ShieldCheck } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import SectionLabel from '../components/ui/SectionLabel'
import { useAuth } from '../context/AuthContext'
import { PERMISSIONS } from '../lib/permissions'
import { supabase } from '../lib/supabase'

const DETAIL_FIELDS = ['class_name', 'address', 'birth_date', 'campus', 'semester', 'study_program', 'guardian_name', 'guardian_relationship', 'guardian_phone']

export default function Profile() {
  const { profile, signOut, hasPermission, refreshProfile } = useAuth()
  const [searchParams] = useSearchParams()
  const isStudent = profile.roles?.system_key === 'student'
  const [form, setForm] = useState(() => Object.fromEntries(DETAIL_FIELDS.map((key) => [key, profile[key] || ''])))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    setForm(Object.fromEntries(DETAIL_FIELDS.map((key) => [key, profile[key] || ''])))
  }, [profile])

  const items = [
    ['ID pengguna', profile.login_id], ['Nama lengkap', profile.full_name],
    ['Role', profile.roles?.name || '—'],
    ['Status', profile.status === 'active' ? 'Aktif' : 'Nonaktif'],
  ]
  const complete = Boolean(profile.profile_completed_at)
  const requiredFilled = DETAIL_FIELDS.every((key) => String(form[key] || '').trim())

  const save = async (event) => {
    event.preventDefault()
    if (!requiredFilled) return setError('Semua data profil santri wajib dilengkapi.')
    if (new Date(form.birth_date) > new Date()) return setError('Tanggal lahir tidak boleh berada di masa depan.')
    setBusy(true)
    setError('')
    setNotice('')
    const payload = { ...form, semester: Number(form.semester), guardian_phone: String(form.guardian_phone).trim() }
    const { error: saveError } = await supabase.from('profiles').update(payload).eq('id', profile.id)
    if (saveError) setError(saveError.message)
    else {
      await refreshProfile()
      setNotice('Profil santri berhasil disimpan dan kini terhubung ke menu Data Santri.')
    }
    setBusy(false)
  }

  return <motion.div className="mx-auto max-w-3xl" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
    <div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white"><IdCard /></div><div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profil saya</h1><p className="text-sm text-slate-500">Identitas akun Pesma</p></div></div>
    {isStudent && !complete && <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200"><b>Lengkapi profil sebelum melanjutkan.</b> Data ini membantu Pesma mengenali data diri, akademik, dan kontak orang tua/walimu secara tepat.{searchParams.get('lengkapi') === '1' && <span className="mt-1 block">Setelah tersimpan, seluruh fitur akunmu dapat digunakan.</span>}</div>}
    <Card className="mt-6"><SectionLabel>Informasi akun</SectionLabel><dl className="divide-y divide-slate-100 dark:divide-slate-700">{items.map(([label, value]) => <div key={label} className="grid grid-cols-2 gap-4 py-3 text-sm"><dt className="text-slate-500 dark:text-slate-400">{label}</dt><dd className="text-right font-bold text-slate-900 dark:text-white">{value}</dd></div>)}</dl><div className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200"><ShieldCheck size={15} className="mr-1 inline" /> Perubahan nama dan role dilakukan oleh Sysadmin.</div></Card>
    {isStudent && <Card className="mt-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-bold text-slate-900 dark:text-white">Data profil santri</h2><p className="mt-1 text-xs text-slate-500">Semua kolom wajib diisi. Data hanya dapat dilihat oleh kamu dan petugas Pesma yang berwenang.</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${complete ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{complete ? 'Profil lengkap' : 'Belum lengkap'}</span></div><form onSubmit={save} className="mt-5 grid gap-4 sm:grid-cols-2">
      <ProfileInput label="Kelas / kelompok" maxLength={80} value={form.class_name} onChange={(value) => setForm({ ...form, class_name: value })} className="sm:col-span-2" />
      <label className="block text-sm font-semibold sm:col-span-2">Alamat lengkap<textarea required maxLength={500} rows={3} value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal dark:border-slate-700 dark:bg-slate-900" /></label>
      <ProfileInput label="Tanggal lahir" type="date" max={new Date().toISOString().slice(0, 10)} value={form.birth_date} onChange={(value) => setForm({ ...form, birth_date: value })} />
      <ProfileInput label="Kampus" maxLength={120} value={form.campus} onChange={(value) => setForm({ ...form, campus: value })} />
      <ProfileInput label="Semester" type="number" min="1" max="20" value={form.semester} onChange={(value) => setForm({ ...form, semester: value })} />
      <ProfileInput label="Program studi" maxLength={120} value={form.study_program} onChange={(value) => setForm({ ...form, study_program: value })} />
      <ProfileInput label="Nama orang tua / wali" maxLength={120} value={form.guardian_name} onChange={(value) => setForm({ ...form, guardian_name: value })} />
      <label className="block text-sm font-semibold">Hubungan<select required value={form.guardian_relationship} onChange={(event) => setForm({ ...form, guardian_relationship: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal dark:border-slate-700 dark:bg-slate-900"><option value="">Pilih hubungan</option><option value="Ayah">Ayah</option><option value="Ibu">Ibu</option><option value="Wali">Wali</option></select></label>
      <ProfileInput label="Nomor telepon orang tua / wali" type="tel" maxLength={30} value={form.guardian_phone} onChange={(value) => setForm({ ...form, guardian_phone: value })} className="sm:col-span-2" />
      {error && <p role="alert" className="text-sm text-rose-600 sm:col-span-2">{error}</p>}{notice && <p className="flex items-center gap-2 text-sm text-emerald-600 sm:col-span-2"><CircleCheck size={16} /> {notice}</p>}<Button type="submit" disabled={busy || !requiredFilled} className="sm:col-span-2">{busy ? 'Menyimpan…' : 'Simpan profil santri'}</Button>
    </form></Card>}
    <Card className="mt-5"><div className="flex flex-wrap gap-3"><Button as={Link} to="/ganti-sandi" variant="secondary"><KeyRound size={16} /> Ganti sandi</Button>{hasPermission(PERMISSIONS.SCREENING_READ_SELF) && <Button as={Link} to="/riwayat-skrining" variant="secondary">Riwayat skrining</Button>}{hasPermission(PERMISSIONS.DASHBOARD_READ_ALL) && <Button as={Link} to="/dashboard" variant="secondary">Dashboard Pesma</Button>}{hasPermission(PERMISSIONS.STUDENTS_READ) && <Button as={Link} to="/data-santri" variant="secondary">Data santri</Button>}{[PERMISSIONS.USERS_READ, PERMISSIONS.ROLES_MANAGE, PERMISSIONS.USERS_IMPORT, PERMISSIONS.AUDIT_READ].some(hasPermission) && <Button as={Link} to="/sysadmin" variant="secondary">Pengelolaan sistem</Button>}<Button variant="secondary" onClick={signOut}><LogOut size={16} /> Keluar</Button></div></Card>
  </motion.div>
}

function ProfileInput({ label, value, onChange, className = '', ...props }) {
  return <label className={`block text-sm font-semibold ${className}`}>{label}<input required value={value} onChange={(event) => onChange(event.target.value)} {...props} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal dark:border-slate-700 dark:bg-slate-900" /></label>
}
