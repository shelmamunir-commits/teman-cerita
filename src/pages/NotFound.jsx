import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, SearchX } from 'lucide-react'
import Card from '../components/ui/Card.jsx'

export default function NotFound() {
  return (
    <motion.div className="mx-auto max-w-lg py-10 text-center" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <SearchX className="mx-auto text-brand" size={36} />
        <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Halaman tidak ditemukan</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Alamat yang dibuka tidak tersedia atau sudah berubah.</p>
        <Link to="/" className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-deep"><ArrowLeft size={16} /> Kembali ke beranda</Link>
      </Card>
    </motion.div>
  )
}
