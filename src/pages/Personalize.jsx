import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import SectionLabel from '../components/ui/SectionLabel.jsx'
import { useApp } from '../context/AppContext.jsx'
import { MAIN_PROBLEMS, NEEDS } from '../data/pathways.js'

const STEPS = ['Masalah utama', 'Kebutuhanmu', 'Ringkasan']

export default function Personalize() {
  const { result, problem, setProblem, need, setNeed, buildPath } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  if (!result) return <Navigate to="/result" replace />

  const problemObj = MAIN_PROBLEMS.find((p) => p.id === problem)
  const needObj = NEEDS.find((n) => n.id === need)

  const finish = () => {
    buildPath()
    navigate('/pathway')
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h1 className="text-2xl sm:text-3xl font-display text-slate-800 dark:text-slate-100">Personalisasi jalurmu</h1>
      <p className="mt-2 text-[14.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
        Dua pertanyaan singkat biar jalurnya pas buat kamu — bukan cuma hasil "satu ukuran untuk semua".
      </p>

      <div className="mt-6">
        <div className="flex items-center gap-2 mb-6">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1 last:flex-none">
              <span
                className={`flex items-center gap-1.5 text-[11.5px] font-semibold ${
                  i <= step ? 'text-brand-deep dark:text-brand' : 'text-slate-400 dark:text-slate-600'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    i < step ? 'bg-brand/15 text-brand-deep dark:text-brand' : i === step ? 'bg-brand text-white' : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                >
                  {i < step ? <Check size={12} /> : i + 1}
                </span>
                {s}
              </span>
              {i < STEPS.length - 1 && <span className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            <Card>
              <SectionLabel>1 · Hal yang paling kamu rasakan sekarang</SectionLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MAIN_PROBLEMS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setProblem(p.id)}
                    className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                      problem === p.id
                        ? 'border-brand bg-brand/5'
                        : 'border-slate-200 dark:border-slate-700 hover:border-brand dark:hover:border-brand'
                    }`}
                  >
                    <span className="text-2xl">{p.ico}</span>
                    <span>
                      <span className="block font-bold text-sm text-slate-800 dark:text-slate-100">{p.label}</span>
                      <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">{p.desc}</span>
                    </span>
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            <Card>
              <SectionLabel>2 · Apa yang paling kamu butuhkan sekarang</SectionLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {NEEDS.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => setNeed(n.id)}
                    className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                      need === n.id
                        ? 'border-brand bg-brand/5'
                        : 'border-slate-200 dark:border-slate-700 hover:border-brand dark:hover:border-brand'
                    }`}
                  >
                    <span className="text-2xl">{n.ico}</span>
                    <span>
                      <span className="block font-bold text-sm text-slate-800 dark:text-slate-100">{n.label}</span>
                      <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">{n.desc}</span>
                    </span>
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            <Card>
              <SectionLabel>Ringkasan pilihanmu</SectionLabel>
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 p-4">
                  <span className="text-2xl">{problemObj?.ico}</span>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Masalah utama</div>
                    <div className="font-bold text-slate-800 dark:text-slate-100">{problemObj?.label}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 p-4">
                  <span className="text-2xl">{needObj?.ico}</span>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Kebutuhan</div>
                    <div className="font-bold text-slate-800 dark:text-slate-100">{needObj?.label}</div>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-[13px] text-slate-500 dark:text-slate-400">
                Teman Cerita akan menyusun urutan langkah berdasarkan kategori hasilmu dan pilihan ini.
              </p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap gap-3 mt-6">
        {step > 0 && (
          <Button variant="secondary" onClick={() => setStep(step - 1)}>
            <ArrowLeft size={16} /> Kembali
          </Button>
        )}
        {step < 2 ? (
          <Button disabled={step === 0 ? !problem : !need} onClick={() => setStep(step + 1)}>
            Lanjut <ArrowRight size={16} />
          </Button>
        ) : (
          <Button onClick={finish}>
            Susun jalurku <ArrowRight size={16} />
          </Button>
        )}
      </div>
    </motion.div>
  )
}
