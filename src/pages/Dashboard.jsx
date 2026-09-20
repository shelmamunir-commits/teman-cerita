import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, Stethoscope, GraduationCap, Search, Users, AlertTriangle, ShieldAlert, ShieldCheck, Download, Bell } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import SectionLabel from '../components/ui/SectionLabel.jsx'
import DomainBars from '../components/charts/DomainBars.jsx'
import { useApp } from '../context/AppContext.jsx'
import { CATEGORY_META } from '../lib/constants.js'
import { GURU_TIPS } from '../data/dashboard.js'
import { cn } from '../lib/cn.js'

const PRIORITY = { high: 0, mid: 1, low: 2 }
const URGENCY_COLOR = { low: '#40ae87', mid: '#f5a623', high: '#f1487c' }

const STATS = [
  { key: 'total', label: 'Total kasus', icon: Users, color: '#3899fe', bg: '#ebf3ff' },
  { key: 'high', label: 'Prioritas tinggi', icon: AlertTriangle, color: '#f1487c', bg: '#feedf2' },
  { key: 'mid', label: 'Prioritas sedang', icon: ShieldAlert, color: '#f5a623', bg: '#fef6e7' },
  { key: 'low', label: 'Prioritas rendah', icon: ShieldCheck, color: '#40ae87', bg: '#e1fbfa' },
]

const STATUS_FILTERS = ['Semua', 'Menunggu ditinjau', 'Sudah divalidasi']

export default function Dashboard() {
  const { dashCases, updateCase } = useApp()
  const [role, setRole] = useState('psikolog')
  const [selectedId, setSelectedId] = useState(null)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('Semua')

  const list = useMemo(
    () => [...dashCases].sort((a, b) => PRIORITY[a.urgency] - PRIORITY[b.urgency]),
    [dashCases],
  )

  const filtered = list.filter((c) => {
    const matchName = c.name.toLowerCase().includes(query.toLowerCase())
    const matchStatus = status === 'Semua' || c.status === status
    return matchName && matchStatus
  })
  const selected = dashCases.find((c) => c.id === selectedId) || null

  const newCount = list.filter((c) => c.isNew).length

  const exportCSV = () => {
    const header = ['Nama', 'Jalur', 'Kategori', 'Status']
    const rows = list.map((c) => [c.name, c.path, CATEGORY_META[c.urgency].label, c.status])
    const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'rekap-kasus-teman-cerita.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (selected) {
    return <CaseDetail caseItem={selected} role={role} onBack={() => setSelectedId(null)} updateCase={updateCase} />
  }

  const counts = {
    total: list.length,
    high: list.filter((c) => c.urgency === 'high').length,
    mid: list.filter((c) => c.urgency === 'mid').length,
    low: list.filter((c) => c.urgency === 'low').length,
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Dashboard Sekolah</h1>
          <p className="mt-2 text-[14px] text-slate-500 dark:text-slate-400">
            Simulasi lokal: kasus terurut otomatis berdasarkan prioritas rule engine. Tampilan berbeda tergantung peran.
          </p>
        </div>

        <div className="inline-flex rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-1">
          <button
            onClick={() => setRole('psikolog')}
            className={cn(
              'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition',
              role === 'psikolog' ? 'bg-brand text-white' : 'text-slate-500 dark:text-slate-400',
            )}
          >
            <Stethoscope size={16} /> Psikolog
          </button>
          <button
            onClick={() => setRole('guru')}
            className={cn(
              'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition',
              role === 'guru' ? 'bg-brand text-white' : 'text-slate-500 dark:text-slate-400',
            )}
          >
            <GraduationCap size={16} /> Guru
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.key} className="rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: s.bg }}>
                <s.icon size={20} style={{ color: s.color }} />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white leading-none">{counts[s.key]}</div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {newCount > 0 && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-300/60 dark:border-rose-500/40 bg-rose-50/70 dark:bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
          <Bell size={16} />
          <span><b>{newCount}</b> kasus baru menunggu ditinjau.</span>
        </div>
      )}

      {/* SEARCH + TABLE */}
      <div className="mt-6 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama siswa…"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:border-brand hover:text-brand-deep transition"
          >
            <Download size={16} /> Ekspor CSV
          </button>
        </div>

        <div className="px-4 py-2 flex flex-wrap gap-2 border-b border-slate-100 dark:border-slate-800">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-[12.5px] font-bold transition',
                status === s
                  ? 'bg-brand text-white'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800',
              )}
            >
              {s}
            </button>
          ))}
        </div>

        {/* header row (desktop) */}
        <div className="hidden md:grid grid-cols-[1fr_140px_130px_150px_40px] gap-4 px-5 py-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
          <span>Nama</span>
          <span>Jalur</span>
          <span>Kategori</span>
          <span>Status</span>
          <span />
        </div>

        {filtered.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedId(c.id)}
            className="w-full grid md:grid-cols-[1fr_140px_130px_150px_40px] gap-4 items-center px-5 py-4 text-left border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: URGENCY_COLOR[c.urgency] }} />
              <span className="min-w-0">
                <span className="block font-bold text-slate-900 dark:text-white truncate">
                  {c.name}
                  {c.isNew && (
                    <span className="ml-2 inline-block bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full align-middle">
                      Baru
                    </span>
                  )}
                </span>
                <span className="md:hidden text-[11.5px] text-slate-500 dark:text-slate-400">{c.path}</span>
              </span>
            </div>
            <span className="hidden md:block text-[12.5px] text-slate-500 dark:text-slate-400">{c.path}</span>
            <div>
              <Badge category={c.urgency} label={CATEGORY_META[c.urgency].label} />
            </div>
            <span className="hidden md:block text-[12.5px] text-slate-500 dark:text-slate-400">{c.status}</span>
            <span className="hidden md:block text-slate-400">→</span>
          </button>
        ))}

        {filtered.length === 0 && (
          <p className="px-5 py-8 text-sm text-slate-400 text-center">Nggak ada kasus yang cocok.</p>
        )}
      </div>
    </motion.div>
  )
}

