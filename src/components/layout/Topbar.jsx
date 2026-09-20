import { Link } from 'react-router-dom'
import { Moon, Sun, Siren, Settings } from 'lucide-react'
import { useTheme } from '../../theme/ThemeProvider.jsx'
import Logo from '../ui/Logo.jsx'

export default function Topbar() {
  const { theme, toggle } = useTheme()

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-emerald-50/85 dark:bg-slate-950/80 border-b border-emerald-200/70 dark:border-emerald-900/50 shadow-[0_1px_18px_rgba(18,143,138,0.06)]">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-10 2xl:px-16 h-16 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-3 group">
          <Logo className="w-9 h-9 drop-shadow-sm" />
          <span className="leading-tight">
            <span className="block font-extrabold tracking-tight text-emerald-950 dark:text-emerald-50">Teman Cerita</span>
            <span className="block text-[10px] font-semibold tracking-wide text-emerald-700/80 dark:text-emerald-300/80">Pesma Nur Alannur</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Ganti tema"
            className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <Link
            to="/pengaturan"
            aria-label="Pengaturan"
            className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Settings size={17} />
          </Link>
          <Link
            to="/safety"
            className="inline-flex items-center gap-1.5 rounded-full border border-rose-300/60 dark:border-rose-500/40 bg-white dark:bg-transparent text-rose-600 dark:text-rose-400 text-xs font-bold px-3 py-2 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition"
          >
            <Siren size={14} />
            <span className="hidden sm:inline">Bantuan darurat</span>
            <span className="sm:hidden">Darurat</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
