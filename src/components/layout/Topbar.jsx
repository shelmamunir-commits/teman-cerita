import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown, ClipboardList, GraduationCap, LayoutDashboard, LogIn, LogOut, Moon, Settings, Shield, Siren, Sun, UserCircle } from 'lucide-react'
import { useTheme } from '../../theme/ThemeProvider.jsx'
import Logo from '../ui/Logo.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { PERMISSIONS } from '../../lib/permissions.js'

export default function Topbar() {
  const { theme, toggle } = useTheme()
  const { user, profile, hasPermission, signOut } = useAuth()
  const navigate = useNavigate()
  const menuRef = useRef(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const close = (event) => { if (!menuRef.current?.contains(event.target)) setOpen(false) }
    const closeWithKeyboard = (event) => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', closeWithKeyboard)
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', closeWithKeyboard) }
  }, [open])

  const accountLinks = [
    hasPermission(PERMISSIONS.DASHBOARD_READ_ALL) && { to: '/dashboard', label: 'Dashboard Pesma', icon: LayoutDashboard },
    hasPermission(PERMISSIONS.STUDENTS_READ) && { to: '/data-santri', label: 'Data santri', icon: GraduationCap },
    hasPermission(PERMISSIONS.SCREENING_READ_SELF) && { to: '/riwayat-skrining', label: 'Riwayat skrining', icon: ClipboardList },
    [PERMISSIONS.USERS_READ, PERMISSIONS.ROLES_MANAGE, PERMISSIONS.USERS_IMPORT, PERMISSIONS.AUDIT_READ].some(hasPermission) && { to: '/sysadmin', label: 'Pengelolaan sistem', icon: Shield },
    { to: '/profil', label: 'Profil saya', icon: UserCircle },
    { to: '/pengaturan', label: 'Pengaturan', icon: Settings },
  ].filter(Boolean)

  const logout = async () => {
    setOpen(false)
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-30 border-b border-emerald-200/70 bg-emerald-50/85 shadow-[0_1px_18px_rgba(18,143,138,0.06)] backdrop-blur-md dark:border-emerald-900/50 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 w-full items-center justify-between gap-3 px-4 sm:px-6 lg:px-10 2xl:px-16">
        <Link to="/" className="group flex items-center gap-3">
          <Logo className="h-9 w-9 drop-shadow-sm" />
          <span className="leading-tight">
            <span className="block font-extrabold tracking-tight text-emerald-950 dark:text-emerald-50">Teman Cerita</span>
            <span className="block text-[10px] font-semibold tracking-wide text-emerald-700/80 dark:text-emerald-300/80">Pesma Nur Alannur</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button onClick={toggle} aria-label="Ganti tema" className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {user && profile ? (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-haspopup="menu" className="flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 text-slate-700 transition hover:border-brand dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-[10px] font-extrabold text-white">{profile.full_name?.charAt(0).toUpperCase()}</span>
                <span className="hidden max-w-32 truncate text-xs font-bold md:block">{profile.full_name}</span>
                <ChevronDown size={14} className={open ? 'rotate-180 transition' : 'transition'} />
              </button>
              {open && (
                <div role="menu" className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
                  <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                    <div className="truncate text-sm font-bold text-slate-900 dark:text-white">{profile.full_name}</div>
                    <div className="mt-0.5 text-xs text-slate-500">{profile.login_id} · {profile.roles?.name}</div>
                  </div>
                  <div className="p-1.5">{accountLinks.map((item) => <Link key={item.to} to={item.to} onClick={() => setOpen(false)} role="menuitem" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-emerald-50 hover:text-brand-deep dark:text-slate-300 dark:hover:bg-emerald-500/10 dark:hover:text-brand"><item.icon size={16} /> {item.label}</Link>)}</div>
                  <div className="border-t border-slate-100 p-1.5 dark:border-slate-800"><button onClick={logout} role="menuitem" className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"><LogOut size={16} /> Keluar</button></div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:border-brand hover:text-brand-deep dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"><LogIn size={16} /> <span className="hidden sm:inline">Masuk</span></Link>
          )}

          <Link to="/safety" className="inline-flex items-center gap-1.5 rounded-full border border-rose-300/60 bg-white px-3 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-50 dark:border-rose-500/40 dark:bg-transparent dark:text-rose-400 dark:hover:bg-rose-500/10">
            <Siren size={14} /><span className="hidden sm:inline">Bantuan darurat</span><span className="sm:hidden">Darurat</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
