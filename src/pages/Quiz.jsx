import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import { useApp } from '../context/AppContext.jsx'
import { QUIZZES, LIKERT } from '../data/quizzes.js'
import { scoreQuiz, scorePhq4 } from '../engine/quizEngine.js'
import { cn } from '../lib/cn.js'

export default function Quiz() {
  const { quizId } = useParams()
  const quiz = QUIZZES.find((q) => q.id === quizId)
  const navigate = useNavigate()
  const { submitQuizResult } = useApp()
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)

  if (!quiz) return <Navigate to="/screening" replace />

  const total = quiz.questions.length
  const q = quiz.questions[idx]
  const options = quiz.options || LIKERT

  const choose = (i) => setSelected(i)

  const next = () => {
    const newAnswers = [...answers]
    newAnswers[idx] = selected
    setAnswers(newAnswers)
    setSelected(null)
    if (idx + 1 >= total) {
      const analysis = quiz.type === 'phq4' ? scorePhq4(quiz, newAnswers) : scoreQuiz(quiz, newAnswers)
      submitQuizResult(analysis)
      navigate('/understand')
    } else {
      setIdx(idx + 1)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="flex items-center justify-between">
        <div className="font-bold text-slate-900 dark:text-white">{quiz.icon} {quiz.title}</div>
        <div className="text-sm font-bold text-slate-500 dark:text-slate-400">
          {idx + 1}/{total}
        </div>
      </div>

      <div className="mt-3 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div className="h-full bg-brand transition-all duration-300" style={{ width: `${((idx + 1) / total) * 100}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="mt-6">
            <p className="text-[15px] font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">{q.text}</p>
            <div className="mt-5 space-y-2">
              {options.map((l, i) => (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  className={cn(
                    'w-full flex items-center gap-3 rounded-xl border p-3.5 text-left text-sm transition',
                    selected === i
                      ? 'border-brand bg-brand/5 text-brand-deep dark:text-brand'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-brand',
                  )}
                >
                  <span
                    className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0',
                      selected === i ? 'border-brand' : 'border-slate-300 dark:border-slate-600',
                    )}
                  >
                    {selected === i && <Check size={12} className="text-brand" />}
                  </span>
                  {l}
                </button>
              ))}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex flex-wrap gap-3 mt-6">
        {idx > 0 && (
          <Button variant="secondary" onClick={() => { setIdx(idx - 1); setSelected(answers[idx - 1] ?? null) }}>
            <ArrowLeft size={16} /> Kembali
          </Button>
        )}
        <Button disabled={selected === null} onClick={next}>
          {idx + 1 >= total ? 'Lihat hasil' : 'Lanjut'} <ArrowRight size={16} />
        </Button>
      </div>

      <div className="mt-6">
        <Link to="/screening" className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-deep dark:hover:text-brand">
          ← Batalkan skrining
        </Link>
      </div>
    </motion.div>
  )
}
