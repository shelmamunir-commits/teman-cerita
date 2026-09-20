import { cn } from '../../lib/cn'

export default function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'bg-gradient-to-br from-white/95 to-emerald-50/75 dark:from-slate-800/75 dark:to-emerald-950/25 border border-emerald-100/90 dark:border-emerald-900/60 rounded-xl p-6 shadow-[0_8px_30px_rgba(18,143,138,0.035)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
