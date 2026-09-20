import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, FileSearch, Route, HeartPulse, NotebookPen, Bell,
  ClipboardList, BookOpen, MessageCircle, Users, CalendarHeart, LayoutDashboard, Headphones,
} from 'lucide-react'
import Button from '../components/ui/Button.jsx'
import DailyCheckIn from '../components/home/DailyCheckIn.jsx'
import Triage from '../components/home/Triage.jsx'
import Goals from '../components/home/Goals.jsx'
import { useChat } from '../context/ChatContext.jsx'
import { useMood } from '../context/MoodContext.jsx'
import { useSettings } from '../context/SettingsContext.jsx'
import { dateKey } from '../components/mood/MoodCalendar.jsx'

const FEATURES = [
  { icon: FileSearch, color: '#40ae87', bg: '#e1fbfa', t: 'Pahami Hasil Skrining', d: 'Sistem menerjemahkan hasil CKG jadi bahasa yang mudah dipahami — tanpa diagnosis.', to: '/result' },
  { icon: Route, color: '#3899fe', bg: '#ebf3ff', t: 'My Journey', d: 'Urutan materi yang pas dengan kondisi dan kebutuhanmu.', to: '/personalize' },
  { icon: HeartPulse, color: '#f1487c', bg: '#feedf2', t: 'Aktivitas & Latihan 5 Menit', d: 'Latihan napas, grounding, dan aktivitas kecil yang bisa langsung dicoba.', to: '/breathing' },
  { icon: Headphones, color: '#40ae87', bg: '#e1fbfa', t: 'Meditasi Terpandu', d: 'Sesi meditasi bersuara yang disesuaikan dengan kondisimu.', to: '/meditasi' },
  { icon: NotebookPen, color: '#7a5af8', bg: '#f2effe', t: 'Mood Tracker & Jurnal', d: 'Catat mood harian, tulis jurnal syukur, lihat polanya.', to: '/jurnal' },
  { icon: ClipboardList, color: '#f5a623', bg: '#fef6e7', t: 'Skrining Mandiri', d: 'Cek kecemasan, mood, stres, tidur, dan beban belajar.', to: '/screening' },
  { icon: BookOpen, color: '#40ae87', bg: '#e1fbfa', t: 'Ruang Paham', d: 'Materi psikoedukasi berbasis referensi, bisa dicari.', to: '/articles' },
  { icon: MessageCircle, color: '#3899fe', bg: '#ebf3ff', t: 'Asisten Teman Cerita', d: 'Ngobrol tentang kondisimu dan dapat saran langkah awal.', chat: true },
  { icon: Users, color: '#7a5af8', bg: '#f2effe', t: 'Ruang Cerita', d: 'Berbagi dan saling dukung secara anonim.', to: '/komunitas' },
]

const QUICK = [
  { to: '/mood', icon: CalendarHeart, t: 'Mood tracker', d: 'Catat & pantau mood harian' },
  { to: '/journal', icon: NotebookPen, t: 'Jurnal harian', d: 'Syukur, jadwal, catatan bebas' },
  { to: '/dashboard', icon: LayoutDashboard, t: 'Dashboard sekolah', d: 'Demo tampilan psikolog & guru' },
]

function GentleLandscape() {
  return (
    <svg className="absolute inset-x-0 bottom-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 400 220" fill="none" preserveAspectRatio="xMidYMax slice">
      <circle cx="330" cy="52" r="34" fill="#ffffff" opacity="0.35" />
      <path d="M0 180 Q200 40 400 180" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" opacity="0.25" />
      <path d="M20 180 Q200 60 380 180" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity="0.5" />
      <line x1="30" y1="180" x2="30" y2="200" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
      <line x1="120" y1="152" x2="120" y2="200" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
      <line x1="200" y1="143" x2="200" y2="200" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
      <line x1="280" y1="152" x2="280" y2="200" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
      <line x1="370" y1="180" x2="370" y2="200" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
      <path d="M0 198 Q200 178 400 198 L400 220 L0 220 Z" fill="#ffffff" opacity="0.12" />
    </svg>
  )
}

