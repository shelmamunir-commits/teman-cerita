import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Button from '../components/ui/Button.jsx'
import { useApp } from '../context/AppContext.jsx'
import { MODULES } from '../data/modules.js'

export default function Pathway() {
  const { result, pathway, name } = useApp()

  if (!result) return <Navigate to="/result" replace />
  if (pathway.length === 0) return <Navigate to="/personalize" replace />

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h1 className="text-2xl sm:text-3xl font-display text-slate-800 dark:text-slate-100">
        Ini jalurmu{name ? `, ${name}` : ''}
      </h1>
      <p className="mt-2 text-[14.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
        Berdasarkan hasil skrining dan pilihan kamu, Teman Cerita menyusun urutan langkah ini. Kerjakan pelan-pelan, nggak
        harus sekaligus.
      </p>

      <div className="mt-6 space-y-3">
        {pathway.map((id, i) => {
          const m = MODULES[id]
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-4"
            >
              <span
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: `${m.color}1f` }}
              >
                {m.ico}
              </span>
              <div className="min-w-0">
                <div className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Langkah {i + 1} · {m.tag}
                </div>
                <div className="font-display font-semibold text-slate-800 dark:text-slate-100">{m.title}</div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-3 mt-6">
        <Link to="/actions">
          <Button>
            Mulai langkah kecil <ArrowRight size={16} />
          </Button>
        </Link>
        <Link to="/personalize">
          <Button variant="secondary">Ubah pilihan</Button>
        </Link>
      </div>
    </motion.div>
  )
}
