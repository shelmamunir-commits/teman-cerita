import { cn } from '../../lib/cn'

const variants = {
  primary:
    'bg-brand text-white hover:bg-brand-bright px-6 py-3 text-sm font-semibold rounded-full shadow-sm',
  secondary:
    'bg-white dark:bg-slate-800 text-brand-deep dark:text-brand border border-slate-200 dark:border-slate-700 hover:border-brand dark:hover:border-brand px-6 py-3 text-sm font-semibold rounded-full',
  white:
    'bg-white text-brand-deep hover:bg-brand-soft px-6 py-3 text-sm font-semibold rounded-full',
  ghost: 'bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 px-4 py-2 text-sm rounded-full',
}

export default function Button({ as: Component = 'button', variant = 'primary', className, children, ...props }) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]'
  return (
    <Component className={cn(base, variants[variant], className)} {...props}>
      {children}
    </Component>
  )
}