export default function Home() {
  const { open } = useChat()
  const { entries } = useMood()
  const { reminder } = useSettings()
  const now = new Date()
  const todayKey = dateKey(now.getFullYear(), now.getMonth(), now.getDate())
  const checkedToday = entries[todayKey] !== undefined && entries[todayKey] !== null

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      {/* HERO */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-deep via-brand to-brand-bright text-white p-8 sm:p-14 text-center">
        <GentleLandscape />
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest bg-white/15 rounded-full px-3 py-1.5 mb-5">
            Pesma Nur Alannur · Kesehatan Mental Remaja
          </span>
          <h1 className="text-3xl sm:text-[2.6rem] leading-[1.15] font-extrabold">
            Pahami Dirimu, Temukan Langkahmu.
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-white/90">
            Teman Cerita menemanimu memahami hasil skrining kesehatan (CKG) dan menemukan langkah nyata. Ayo pahami dirimu, rawat kesehatan mentalmu, dan cari bantuan sesuai kebutuhan. Kamu tidak sendirian.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/result">
              <Button variant="white">
                Masukkan Kode Hasil CKG <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/screening">
              <button className="inline-flex items-center gap-2 rounded-full border border-white/40 text-white text-sm font-semibold px-6 py-3 hover:bg-white/10 transition">
                Skrining Mandiri
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* TRIAGE */}
      <div className="mt-8">
        <div className="text-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Kamu butuh apa hari ini?</h2>
        </div>
        <Triage />
      </div>

      {/* DAILY CHECK-IN */}
      {reminder && !checkedToday && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-amber-300/60 dark:border-amber-500/40 bg-amber-50/70 dark:bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
          <Bell size={16} className="shrink-0" />
          <span>
            Kamu belum check-in hari ini —{' '}
            <Link to="/mood" className="font-bold underline">catat mood sekarang</Link>.
          </span>
        </div>
      )}
      <div className="mt-6">
        <DailyCheckIn />
      </div>

      {/* GOALS */}
      <div className="mt-10 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Apa yang kamu cari?</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Mulai dari yang paling kamu rasakan sekarang.</p>
      </div>
      <div className="mt-5">
        <Goals />
      </div>

      {/* FITUR UNGGULAN */}
      <div className="mt-14 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Fitur Unggulan</h2>
        <p className="mt-3 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Mudah memahami dan merawat kesehatan mentalmu dengan fitur yang personal dan terintegrasi dalam satu tempat.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map((f) => {
          const cardCls =
            'rounded-xl bg-gradient-to-br from-white to-emerald-50/80 dark:from-slate-800/80 dark:to-emerald-950/30 border border-emerald-100 dark:border-emerald-900/60 p-6 text-center hover:shadow-md hover:border-brand dark:hover:border-brand transition'
          const inner = (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl mx-auto" style={{ background: f.bg }}>
                <f.icon size={26} style={{ color: f.color }} />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white leading-tight">{f.t}</h3>
              <p className="mt-2 text-[12.5px] text-slate-500 dark:text-slate-400 leading-relaxed">{f.d}</p>
            </>
          )
          return f.chat ? (
            <button key={f.t} onClick={open} className={cardCls}>
              {inner}
            </button>
          ) : (
            <Link key={f.t} to={f.to} className={cardCls}>
              {inner}
            </Link>
          )
        })}
      </div>

      {/* CTA */}
      <section className="mt-10 relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-deep to-brand px-6 py-10 sm:py-12 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 max-w-2xl mx-auto">
          <div>
            <h3 className="text-2xl font-bold">Mulai perjalananmu</h3>
            <p className="mt-2 text-white/85">Kenali kondisimu dan dapatkan langkah yang tepat dalam satu alur.</p>
          </div>
          <div className="shrink-0">
            <Link to="/result">
              <Button variant="white">Mulai sekarang</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* AKSES CEPAT */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Lengkapi perawatanmu</h2>
        <p className="mt-3 text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Alat bantu harian untuk memantau dan merawat kesehatan mentalmu.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {QUICK.map((q) => (
          <Link
            key={q.to}
            to={q.to}
            className="group rounded-xl bg-gradient-to-br from-white to-emerald-50/80 dark:from-slate-800/80 dark:to-emerald-950/30 border border-emerald-100 dark:border-emerald-900/60 p-6 text-center hover:border-brand dark:hover:border-brand hover:shadow-md transition"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white mx-auto group-hover:bg-brand-deep transition">
              <q.icon size={22} />
            </div>
            <h3 className="mt-4 font-bold text-slate-900 dark:text-white">{q.t}</h3>
            <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">{q.d}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-5 text-[12.5px] leading-relaxed text-slate-500 dark:text-slate-400">
        <b className="text-brand-deep dark:text-brand">Aman &amp; bukan diagnosis.</b> Teman Cerita nggak mendiagnosis
        gangguan apa pun. Sistem hanya memilih, mempersonalisasi, lalu menyampaikan materi yang ditinjau berdasarkan referensi
        terpercaya — keputusan klinis tetap di tangan psikolog. Data inti tersimpan di perangkatmu dan bisa dihapus kapan saja.
      </div>
    </motion.div>
  )
}
