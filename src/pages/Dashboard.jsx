import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, ChevronLeft, FilterX, Search, ShieldAlert, ShieldCheck, Users } from 'lucide-react'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import DomainBars from '../components/charts/DomainBars'
import { CATEGORY_META } from '../lib/constants'
import { supabase } from '../lib/supabase'

const PRIORITY = { high: 0, mid: 1, low: 2 }
const STATS = [
  { key: 'total', label: 'Total skrining', icon: Users, color: '#3899fe', bg: '#ebf3ff' },
  { key: 'high', label: 'Prioritas tinggi', icon: AlertTriangle, color: '#f1487c', bg: '#feedf2' },
  { key: 'mid', label: 'Prioritas sedang', icon: ShieldAlert, color: '#f5a623', bg: '#fef6e7' },
  { key: 'low', label: 'Prioritas rendah', icon: ShieldCheck, color: '#40ae87', bg: '#e1fbfa' },
]

export default function Dashboard() {
  const [rows, setRows] = useState([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [className, setClassName] = useState('all')
  const [instrument, setInstrument] = useState('all')
  const [period, setPeriod] = useState('30')
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.from('screening_submissions')
      .select('id, instrument, category, total_score, domain_scores, summary, submitted_at, profiles(full_name, login_id, class_name)')
      .order('submitted_at', { ascending: false })
      .then(({ data, error: loadError }) => {
        if (loadError) setError(loadError.message)
        setRows(data || [])
        setLoading(false)
      })
  }, [])

  const classes = useMemo(() => [...new Set(rows.map((row) => row.profiles?.class_name).filter(Boolean))].sort(), [rows])
  const instruments = useMemo(() => [...new Set(rows.map((row) => row.instrument).filter(Boolean))].sort(), [rows])
  const scoped = useMemo(() => rows
    .filter((row) => period === 'all' || new Date(row.submitted_at) >= new Date(Date.now() - Number(period) * 86400000))
    .filter((row) => className === 'all' || row.profiles?.class_name === className)
    .filter((row) => instrument === 'all' || row.instrument === instrument), [rows, period, className, instrument])
  const filtered = useMemo(() => scoped
    .filter((row) => category === 'all' || row.category === category)
    .filter((row) => `${row.profiles?.full_name || ''} ${row.profiles?.login_id || ''} ${row.profiles?.class_name || ''}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => PRIORITY[a.category] - PRIORITY[b.category] || new Date(b.submitted_at) - new Date(a.submitted_at)), [scoped, query, category])

  const counts = { total: scoped.length, high: scoped.filter((row) => row.category === 'high').length, mid: scoped.filter((row) => row.category === 'mid').length, low: scoped.filter((row) => row.category === 'low').length }
  const resetFilters = () => { setQuery(''); setCategory('all'); setClassName('all'); setInstrument('all'); setPeriod('30') }
  const filtersActive = Boolean(query || category !== 'all' || className !== 'all' || instrument !== 'all' || period !== '30')

  if (selected) return <ScreeningDetail item={selected} onBack={() => setSelected(null)} />

  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
    <div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Pesma</h1><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Ringkasan skrining untuk membantu pemantauan awal. Data ini bukan diagnosis dan dashboard bersifat baca-saja.</p></div>
    <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">{STATS.map((stat) => <div key={stat.key} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/60"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: stat.bg }}><stat.icon size={20} style={{ color: stat.color }} /></div><div><div className="text-2xl font-extrabold text-slate-900 dark:text-white">{counts[stat.key]}</div><div className="text-[11px] font-semibold text-slate-500">{stat.label}</div></div></div></div>)}</div>
    <Card className="mt-6 overflow-hidden p-0">
      <div className="border-b border-slate-200 p-4 dark:border-slate-700">
        <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari nama, ID, atau kelas…" className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-900" /></div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <select aria-label="Filter periode" value={period} onChange={(e) => setPeriod(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900"><option value="7">7 hari terakhir</option><option value="30">30 hari terakhir</option><option value="90">90 hari terakhir</option><option value="all">Semua waktu</option></select>
          <select aria-label="Filter kelas" value={className} onChange={(e) => setClassName(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900"><option value="all">Semua kelas</option>{classes.map((item) => <option key={item} value={item}>{item}</option>)}</select>
          <select aria-label="Filter instrumen" value={instrument} onChange={(e) => setInstrument(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900"><option value="all">Semua instrumen</option>{instruments.map((item) => <option key={item} value={item}>{item}</option>)}</select>
          <select aria-label="Filter kategori" value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900"><option value="all">Semua kategori</option><option value="high">Tinggi</option><option value="mid">Sedang</option><option value="low">Rendah</option></select>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-500"><span>Menampilkan <b className="text-slate-800 dark:text-slate-200">{filtered.length}</b> dari {scoped.length} skrining.</span>{filtersActive && <button onClick={resetFilters} className="inline-flex items-center gap-1 font-bold text-brand-deep hover:underline dark:text-brand"><FilterX size={14} /> Reset filter</button>}</div>
      </div>
      {error && <p className="p-4 text-sm text-rose-600">{error}</p>}
      {loading ? <p className="p-8 text-center text-sm text-slate-400">Memuat skrining…</p> : <div className="divide-y divide-slate-100 dark:divide-slate-800">{filtered.map((row) => <button key={row.id} onClick={() => setSelected(row)} className="grid w-full gap-3 p-4 text-left hover:bg-slate-50 sm:grid-cols-[1fr_150px_130px_140px] sm:items-center dark:hover:bg-slate-800/50"><div><b className="block text-slate-900 dark:text-white">{row.profiles?.full_name}</b><span className="text-xs text-slate-500">{row.profiles?.login_id} · {row.profiles?.class_name || 'Tanpa kelas'}</span></div><span className="text-xs text-slate-500">{row.instrument}</span><div><Badge category={row.category} label={CATEGORY_META[row.category]?.label || row.category} /></div><time className="text-xs text-slate-500">{new Date(row.submitted_at).toLocaleDateString('id-ID')}</time></button>)}{!filtered.length && <p className="p-8 text-center text-sm text-slate-400">Belum ada data yang cocok.</p>}</div>}
    </Card>
  </motion.div>
}

function ScreeningDetail({ item, onBack }) {
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><button onClick={onBack} className="inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-brand"><ChevronLeft size={16} /> Kembali</button><div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-2xl font-bold text-slate-900 dark:text-white">{item.profiles?.full_name}</h1><p className="mt-1 text-sm text-slate-500">{item.profiles?.login_id} · {item.profiles?.class_name || 'Tanpa kelas'} · {item.instrument}</p></div><Badge category={item.category} label={`Kategori ${CATEGORY_META[item.category]?.label || item.category}`} /></div><Card className="mt-5"><dl className="grid gap-4 sm:grid-cols-3"><div><dt className="text-xs text-slate-500">Waktu pengisian</dt><dd className="mt-1 font-bold">{new Date(item.submitted_at).toLocaleString('id-ID')}</dd></div><div><dt className="text-xs text-slate-500">Skor total</dt><dd className="mt-1 font-bold">{item.total_score ?? '—'}</dd></div><div><dt className="text-xs text-slate-500">Kategori</dt><dd className="mt-1 font-bold">{CATEGORY_META[item.category]?.label}</dd></div></dl>{item.domain_scores && Object.keys(item.domain_scores).length > 0 && <div className="mt-6"><DomainBars domainScores={item.domain_scores} /></div>}{item.summary && <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600 dark:bg-slate-900 dark:text-slate-300">{item.summary}</div>}</Card></motion.div>
}
