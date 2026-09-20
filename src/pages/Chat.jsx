import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import ChatWidget from '../components/chat/ChatWidget.jsx'

export default function Chat() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="flex items-center gap-2 mb-1">
        <Sparkles size={18} className="text-brand" />
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Asisten Teman Cerita</h1>
      </div>
      <p className="mt-2 text-[14.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
        Ngobrol santai tentang kondisimu. Asisten berbasis aturan ini bisa membantu menjelaskan hasil skrining,
        menyarankan latihan, atau mengarahkanmu ke bantuan.
      </p>

      <div className="mt-6 h-[62vh] max-h-[640px] rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
        <ChatWidget />
      </div>
    </motion.div>
  )
}
