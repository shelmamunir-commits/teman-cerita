import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Check, ChevronDown } from 'lucide-react'
import Button from '../ui/Button.jsx'
import Card from '../ui/Card.jsx'
import SectionLabel from '../ui/SectionLabel.jsx'
import MoodPicker from '../mood/MoodPicker.jsx'
import { useJournal } from '../../context/JournalContext.jsx'
import { MOODS, MOOD_LABELS } from '../../lib/constants.js'
import { cn } from '../../lib/cn.js'

const DATE_FMT = { weekday: 'short', day: 'numeric', month: 'short' }

export default function JournalTab() {
  const { entries, addEntry, removeEntry } = useJournal()
  const [mood, setMood] = useState(null)
  const [gratitude, setGratitude] = useState(['', '', ''])
  const [schedule, setSchedule] = useState([])
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const hasContent = mood !== null || gratitude.some((item) => item.trim()) || schedule.some((item) => item.text.trim()) || notes.trim()

  const save = () => {
    if (!hasContent) return
    addEntry({
      date: new Date().toLocaleDateString('id-ID', DATE_FMT),
      mood,
      gratitude: gratitude.filter(Boolean),
      schedule,
      notes: notes.trim(),
    })
    setMood(null)
    setGratitude(['', '', ''])
    setSchedule([])
    setNotes('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const addRow = () => setSchedule((s) => [...s, { text: '', time: '', done: false }])
  const updateRow = (i, patch) => setSchedule((s) => s.map((r, j) => (j === i ? { ...r, ...patch } : r)))
  const removeRow = (i) => setSchedule((s) => s.filter((_, j) => j !== i))

  return (
    <div>
      <p className="text-[14.5px] text-slate-500 dark:text-slate-400">Gimana perasaanmu hari ini?</p>

      <div className="mt-4">
        <MoodPicker value={mood} onChange={setMood} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <Card>
          <div className="font-bold text-slate-800 dark:text-slate-100">🙏 Jurnal Syukur</div>
          <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mb-3">3 hal kecil atau besar hari ini</p>
          <div className="space-y-2">
            {gratitude.map((g, i) => (
              <input
                key={i}
                value={g}
                onChange={(e) => setGratitude((arr) => arr.map((v, j) => (j === i ? e.target.value : v)))}
                placeholder={`Hal ke-${i + 1}…`}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
            ))}
          </div>
        </Card>

        <Card>
          <div className="font-bold text-slate-800 dark:text-slate-100">🗓️ Jadwal & Aktivitas</div>
          <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mb-3">Rencana atau kegiatan hari ini</p>
          <div className="space-y-2">
            {schedule.map((row, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={row.done}
                  onChange={(e) => updateRow(i, { done: e.target.checked })}
                  className="accent-brand w-4 h-4 shrink-0"
                />
                <input
                  type="time"
                  value={row.time}
                  onChange={(e) => updateRow(i, { time: e.target.value })}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-2 text-xs w-24 shrink-0 focus:outline-none focus:ring-2 focus:ring-brand"
                />
                <input
                  value={row.text}
                  onChange={(e) => updateRow(i, { text: e.target.value })}
                  placeholder="Aktivitas…"
                  className="flex-1 min-w-0 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                />
                <button onClick={() => removeRow(i)} className="text-rose-400 hover:text-rose-600 shrink-0">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addRow}
            className="mt-2 w-full rounded-lg border border-dashed border-slate-300 dark:border-slate-700 py-2 text-[12.5px] font-semibold text-slate-500 dark:text-slate-400 hover:border-brand hover:text-brand-deep transition"
          >
            + Tambah aktivitas
          </button>
        </Card>

        <Card>
          <div className="font-bold text-slate-800 dark:text-slate-100">📝 Catatan Bebas</div>
          <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mb-3">Apa aja yang pengen kamu tulis</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tulis di sini…"
            rows={6}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-6">
        <Button onClick={save} disabled={!hasContent}>
          <Plus size={16} /> Simpan entri hari ini
        </Button>
        {!hasContent && <span className="text-xs text-slate-400">Isi setidaknya satu bagian terlebih dahulu.</span>}
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400">
            <Check size={16} /> Tersimpan!
          </span>
        )}
      </div>

      {entries.length > 0 && (
        <div className="mt-8">
          <SectionLabel>Riwayat entri</SectionLabel>
          <div className="space-y-2">
            {entries.map((e) => {
              const isOpen = expandedId === e.id
              const preview = e.gratitude[0] || e.notes.slice(0, 60) || 'Nggak ada catatan tambahan'
              return (
                <div
                  key={e.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 overflow-hidden"
                >
                  <div
                    onClick={() => setExpandedId(isOpen ? null : e.id)}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
                  >
                    <span className="text-lg shrink-0">{e.mood !== null && e.mood !== undefined ? MOODS[e.mood] : '—'}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11.5px] font-bold text-slate-700 dark:text-slate-300">{e.date}</div>
                      <div className="text-[12.5px] text-slate-500 dark:text-slate-400 truncate">{preview}</div>
                    </div>
                    <button
                      onClick={(ev) => {
                        ev.stopPropagation()
                        removeEntry(e.id)
                      }}
                      className="text-slate-400 hover:text-rose-500 shrink-0"
                      aria-label="Hapus entri"
                    >
                      <Trash2 size={16} />
                    </button>
                    <ChevronDown
                      size={16}
                      className={cn('text-slate-400 transition-transform shrink-0', isOpen && 'rotate-180')}
                    />
                  </div>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-4 space-y-3">
                          {e.mood !== null && e.mood !== undefined && (
                            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                              <span className="text-xl">{MOODS[e.mood]}</span>
                              <span className="font-semibold">Mood: {MOOD_LABELS[e.mood]}</span>
                            </div>
                          )}

                          {e.gratitude && e.gratitude.length > 0 && (
                            <div>
                              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                                Jurnal Syukur
                              </div>
                              <ul className="space-y-1">
                                {e.gratitude.map((g, i) => (
                                  <li key={i} className="flex gap-2 text-[13px] text-slate-600 dark:text-slate-300">
                                    <span className="text-brand">•</span> {g}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {e.schedule && e.schedule.length > 0 && (
                            <div>
                              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                                Jadwal & Aktivitas
                              </div>
                              <ul className="space-y-1.5">
                                {e.schedule.map((s, i) => (
                                  <li key={i} className="flex items-center gap-2 text-[13px] text-slate-600 dark:text-slate-300">
                                    <span className={cn('text-sm', s.done ? 'text-emerald-500' : 'text-slate-300')}>
                                      {s.done ? '☑' : '☐'}
                                    </span>
                                    {s.time && <span className="text-[11.5px] font-bold text-slate-400">{s.time}</span>}
                                    <span className={cn(s.done && 'line-through text-slate-400')}>
                                      {s.text || '(tanpa keterangan)'}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {e.notes && (
                            <div>
                              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                                Catatan Bebas
                              </div>
                              <p className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                                {e.notes}
                              </p>
                            </div>
                          )}

                          {(!e.gratitude || e.gratitude.length === 0) &&
                            (!e.schedule || e.schedule.length === 0) &&
                            !e.notes &&
                            (e.mood === null || e.mood === undefined) && (
                              <p className="text-[13px] text-slate-400">Nggak ada isian untuk entri ini.</p>
                            )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
