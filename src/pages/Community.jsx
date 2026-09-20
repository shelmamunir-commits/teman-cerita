import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Send, Info } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import SectionLabel from '../components/ui/SectionLabel.jsx'
import MoodPicker from '../components/mood/MoodPicker.jsx'
import { useCommunity } from '../context/CommunityContext.jsx'
import { COMMUNITY_RULES } from '../data/community.js'
import { MOODS } from '../lib/constants.js'
import { cn } from '../lib/cn.js'
import { detectCrisis } from '../engine/chatEngine.js'

export default function Community() {
  const { posts, addPost, addReply, likePost } = useCommunity()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [mood, setMood] = useState(null)
  const [replyFor, setReplyFor] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [safetyAlert, setSafetyAlert] = useState(false)

  const submit = () => {
    if (!body.trim()) return
    if (detectCrisis(`${title} ${body}`)) {
      setSafetyAlert(true)
      return
    }
    addPost({ author: 'Anonim', mood, title: title.trim() || 'Tanpa judul', body: body.trim(), time: 'Baru saja' })
    setTitle('')
    setBody('')
    setMood(null)
    setSafetyAlert(false)
  }

  const submitReply = (id) => {
    if (!replyText.trim()) return
    if (detectCrisis(replyText)) {
      setSafetyAlert(true)
      return
    }
    addReply(id, { author: 'Anonim', body: replyText.trim() })
    setReplyText('')
    setReplyFor(null)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Ruang Cerita</h1>
      <p className="mt-2 text-[14.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
        Simulasi ruang dukungan anonim. Cerita tersimpan lokal di perangkat ini dan tidak dipublikasikan ke internet.
      </p>

      <div className="mt-4 rounded-xl border border-blue-200/60 dark:border-blue-500/30 bg-blue-50/60 dark:bg-blue-500/5 p-4">
        <div className="flex items-center gap-2 text-[13px] font-bold text-slate-700 dark:text-slate-200 mb-2">
          <Info size={15} /> Aturan komunitas
        </div>
        <ul className="space-y-1">
          {COMMUNITY_RULES.map((r, i) => (
            <li key={i} className="text-[12.5px] text-slate-600 dark:text-slate-300">• {r}</li>
          ))}
        </ul>
      </div>

      <Card className="mt-5">
        <SectionLabel>Bagikan ceritamu</SectionLabel>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul (opsional)"
          maxLength={80}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          placeholder="Apa yang ingin kamu ceritakan? (jangan sebut identitas asli ya)"
          maxLength={1000}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <div className="mt-3 flex items-center gap-3">
          <span className="text-[12.5px] text-slate-500 dark:text-slate-400">Mood kamu:</span>
          <MoodPicker value={mood} onChange={setMood} size="sm" />
        </div>
        <div className="mt-4">
          <Button onClick={submit}>
            <Send size={15} /> Kirim cerita
          </Button>
        </div>
        {safetyAlert && (
          <div className="mt-4 rounded-xl border border-rose-300/70 bg-rose-50 dark:bg-rose-500/10 p-4 text-[13px] text-rose-700 dark:text-rose-300">
            Ceritamu menunjukkan kemungkinan kondisi darurat. Demi keselamatanmu, jangan mengandalkan ruang komunitas.
            Hubungi orang yang kamu percaya dan buka{' '}
            <Link to="/safety" className="font-bold underline">bantuan darurat sekarang</Link>.
          </div>
        )}
      </Card>

      <div className="mt-6 space-y-4">
        {posts.map((p) => (
          <div key={p.id} className="rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-5">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-brand/10 text-brand-deep dark:text-brand flex items-center justify-center font-bold text-sm">
                {p.author.charAt(0)}
              </span>
              <div>
                <div className="text-[13px] font-bold text-slate-800 dark:text-slate-100">{p.author}</div>
                <div className="text-[11px] text-slate-400">{p.time}{p.mood !== null ? ` · ${MOODS[p.mood]}` : ''}</div>
              </div>
            </div>
            <div className="mt-3 font-bold text-slate-900 dark:text-white">{p.title}</div>
            <p className="mt-1 text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-300">{p.body}</p>

            <div className="mt-3 flex items-center gap-4">
              <button onClick={() => likePost(p.id)} className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-slate-500 dark:text-slate-400 hover:text-rose-500">
                <Heart size={15} /> {p.likes}
              </button>
              <button onClick={() => setReplyFor(replyFor === p.id ? null : p.id)} className="text-[12.5px] font-bold text-slate-500 dark:text-slate-400 hover:text-brand-deep dark:hover:text-brand">
                Balas ({p.replies.length})
              </button>
            </div>

            {p.replies.length > 0 && (
              <div className="mt-3 space-y-2 border-l-2 border-slate-100 dark:border-slate-700 pl-4">
                {p.replies.map((r, i) => (
                  <div key={i}>
                    <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300">{r.author}</span>
                    <p className="text-[12.5px] text-slate-600 dark:text-slate-400">{r.body}</p>
                  </div>
                ))}
              </div>
            )}

            {replyFor === p.id && (
              <div className="mt-3 flex gap-2">
                <input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Tulis balasan…"
                  maxLength={500}
                  className="flex-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                />
                <button
                  onClick={() => submitReply(p.id)}
                  className={cn('rounded-full px-4 text-sm font-bold text-white', replyText.trim() ? 'bg-brand' : 'bg-slate-300 cursor-not-allowed')}
                >
                  Kirim
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
