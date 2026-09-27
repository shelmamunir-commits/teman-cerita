import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Siren, ArrowLeft, ClipboardList, MapPin, MessageCircle, Phone } from 'lucide-react'
import NearbyMap from '../components/help/NearbyMap.jsx'
import { EMERGENCY_CONTACTS, EMERGENCY_STEPS } from '../data/helpResources.js'

const CONTACT_ICONS = {
  whatsapp: MessageCircle,
  phone: Phone,
  form: ClipboardList,
}

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

          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 dark:border-emerald-500/30 dark:bg-emerald-500/10">
            <div className="flex items-center gap-2">
              <MessageCircle size={19} className="text-emerald-700 dark:text-emerald-300" />
              <h2 className="font-bold text-slate-900 dark:text-white">Kontak bantuan darurat</h2>
            </div>
            <p className="mt-2 text-[12.5px] leading-relaxed text-slate-600 dark:text-slate-300">
              Jangan menghadapi kondisi darurat sendirian. Pilih bantuan yang paling sesuai dengan kondisimu.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {EMERGENCY_CONTACTS.map((contact) => {
                const ContactIcon = CONTACT_ICONS[contact.kind]
                return (
                  <a
                    key={contact.id}
                    href={contact.url}
                    target={contact.external ? '_blank' : undefined}
                    rel={contact.external ? 'noopener noreferrer' : undefined}
                    aria-label={`${contact.action}: ${contact.name}`}
                    className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-white p-4 transition hover:border-emerald-500 hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-emerald-800 dark:bg-slate-900 dark:hover:border-emerald-500 dark:hover:bg-emerald-500/10"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                      <ContactIcon size={19} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-bold leading-tight text-slate-900 dark:text-white">{contact.name}</span>
                      <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{contact.role} · {contact.detail}</span>
                      <span className="mt-2 block text-xs font-bold text-emerald-700 dark:text-emerald-300">{contact.action}</span>
                    </span>
                  </a>
                )
              })}
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-center gap-2">
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
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-deep dark:hover:text-brand">
              <ArrowLeft size={16} /> Kembali ke beranda
            </Link>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
