import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowLeft, ChevronLeft } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import MeditationPlayer from '../components/meditation/MeditationPlayer.jsx'
import { MEDITATIONS } from '../data/meditations.js'
import { recommendMeditations } from '../engine/meditation.js'
import { useApp } from '../context/AppContext.jsx'

export default function Meditation() {
  const { result, problem, need } = useApp()
  const [selected, setSelected] = useState(null)

  const recommended = useMemo(
    () => recommendMeditations(result, problem, need),
    [result, problem, need],
  )

  if (selected) {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <button
          onClick={() => setSelected(null)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-deep dark:hover:text-brand mb-4"
        >
          <ChevronLeft size={16} /> Semua sesi
        </button>

        <div className="flex items-center gap-3">
          <span className="text-3xl">{selected.icon}</span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{selected.title}</h1>
            <div className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">
              {selected.tag} · ±{selected.duration}
            </div>
          </div>
        </div>
        <p className="mt-2 text-[14px] text-slate-500 dark:text-slate-400 leading-relaxed">{selected.description}</p>

        <Card className="mt-5">
          <MeditationPlayer session={selected} />
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Meditasi Terpandu</h1>
      <p className="mt-2 text-[14.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
        Sesi meditasi bersuara yang disesuaikan dengan kondisimu. Pakai earphone untuk hasil terbaik.
      </p>
      <p className="mt-2 text-[12px] text-slate-400">
        Gunakan saat berada di tempat aman dan tidak sedang berkendara atau mengoperasikan alat.
      </p>

      {recommended.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-brand" />
            <span className="font-bold text-slate-900 dark:text-white">Direkomendasikan untukmu</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recommended.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelected(m)}
                className="group flex items-center gap-4 rounded-xl border border-brand/30 bg-brand/5 p-4 text-left hover:border-brand transition"
              >
                <span
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: `${m.color}22` }}
                >
                  {m.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-900 dark:text-white">{m.title}</div>
                  <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {m.tag} · ±{m.duration}
                  </div>
                </div>
                <span className="text-brand-deep dark:text-brand group-hover:translate-x-0.5 transition-transform">→</span>
              </button>
            ))}
          </div>
          {!result && (
            <p className="mt-3 text-[12.5px] text-slate-400">
              Rekomendasi default. Lakukan <Link to="/screening" className="font-bold text-brand-deep dark:text-brand underline">skrining</Link> dulu biar lebih personal.
            </p>
          )}
        </div>
      )}

      <div className="mt-8">
        <div className="font-bold text-slate-900 dark:text-white mb-3">Semua sesi</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MEDITATIONS.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelected(m)}
              className="group rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-5 text-left hover:border-brand dark:hover:border-brand hover:shadow-md transition"
            >
              <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider" style={{ color: m.color }}>
                <span className="text-lg">{m.icon}</span> {m.tag}
              </div>
              <div className="mt-2 font-bold text-slate-900 dark:text-white leading-snug">{m.title}</div>
              <p className="mt-1 text-[12.5px] text-slate-500 dark:text-slate-400 leading-relaxed">{m.description}</p>
              <div className="mt-3 flex items-center justify-between text-[12px] text-slate-400">
                <span>±{m.duration}</span>
                <ArrowLeft size={14} className="rotate-180 text-brand group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
