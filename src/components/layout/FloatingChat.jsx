import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'
import ChatWidget from '../chat/ChatWidget.jsx'
import { useChat } from '../../context/ChatContext.jsx'
import Logo from '../ui/Logo.jsx'

export default function FloatingChat() {
  const { isOpen, toggle } = useChat()

  return (
    <>
      <button
        onClick={toggle}
        aria-label="Buka asisten virtual"
        className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-brand text-white shadow-lg hover:bg-brand-deep transition flex items-center justify-center"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-5 z-40 w-[calc(100vw-2.5rem)] max-w-sm h-[70vh] max-h-[560px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
              <Logo className="w-8 h-8" />
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">Asisten Teman Cerita</div>
                <div className="text-[11px] text-emerald-500 font-semibold">● Online</div>
              </div>
            </div>
            <ChatWidget />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
