import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import BreathingGuide from '../components/breathing/BreathingGuide.jsx'

export default function Breathing() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h1 className="text-2xl sm:text-3xl font-display text-slate-800 dark:text-slate-100 text-center">Latihan napas</h1>
      <p className="mt-2 text-[14.5px] text-slate-500 dark:text-slate-400 text-center max-w-md mx-auto leading-relaxed">
        Ikuti lingkaran ini untuk menenangkan tubuh dan pikiran — bagus dilakukan sebelum tidur atau saat merasa cemas.
      </p>

      <Card className="mt-6">
        <BreathingGuide />
      </Card>

      <p className="mt-3 text-center text-[12px] leading-relaxed text-slate-400 max-w-lg mx-auto">
        Lakukan tanpa memaksakan napas. Hentikan bila terasa pusing, sesak, atau tidak nyaman, lalu kembali bernapas normal.
      </p>

      <div className="mt-6 text-center">
        <Link to="/actions">
          <button className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-deep dark:hover:text-brand">
            <ArrowLeft size={16} /> Kembali ke langkah kecil
          </button>
        </Link>
      </div>
    </motion.div>
  )
}
