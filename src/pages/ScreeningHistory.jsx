import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import { CATEGORY_META } from '../lib/constants'
import { supabase } from '../lib/supabase'

export default function ScreeningHistory() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    supabase.from('screening_submissions').select('id, instrument, category, total_score, summary, submitted_at').order('submitted_at', { ascending: false }).then(({ data, error: loadError }) => {
      setRows(data || [])
      setError(loadError ? 'Riwayat belum dapat dimuat. Periksa koneksi lalu coba lagi.' : '')
      setLoading(false)
    })
  }, [])
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><h1 className="text-2xl font-bold text-slate-900 dark:text-white">Riwayat skrining saya</h1><p className="mt-2 text-sm text-slate-500">Hanya Anda yang dapat melihat riwayat pribadi ini.</p>{error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">{error}</p>}<div className="mt-6 space-y-3">{loading ? <p className="text-sm text-slate-400">Memuat…</p> : rows.map((row) => <Card key={row.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-bold text-slate-900 dark:text-white">{row.instrument}</h2><p className="mt-1 text-xs text-slate-500">{new Date(row.submitted_at).toLocaleString('id-ID')} · Skor {row.total_score ?? '—'}</p></div><Badge category={row.category} label={CATEGORY_META[row.category]?.label || row.category} /></Card>)}{!loading && !error && !rows.length && <Card><p className="text-center text-sm text-slate-500">Belum ada riwayat skrining.</p></Card>}</div></motion.div>
}
