import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import { useSettings } from '../../context/SettingsContext.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { GOALS } from '../../data/goals.js'
import { cn } from '../../lib/cn.js'

const STEPS = ['Disclaimer', 'Kenalan', 'Tujuan']

export default function Onboarding() {
  const { onboarded, setOnboarded, setConsent } = useSettings()
  const { name, setName, goal, setGoal } = useApp()
  const [step, setStep] = useState(0)
  const [draftName, setDraftName] = useState(name)

  const finish = () => {
    setName(draftName.trim())
    setConsent(true)
    setOnboarded(true)
  }

  return (
    <Modal open={!onboarded} onClose={() => {}} title={`Selamat datang di Teman Cerita · ${step + 1}/${STEPS.length}`}>
      <div className="flex gap-1.5 mb-5">
        {STEPS.map((s, i) => (
          <div key={s} className={cn('h-1.5 flex-1 rounded-full', i <= step ? 'bg-brand' : 'bg-slate-200 dark:bg-slate-700')} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="s0" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
            <div className="space-y-3 text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-300">
              <p>
                <b className="text-slate-900 dark:text-white">Teman Cerita bukan alat diagnosis</b> dan bukan pengganti
                psikolog atau tenaga kesehatan. Hasil yang kamu lihat hanyalah gambaran awal.
              </p>
              <p>
                <b className="text-slate-900 dark:text-white">Data inti tersimpan lokal.</b> Hasil skrining, mood, jurnal,
                dan percakapan disimpan di perangkatmu (localStorage). Fitur peta memakai Google Maps dan hanya memakai
                lokasi presisi setelah kamu memberikan izin.
              </p>
              <p className="text-[12.5px] text-slate-400">
                Kalau kamu sedang dalam krisis, segera buka{' '}
                <span className="font-bold text-rose-500">Bantuan Darurat</span>.
              </p>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
            <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300 block mb-2">
              Nama panggilan (opsional)
            </label>
            <input
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder="mis. Raka"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <p className="mt-2 text-[12px] text-slate-400">Dipakai buat menyapa kamu di hasil &amp; saran.</p>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
            <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300 block mb-3">
              Apa yang paling kamu rasakan sekarang?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {GOALS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className={cn(
                    'rounded-xl border p-3 text-center transition',
                    goal === g.id
                      ? 'border-brand bg-brand/5'
                      : 'border-slate-200 dark:border-slate-700 hover:border-brand',
                  )}
                >
                  <div className="text-xl">{g.icon}</div>
                  <div className="mt-1 text-[12.5px] font-bold text-slate-800 dark:text-slate-100">{g.label}</div>
                </button>
              ))}
            </div>
            <p className="mt-2 text-[12px] text-slate-400">Bisa dilewati — nanti tetap bisa diubah.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 flex gap-3">
        {step > 0 && (
          <Button variant="secondary" onClick={() => setStep(step - 1)}>
            <ArrowLeft size={16} /> Kembali
          </Button>
        )}
        {step < 2 ? (
          <Button className="flex-1" onClick={() => setStep(step + 1)}>
            Lanjut <ArrowRight size={16} />
          </Button>
        ) : (
          <Button className="flex-1" onClick={finish}>
            <Check size={16} /> Mulai jelajah
          </Button>
        )}
      </div>
    </Modal>
  )
}
