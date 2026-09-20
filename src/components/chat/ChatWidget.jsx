import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Send, Sparkles, Mic, MicOff, Volume2, VolumeX, Trash2 } from 'lucide-react'
import { useChat } from '../../context/ChatContext.jsx'
import useSpeechRecognition from '../../hooks/useSpeechRecognition.js'
import useSpeechSynthesis from '../../hooks/useSpeechSynthesis.js'
import { cn } from '../../lib/cn.js'

export default function ChatWidget() {
  const { messages, typing, send, clear } = useChat()
  const inputRef = useRef(null)
  const endRef = useRef(null)
  const lastSpokenRef = useRef(-1)

  const stt = useSpeechRecognition()
  const tts = useSpeechSynthesis()
  const [voiceReplies, setVoiceReplies] = useState(false)
  const [micActive, setMicActive] = useState(false)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  // kirim transkrip suara setelah dikenali
  useEffect(() => {
    if (micActive && !stt.listening && stt.transcript) {
      send(stt.transcript)
      stt.resetTranscript()
      setMicActive(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stt.listening, stt.transcript, micActive])

  // bacakan balasan bot bila fitur suara aktif
  useEffect(() => {
    if (!voiceReplies || !tts.supported) return
    const last = messages[messages.length - 1]
    if (last && last.role === 'bot' && messages.length - 1 !== lastSpokenRef.current) {
      lastSpokenRef.current = messages.length - 1
      tts.speak(last.text)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, voiceReplies, tts.supported])

  const toggleMic = () => {
    if (micActive) {
      stt.stop()
      setMicActive(false)
      return
    }
    setMicActive(true)
    stt.start()
  }

  const toggleVoiceReplies = () => {
    const next = !voiceReplies
    setVoiceReplies(next)
    if (!next) tts.cancel()
  }

  const submit = (e) => {
    e.preventDefault()
    const val = inputRef.current?.value
    if (val) {
      send(val)
      inputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <div
              className={
                m.role === 'user'
                  ? 'max-w-[80%] rounded-2xl rounded-br-sm bg-brand text-white px-4 py-2.5 text-sm'
                  : 'max-w-[85%] rounded-2xl rounded-bl-sm bg-slate-100 dark:bg-slate-700 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100'
              }
            >
              {m.text}
              {m.crisis && (
                <div className="mt-2 rounded-lg bg-rose-500 text-white px-3 py-2 text-[12.5px] font-semibold">
                  Kamu nggak sendirian — buka bantuan darurat sekarang.
                </div>
              )}
              {m.actions && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {m.actions.map((a, j) =>
                    a.to ? (
                      <Link
                        key={j}
                        to={a.to}
                        className="rounded-full bg-white dark:bg-slate-600 border border-brand text-brand-deep dark:text-white text-xs font-semibold px-3 py-1.5"
                      >
                        {a.label}
                      </Link>
                    ) : a.href ? (
                      <a
                        key={j}
                        href={a.href}
                        target={a.href.startsWith('http') ? '_blank' : undefined}
                        rel={a.href.startsWith('http') ? 'noreferrer' : undefined}
                        className="rounded-full bg-white dark:bg-slate-600 border border-brand text-brand-deep dark:text-white text-xs font-semibold px-3 py-1.5"
                      >
                        {a.label}
                      </a>
                    ) : (
                      <button
                        key={j}
                        onClick={() => send(a.reply)}
                        className="rounded-full bg-white dark:bg-slate-600 border border-brand text-brand-deep dark:text-white text-xs font-semibold px-3 py-1.5"
                      >
                        {a.label}
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm bg-slate-100 dark:bg-slate-700 px-4 py-2.5 text-sm text-slate-500 flex gap-1">
              <span className="animate-bounce">●</span>
              <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>●</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</span>
            </div>
          </div>
        )}
        {micActive && (
          <div className="flex justify-end">
            <div className="rounded-2xl rounded-br-sm bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 px-4 py-2.5 text-sm text-rose-600 dark:text-rose-300 flex items-center gap-2">
              <Mic size={15} className={cn(stt.listening && 'animate-pulse')} />
              {stt.listening ? 'Mendengarkan…' : stt.error ? 'Mic gagal — coba lagi.' : 'Mendengarkan selesai.'}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={submit} className="border-t border-slate-200 dark:border-slate-700 p-3 flex gap-2">
        <input
          ref={inputRef}
          placeholder={micActive ? 'Bicara sekarang…' : 'Ketik pesan…'}
          className="flex-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
        {stt.supported && (
          <button
            type="button"
            onClick={toggleMic}
            aria-label="Bicara"
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center transition border',
              micActive
                ? 'bg-rose-500 text-white border-rose-500'
                : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-brand',
            )}
          >
            {micActive ? <MicOff size={17} /> : <Mic size={17} />}
          </button>
        )}
        <button
          type="submit"
          className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center hover:bg-brand-deep transition"
          aria-label="Kirim"
        >
          <Send size={16} />
        </button>
      </form>

      <div className="px-4 py-2 flex items-center justify-between gap-3 text-[10px] text-slate-400">
        <span className="flex items-center gap-1">
          <Sparkles size={11} /> Simulasi rule-based — bukan psikolog, bukan diagnosis.
        </span>
        <span className="flex items-center gap-2 shrink-0">
          {tts.supported && (
            <button
              onClick={toggleVoiceReplies}
              className={cn(
                'inline-flex items-center gap-1 font-bold',
                voiceReplies ? 'text-brand-deep dark:text-brand' : 'text-slate-400',
              )}
            >
              {voiceReplies ? <Volume2 size={13} /> : <VolumeX size={13} />}
              {voiceReplies ? 'Suara on' : 'Suara off'}
            </button>
          )}
          <button onClick={clear} className="inline-flex items-center gap-1 font-bold hover:text-rose-500" title="Hapus percakapan">
            <Trash2 size={12} /> Reset
          </button>
        </span>
      </div>
    </div>
  )
}
