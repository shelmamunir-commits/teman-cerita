import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, GraduationCap, Search, UserRound, Users } from 'lucide-react'
import Card from '../components/ui/Card'
import { supabase } from '../lib/supabase'
import { cn } from '../lib/cn'

function formatDate(value) {
  if (!value) return '—'
  return new Date(`${value}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function Students() {
  const [rows, setRows] = useState([])
  const [query, setQuery] = useState('')
  const [className, setClassName] = useState('all')
  const [campus, setCampus] = useState('all')
  const [completion, setCompletion] = useState('all')
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.from('profiles')
      .select('id, login_id, full_name, address, birth_date, class_name, campus, semester, study_program, guardian_name, guardian_relationship, guardian_phone, profile_completed_at, status, roles!inner(system_key)')
      .eq('roles.system_key', 'student')
      .order('full_name')
      .then(({ data, error: loadError }) => {
        if (loadError) setError(loadError.message)
        setRows(data || [])
        setLoading(false)
      })
  }, [])

  const classes = useMemo(() => [...new Set(rows.map((row) => row.class_name).filter(Boolean))].sort(), [rows])
  const campuses = useMemo(() => [...new Set(rows.map((row) => row.campus).filter(Boolean))].sort(), [rows])
  const filtered = useMemo(() => rows
    .filter((row) => className === 'all' || row.class_name === className)
    .filter((row) => campus === 'all' || row.campus === campus)
    .filter((row) => completion === 'all' || (completion === 'complete') === Boolean(row.profile_completed_at))
    .filter((row) => `${row.login_id} ${row.full_name} ${row.class_name || ''} ${row.campus || ''} ${row.study_program || ''}`.toLowerCase().includes(query.toLowerCase())), [rows, query, className, campus, completion])

  if (selected) return <StudentDetail student={selected} onBack={() => setSelected(null)} />

  const completeCount = rows.filter((row) => row.profile_completed_at).length
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
    <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Data Santri</h1><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Direktori data diri dan akademik santri Pesma Nur Alannur. Akses dibatasi untuk petugas yang berwenang.</p></div>
    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">{[['Total santri', rows.length, Users], ['Profil lengkap', completeCount, GraduationCap], ['Belum lengkap', rows.length - completeCount, UserRound]].map(([label, value, Icon]) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/60"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-brand-deep dark:bg-emerald-500/10 dark:text-brand"><Icon size={20} /></div><div><div className="text-2xl font-extrabold text-slate-900 dark:text-white">{value}</div><div className="text-xs font-semibold text-slate-500">{label}</div></div></div></div>)}</div>
    <Card className="mt-6 overflow-hidden p-0"><div className="border-b border-slate-200 p-4 dark:border-slate-700"><div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama, ID, kelas, kampus, atau program studi…" className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-900" /></div><div className="mt-3 grid gap-2 sm:grid-cols-3"><select aria-label="Filter kelas" value={className} onChange={(event) => setClassName(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900"><option value="all">Semua kelas</option>{classes.map((item) => <option key={item} value={item}>{item}</option>)}</select><select aria-label="Filter kampus" value={campus} onChange={(event) => setCampus(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900"><option value="all">Semua kampus</option>{campuses.map((item) => <option key={item} value={item}>{item}</option>)}</select><select aria-label="Filter kelengkapan profil" value={completion} onChange={(event) => setCompletion(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900"><option value="all">Semua kelengkapan</option><option value="complete">Profil lengkap</option><option value="incomplete">Belum lengkap</option></select></div><p className="mt-3 text-xs text-slate-500">Menampilkan <b>{filtered.length}</b> dari {rows.length} santri.</p></div>
      {error && <p className="p-4 text-sm text-rose-600">{error}</p>}{loading ? <p className="p-8 text-center text-sm text-slate-400">Memuat data santri…</p> : <div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-900"><tr><th className="px-4 py-3">Santri</th><th className="px-4 py-3">Kelas</th><th className="px-4 py-3">Kampus</th><th className="px-4 py-3">Program studi</th><th className="px-4 py-3">Profil</th></tr></thead><tbody>{filtered.map((row) => <tr key={row.id} onClick={() => setSelected(row)} className="cursor-pointer border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"><td className="px-4 py-3"><b className="block text-slate-900 dark:text-white">{row.full_name}</b><span className="text-xs text-slate-500">{row.login_id}</span></td><td className="px-4 py-3">{row.class_name || '—'}</td><td className="px-4 py-3">{row.campus || '—'}</td><td className="px-4 py-3">{row.study_program || '—'}{row.semester ? <span className="block text-xs text-slate-500">Semester {row.semester}</span> : null}</td><td className="px-4 py-3"><span className={cn('rounded-full px-2.5 py-1 text-xs font-bold', row.profile_completed_at ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')}>{row.profile_completed_at ? 'Lengkap' : 'Belum lengkap'}</span></td></tr>)}</tbody></table>{!filtered.length && <p className="p-8 text-center text-sm text-slate-400">Belum ada data yang cocok.</p>}</div>}</Card>
  </motion.div>
}

function StudentDetail({ student, onBack }) {
  const fields = [['ID santri', student.login_id], ['Nama lengkap', student.full_name], ['Alamat', student.address], ['Tanggal lahir', formatDate(student.birth_date)], ['Kelas', student.class_name], ['Kampus', student.campus], ['Semester', student.semester ? `Semester ${student.semester}` : null], ['Program studi', student.study_program]]
  return <motion.div className="mx-auto max-w-3xl" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><button onClick={onBack} className="inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-brand"><ChevronLeft size={16} /> Kembali ke data santri</button><div className="mt-4"><h1 className="text-2xl font-bold text-slate-900 dark:text-white">{student.full_name}</h1><p className="mt-1 text-sm text-slate-500">{student.login_id} · {student.class_name || 'Tanpa kelas'}</p></div><Card className="mt-5"><h2 className="font-bold text-slate-900 dark:text-white">Data diri dan akademik</h2><dl className="mt-3 divide-y divide-slate-100 dark:divide-slate-700">{fields.map(([label, value]) => <div key={label} className="grid gap-1 py-3 text-sm sm:grid-cols-[180px_1fr]"><dt className="text-slate-500">{label}</dt><dd className="font-semibold text-slate-900 dark:text-white">{value || '—'}</dd></div>)}</dl></Card><Card className="mt-4"><h2 className="font-bold text-slate-900 dark:text-white">Data orang tua / wali</h2><dl className="mt-3 divide-y divide-slate-100 dark:divide-slate-700">{[['Nama', student.guardian_name], ['Hubungan', student.guardian_relationship], ['Nomor telepon', student.guardian_phone]].map(([label, value]) => <div key={label} className="grid gap-1 py-3 text-sm sm:grid-cols-[180px_1fr]"><dt className="text-slate-500">{label}</dt><dd className="font-semibold text-slate-900 dark:text-white">{value || '—'}</dd></div>)}</dl></Card></motion.div>
}
