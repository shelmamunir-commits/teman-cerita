import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import SectionLabel from '../components/ui/SectionLabel.jsx'
import DomainRadar from '../components/charts/DomainRadar.jsx'
import DomainBars from '../components/charts/DomainBars.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useTypewriter } from '../hooks/useTypewriter.js'
import { CATEGORY_META } from '../lib/constants.js'
import Phq4Result from '../components/result/Phq4Result.jsx'

export default function Understand() {
  const { result, name } = useApp()

  if (!result) return <Navigate to="/result" replace />
  if (result.phq4) return <Phq4Result result={result} name={name} />

  const meta = CATEGORY_META[result.category]
  const typed = useTypewriter(result.explain)

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h1 className="text-2xl sm:text-3xl font-display text-slate-800 dark:text-slate-100">
        Hasilmu{name ? `, ${name}` : ''}
      </h1>
      <p className="mt-2 text-[14.5px] text-slate-500 dark:text-slate-400">
        Kode <b>{result.code}</b> · begini Teman Cerita membacanya:
      </p>

      <Card className="mt-6">
        <Badge category={result.category} label={`Kategori: ${meta.label}`} />

        <p className="min-h-[110px] text-[14.5px] leading-relaxed text-slate-700 dark:text-slate-200">
          {typed}
          <span className="inline-block w-[2px] h-4 bg-brand align-middle ml-0.5 animate-pulse" />
        </p>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div>
            <SectionLabel>Peta sinyal per domain</SectionLabel>
            <DomainBars domainScores={result.domainScores} />
          </div>
          <div className="hidden lg:block">
            <SectionLabel>Radar</SectionLabel>
            <DomainRadar domainScores={result.domainScores} />
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-blue-200/60 dark:border-blue-500/30 bg-blue-50/60 dark:bg-blue-500/5 p-4 text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-300">
          <b className="text-brand-deep dark:text-brand">Ini bukan diagnosis.</b> Skor ini cuma membantu kamu memahami
          sinyal-sinyal dari jawabanmu — keputusan apa pun tetap ada di tangan tenaga profesional.
        </div>
      </Card>

      {result.category === 'high' && (
        <div className="mt-4 rounded-2xl border border-rose-300/60 dark:border-rose-500/40 bg-rose-50/70 dark:bg-rose-500/10 p-5 text-sm leading-relaxed text-rose-700 dark:text-rose-300">
          <b>Hasilmu masuk kategori tinggi.</b> Kami sangat menyarankan untuk segera menghubungi psikolog/konselor —
          kamu nggak perlu menghadapi ini sendirian.{' '}
          <Link to="/safety" className="font-bold underline">
            Lihat bantuan
          </Link>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-6">
        <Link to="/personalize">
          <Button>
            Personalisasi jalurku <ArrowRight size={16} />
          </Button>
        </Link>
        <Link to="/help">
          <Button variant="secondary">Lihat bantuan</Button>
        </Link>
      </div>
    </motion.div>
  )
}
