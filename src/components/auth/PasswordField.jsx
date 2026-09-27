import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function PasswordField({ label = 'Sandi', value, onChange, autoComplete, placeholder, onCapsLock, autoFocus = false }) {
  const [visible, setVisible] = useState(false)
  return (
    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
      {label}
      <span className="relative mt-2 block">
        <input
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          value={value}
          onChange={onChange}
          onKeyUp={(event) => onCapsLock?.(event.getModifierState('CapsLock'))}
          onKeyDown={(event) => onCapsLock?.(event.getModifierState('CapsLock'))}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 font-normal outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-900"
        />
        <button type="button" onClick={() => setVisible((current) => !current)} aria-label={visible ? 'Sembunyikan sandi' : 'Tampilkan sandi'} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800">
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </span>
    </label>
  )
}