function CaseDetail({ caseItem, role, onBack, updateCase }) {
  const [note, setNote] = useState(caseItem.psychologistNote || '')
  const [parentInvolve, setParentInvolve] = useState(!!caseItem.parentInvolve)
  const [decision, setDecision] = useState(caseItem.decision || '')
  const [sent, setSent] = useState(false)

  const send = () => {
    if (!decision) return
    const urgency = decision === 'Naikkan prioritas'
      ? caseItem.urgency === 'low' ? 'mid' : 'high'
      : decision === 'Turunkan prioritas'
        ? caseItem.urgency === 'high' ? 'mid' : 'low'
        : caseItem.urgency
    updateCase(caseItem.id, {
      status: 'Sudah divalidasi',
      isNew: false,
      urgency,
      decision,
      psychologistNote: note.trim(),
      parentInvolve,
      reviewedAt: new Date().toISOString(),
    })
    setSent(true)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-deep dark:hover:text-brand mb-4"
      >
        <ChevronLeft size={16} /> Kembali ke daftar
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{caseItem.name}</h1>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">
            Jalur: {caseItem.path} · {caseItem.status}
          </p>
        </div>
        <Badge category={caseItem.urgency} label={`Kategori: ${CATEGORY_META[caseItem.urgency].label}`} />
      </div>

      <Card className="mt-5">
        {role === 'guru' ? (
          <>
            <SectionLabel>Tips untuk guru</SectionLabel>
            <ul className="space-y-2">
              {GURU_TIPS[caseItem.urgency].map((t, i) => (
                <li key={i} className="flex gap-2 text-[13.5px] text-slate-600 dark:text-slate-300">
                  <span className="text-brand">•</span> {t}
                </li>
              ))}
            </ul>
            <div className="mt-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 p-4 text-[12.5px] leading-relaxed text-slate-500 dark:text-slate-400">
              Detail klinis (skor per domain, catatan asesmen) hanya bisa diakses psikolog, buat menjaga privasi siswa.
            </div>
          </>
        ) : (
          <>
            <SectionLabel>Skor per domain</SectionLabel>
            <DomainBars domainScores={caseItem.domainScores} />

            <div className="mt-6">
              <SectionLabel>Catatan dari sistem</SectionLabel>
              <ul className="space-y-2">
                {(caseItem.why || []).map((w, i) => (
                  <li key={i} className="flex gap-2 text-[13.5px] text-slate-600 dark:text-slate-300">
                    <span className="text-brand">•</span> {w}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <SectionLabel>Timeline penanganan</SectionLabel>
              <ol className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-2 space-y-4">
                {[
                  { t: 'Skrining diterima', d: 'Hasil skrining masuk ke sistem', done: true },
                  { t: 'Prioritas sistem ditentukan', d: `Kategori ${CATEGORY_META[caseItem.urgency].label.toLowerCase()} oleh rule engine`, done: true },
                  { t: 'Ditinjau psikolog', d: caseItem.status === 'Sudah divalidasi' ? 'Kasus telah divalidasi' : 'Menunggu validasi', done: caseItem.status === 'Sudah divalidasi' },
                ].map((step, i) => (
                  <li key={i} className="relative pl-5">
                    <span
                      className={cn(
                        'absolute -left-[9px] top-0.5 w-4 h-4 rounded-full border-2 bg-white dark:bg-slate-800',
                        step.done ? 'border-brand' : 'border-slate-300 dark:border-slate-600',
                      )}
                    />
                    <div className="text-[13px] font-bold text-slate-800 dark:text-slate-100">{step.t}</div>
                    <div className="text-[12px] text-slate-500 dark:text-slate-400">{step.d}</div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-6">
              <SectionLabel>Keputusan psikolog</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {['Setujui skor sistem', 'Naikkan prioritas', 'Turunkan prioritas'].map((a) => (
                  <button
                    key={a}
                    onClick={() => {
                      setDecision(a)
                      setSent(false)
                    }}
                    className={cn(
                      'rounded-full border px-4 py-2 text-[12.5px] font-bold transition',
                      decision === a
                        ? 'border-brand bg-brand/5 text-brand-deep dark:text-brand'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-brand hover:text-brand-deep',
                    )}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <SectionLabel>Catatan psikolog</SectionLabel>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Tulis observasi tambahan di sini…"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-brand"
              />
              <label className="flex items-center gap-2 mt-3 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={parentInvolve}
                  onChange={(e) => setParentInvolve(e.target.checked)}
                  className="accent-brand w-4 h-4"
                />
                Perlu keterlibatan orang tua / wali
              </label>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <Button onClick={send} disabled={!decision}>Kirim rekomendasi tindak lanjut</Button>
              {!decision && <span className="self-center text-xs text-slate-400">Pilih keputusan terlebih dahulu.</span>}
              {sent && (
                <span className="self-center text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  ✓ Status kasus diperbarui.
                </span>
              )}
            </div>
          </>
        )}
      </Card>
    </motion.div>
  )
}
