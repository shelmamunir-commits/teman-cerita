import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Wind, Headphones, ThumbsUp, ThumbsDown } from 'lucide-react'
import Button from '../components/ui/Button.jsx'
import { useApp } from '../context/AppContext.jsx'
import { MODULES } from '../data/modules.js'
import { MODULE_REFERENCES } from '../data/references.js'
import { cn } from '../lib/cn.js'

export default function Actions() {
  const { result, pathway, done, toggleDone, feedback, rateModule } = useApp()
  const [open, setOpen] = useState(null)

  if (!result) return <Navigate to="/result" replace />
  if (pathway.length === 0) return <Navigate to="/personalize" replace />

  const total = pathway.length
  const doneCount = pathway.filter((id) => done[id]).length

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h1 className="text-2xl sm:text-3xl font-display text-slate-800 dark:text-slate-100">Lakukan sekarang</h1>
      <p className="mt-2 text-[14.5px] text-slate-500 dark:text-slate-400">
        Buka tiap kartu untuk memahami, lalu coba aktivitas 5 menit-nya.
      </p>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-brand transition-all duration-500"
            style={{ width: `${(doneCount / total) * 100}%` }}
          />
        </div>
        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{doneCount}/{total}</span>
      </div>

      <div className="mt-6 space-y-3">
        {pathway.map((id, i) => {
          const m = MODULES[id]
          const isOpen = open === id
          const checked = !!done[id]
          return (
            <div
              key={id}
              className={cn(
                'rounded-2xl border bg-white dark:bg-slate-800/60 overflow-hidden transition',
                checked ? 'border-emerald-300 dark:border-emerald-500/40' : 'border-slate-200 dark:border-slate-700',
              )}
            >
              <button
                onClick={() => setOpen(isOpen ? null : id)}
                className="w-full flex items-center gap-4 p-4 text-left"
              >
                <span className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: `${m.color}1f` }}>
                  {m.ico}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Langkah {i + 1} · {m.tag}
                  </span>
                  <span className="block font-display font-semibold text-slate-800 dark:text-slate-100">{m.title}</span>
                </span>
                {checked && <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs shrink-0">✓ Selesai</span>}
                <ChevronDown size={18} className={cn('text-slate-400 transition-transform', isOpen && 'rotate-180')} />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-4 pb-5 border-t border-slate-100 dark:border-slate-800 pt-4">
                      <p className="text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-300">{m.explain}</p>

                      <div className="mt-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">🎯 {m.activity.title}</span>
                          <span className="ml-auto text-[11px] font-bold text-brand-deep dark:text-brand bg-brand/10 px-2.5 py-1 rounded-full">
                            ± {m.activity.time}
                          </span>
                        </div>
                        <ol className="list-decimal list-inside space-y-1.5">
                          {m.activity.steps.map((s, j) => (
                            <li key={j} className="text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-300">
                              {s}
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="mt-3 rounded-lg bg-brand/5 text-brand-deep dark:text-brand text-[12px] px-3 py-2">
                        💡 {m.tip}
                      </div>

                      {MODULE_REFERENCES[id] && (
                        <div className="mt-3 text-[11.5px] leading-relaxed text-slate-400 dark:text-slate-500">
                          <span className="font-bold text-slate-500 dark:text-slate-400">Referensi:</span>{' '}
                          {MODULE_REFERENCES[id].join(' · ')}
                        </div>
                      )}

                      <button
                        onClick={() => toggleDone(id)}
                        className={cn(
                          'mt-4 w-full rounded-xl border border-dashed px-4 py-2.5 text-[12.5px] font-bold transition',
                          checked
                            ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                            : 'border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-brand hover:text-brand-deep',
                        )}
                      >
                        {checked ? '✓ Sudah dicoba' : 'Tandai sudah dicoba'}
                      </button>

                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-[12px] text-slate-400">Apakah ini membantu?</span>
                        <button
                          onClick={() => rateModule(id, 'up')}
                          className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center border transition',
                            feedback[id] === 'up'
                              ? 'bg-brand text-white border-brand'
                              : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-brand',
                          )}
                          aria-label="Membantu"
                        >
                          <ThumbsUp size={14} />
                        </button>
                        <button
                          onClick={() => rateModule(id, 'down')}
                          className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center border transition',
                            feedback[id] === 'down'
                              ? 'bg-rose-500 text-white border-rose-500'
                              : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500',
                          )}
                          aria-label="Kurang membantu"
                        >
                          <ThumbsDown size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-3 mt-6">
        <Button as={Link} to="/breathing" variant="secondary"><Wind size={16} /> Coba latihan napas</Button>
        <Button as={Link} to="/meditasi" variant="secondary"><Headphones size={16} /> Meditasi terpandu</Button>
        <Button as={Link} to="/help">Mau cari bantuan?</Button>
      </div>
    </motion.div>
  )
}
