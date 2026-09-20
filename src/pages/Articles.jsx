import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Clock } from 'lucide-react'
import { ARTICLES } from '../data/articles.js'
import { cn } from '../lib/cn.js'

const CATEGORIES = ['Semua', 'Stres', 'Kecemasan', 'Suasana Hati', 'Tidur', 'Sosial', 'Bantuan']

export default function Articles() {
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('Semua')

  const filtered = useMemo(() => {
    return ARTICLES.filter((a) => {
      const matchCat = cat === 'Semua' || a.category === cat
      const haystack = [a.title, a.category, a.excerpt, ...a.blocks.flatMap((b) => b.items || b.text || [])]
        .join(' ')
        .toLowerCase()
      const matchQuery = haystack.includes(query.trim().toLowerCase())
      return matchCat && matchQuery
    })
  }, [query, cat])

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Ruang Paham</h1>
      <p className="mt-2 text-[14.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
        Materi yang mudah dipahami untuk membantumu mengenali dan merawat kesehatan mentalmu.
      </p>

      <div className="mt-6 relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari topik…"
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 pl-9 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cn(
              'rounded-full px-4 py-1.5 text-[13px] font-bold transition',
              cat === c
                ? 'bg-brand text-white'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-brand',
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((a) => (
          <Link
            key={a.slug}
            to={`/articles/${a.slug}`}
            className="group rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-5 hover:border-brand dark:hover:border-brand hover:shadow-md transition"
          >
            <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-brand-deep dark:text-brand">
              <span className="text-base">{a.icon}</span> {a.category}
            </div>
            <div className="mt-2 font-bold text-slate-900 dark:text-white leading-snug group-hover:text-brand-deep dark:group-hover:text-brand">
              {a.title}
            </div>
            <p className="mt-1.5 text-[12.5px] text-slate-500 dark:text-slate-400 leading-relaxed">{a.excerpt}</p>
            <div className="mt-3 flex items-center gap-1.5 text-[11.5px] text-slate-400">
              <Clock size={13} /> {a.readingTime} menit baca
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-slate-400">Nggak ada artikel yang cocok dengan pencarianmu.</p>
        )}
      </div>
    </motion.div>
  )
}
