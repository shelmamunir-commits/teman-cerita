import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Siren, ArrowLeft, MapPin } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import NearbyMap from '../components/help/NearbyMap.jsx'
import { EMERGENCY_STEPS, HOTLINE, EMERGENCY_NUMBERS } from '../data/helpResources.js'

export default function Safety() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <section className="overflow-hidden rounded-3xl border border-rose-300/40 dark:border-rose-500/40 bg-white dark:bg-slate-800/60 shadow-lg">
        <div className="bg-gradient-to-br from-rose-500 to-rose-700 text-white p-7 sm:p-9">
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-widest mb-5">
            <Siren size={14} /> Protokol Darurat
          </div>
          <h1 className="text-3xl sm:text-4xl font-display">Kamu nggak sendirian.</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-white/90 max-w-lg">
            Kalau kamu sedang punya pikiran untuk menyakiti diri atau merasa dalam krisis, jangan ditunda. Ini saatnya
            segera bicara dengan orang yang bisa menolongmu secara langsung.
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
            Lakukan sekarang
          </div>
          <ul className="space-y-2.5">
            {EMERGENCY_STEPS.map((s, i) => (
              <li key={i} className="flex gap-3 text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-300">
                <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-2xl bg-slate-900 text-white p-5">
            <div className="text-2xl font-extrabold">{HOTLINE.number}</div>
            <div className="text-[12.5px] text-white/70">{HOTLINE.desc}</div>
            <a href={HOTLINE.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex rounded-full bg-white text-slate-900 px-4 py-2 text-sm font-bold hover:bg-emerald-50 transition">
              Buka chat Healing119.id
            </a>
          </div>

          <div className="mt-6">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Nomor darurat
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {EMERGENCY_NUMBERS.map((n) => (
                <a
                  key={n.number}
                  href={`tel:${n.number}`}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:border-brand dark:hover:border-brand transition"
                >
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white">{n.number}</div>
                  <div className="text-[13px] font-bold text-slate-600 dark:text-slate-300">{n.label}</div>
                  <div className="text-[11.5px] text-slate-400 dark:text-slate-500">{n.desc}</div>
                </a>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={18} className="text-rose-500" />
              <span className="font-bold text-slate-900 dark:text-white">Layanan terdekat di sekitarmu</span>
            </div>
            <NearbyMap />
          </div>

          <div className="mt-5 rounded-2xl border border-rose-200/70 dark:border-rose-500/30 bg-rose-50/70 dark:bg-rose-500/10 p-5 text-[12.5px] leading-relaxed text-rose-700 dark:text-rose-300">
            <b>Kenapa nggak ada konten psikoedukasi di sini?</b> Kondisi darurat butuh manusia, bukan AI. Teman Cerita
            sengaja langsung mengarahkan kamu ke bantuan profesional.
          </div>

          <div className="mt-6">
            <Link to="/">
              <button className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-deep dark:hover:text-brand">
                <ArrowLeft size={16} /> Kembali ke beranda
              </button>
            </Link>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
