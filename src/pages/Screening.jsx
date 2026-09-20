import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import { QUIZZES } from '../data/quizzes.js'
import { LIKERT } from '../data/quizzes.js'

export default function Screening() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Skrining Mandiri</h1>
      <p className="mt-2 text-[14.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
        Pilih area yang ingin kamu cek. Hasilnya gambaran awal — bukan diagnosis. Jawab sejujur mungkin sesuai kondisi
        rentang waktu yang tertulis pada tiap skrining.
      </p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {QUIZZES.map((q) => (
          <Link
            key={q.id}
            to={`/quiz/${q.id}`}
            className="group flex items-start gap-4 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-5 hover:border-brand dark:hover:border-brand hover:shadow-md transition"
          >
            <span className="text-3xl">{q.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="font-bold text-slate-900 dark:text-white group-hover:text-brand-deep dark:group-hover:text-brand">
                  {q.title}
                </div>
                {q.type === 'phq4' && (
                  <span className="inline-block text-[9.5px] font-extrabold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full whitespace-nowrap">
                    Tervalidasi
                  </span>
                )}
              </div>
              <p className="mt-1 text-[12.5px] text-slate-500 dark:text-slate-400 leading-relaxed">{q.desc}</p>
              <div className="mt-2 text-[11px] text-slate-400">{q.questions.length} pertanyaan · ±2 menit</div>
            </div>
            <ArrowRight size={18} className="text-slate-300 group-hover:text-brand shrink-0 mt-1" />
          </Link>
        ))}
      </div>

      <Card className="mt-6">
        <div className="text-sm font-bold text-slate-900 dark:text-white mb-2">Skala jawaban</div>
        <div className="flex flex-wrap gap-2">
          {LIKERT.map((l, i) => (
            <span key={l} className="text-[12.5px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-full px-3 py-1.5">
              {i} · {l}
            </span>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
