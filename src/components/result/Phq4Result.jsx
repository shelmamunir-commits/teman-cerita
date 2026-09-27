import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, AlertTriangle } from 'lucide-react'
import Button from '../ui/Button.jsx'
import Card from '../ui/Card.jsx'
import Badge from '../ui/Badge.jsx'
import SectionLabel from '../ui/SectionLabel.jsx'

const TIER_BADGE = { normal: 'low', mild: 'low', moderate: 'mid', severe: 'high' }

function Subscale({ name, score, positive }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <div className="flex items-center justify-between">
        <div className="text-[13px] font-bold text-slate-800 dark:text-slate-100">{name}</div>
        <div className="text-sm font-extrabold text-slate-900 dark:text-white">{score}/6</div>
      </div>
      <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${(score / 6) * 100}%`, background: positive ? '#f1487c' : '#40ae87' }}
        />
      </div>
      <div className={`mt-2 text-[12px] font-semibold ${positive ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
        {positive ? '⚠ Indikasi positif — perlu pemeriksaan lanjutan.' : '✓ Dalam rentang normal.'}
      </div>
    </div>
  )
}

export default function Phq4Result({ result, name }) {
  const p = result.phq4
  const needFollowUp = p.tier === 'severe' || p.anxietyPositive || p.depressionPositive

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h1 className="text-2xl sm:text-3xl font-display text-slate-800 dark:text-slate-100">
        Hasil PHQ-4{name ? `, ${name}` : ''}
      </h1>
      <p className="mt-2 text-[14.5px] text-slate-500 dark:text-slate-400">
        Skrining tekanan psikologis (kecemasan &amp; depresi) dalam 2 minggu terakhir.
      </p>

      <Card className="mt-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="text-4xl font-extrabold text-slate-900 dark:text-white">
            {p.total}
            <span className="text-lg font-bold text-slate-400">/12</span>
          </div>
          <Badge category={TIER_BADGE[p.tier]} label={`${p.label} · ${p.range}`} />
        </div>

        <p className="mt-4 text-[14.5px] leading-relaxed text-slate-700 dark:text-slate-200">{p.desc}</p>

        <div className="mt-6">
          <SectionLabel>Subskala</SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Subscale name="Kecemasan (pertanyaan 1–2)" score={p.anxiety} positive={p.anxietyPositive} />
            <Subscale name="Depresi (pertanyaan 3–4)" score={p.depression} positive={p.depressionPositive} />
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-blue-200/60 dark:border-blue-500/30 bg-blue-50/60 dark:bg-blue-500/5 p-4 text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-300">
          <b className="text-brand-deep dark:text-brand">Ini bukan diagnosis.</b> PHQ-4 adalah alat skrining awal — hasil
          ini membantu mengenali sinyal, bukan menggantikan penilaian psikolog atau dokter.
        </div>

        <div className="mt-3 text-[11.5px] text-slate-400 dark:text-slate-500">
          Sumber: {p.source} ·{' '}
          <a href={p.reference} target="_blank" rel="noreferrer" className="underline hover:text-brand-deep dark:hover:text-brand">
            lihat referensi
          </a>
        </div>
      </Card>

      {needFollowUp && (
        <div className="mt-4 rounded-2xl border border-rose-300/60 dark:border-rose-500/40 bg-rose-50/70 dark:bg-rose-500/10 p-5 text-sm leading-relaxed text-rose-700 dark:text-rose-300">
          <div className="flex items-center gap-2 font-bold mb-1">
            <AlertTriangle size={16} /> Pertimbangkan untuk mencari bantuan
          </div>
          Skor subskala menunjukkan indikasi positif gejala kecemasan/depresi. Sebaiknya konsultasikan hasil ini ke
          konselor atau tenaga profesional untuk pemeriksaan lebih lanjut.{' '}
          <Link to="/help" className="font-bold underline">Lihat jalur bantuan</Link>.
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-6">
        <Button as={Link} to="/personalize">Personalisasi jalurku <ArrowRight size={16} /></Button>
        <Button as={Link} to="/help" variant="secondary">Lihat bantuan</Button>
      </div>
    </motion.div>
  )
}
