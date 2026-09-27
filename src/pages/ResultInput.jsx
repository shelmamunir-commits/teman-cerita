import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import SectionLabel from '../components/ui/SectionLabel.jsx'
import { useApp } from '../context/AppContext.jsx'
import { CKG_CODES } from '../data/ckgCodes.js'

export default function ResultInput() {
  const { name, setName, submitResult } = useApp()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (busy) return
    const value = code.trim().toUpperCase()
    if (!CKG_CODES[value]) {
      setError('Kode tidak dikenali. Periksa kembali penulisannya atau hubungi pengelola.')
      return
    }
    try {
      setBusy(true)
      const ok = await submitResult(value)
      if (ok) navigate('/understand')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h1 className="text-2xl sm:text-3xl font-display text-slate-800 dark:text-slate-100">
        Masukkan hasil skriningmu
      </h1>
      <p className="mt-2 text-[14.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
        Ketik kode hasil CKG yang diberikan oleh petugas atau pengelola Pesma.
      </p>

      <form onSubmit={submit}>
        <Card className="mt-6">
          <SectionLabel>Nama panggilan (opsional)</SectionLabel>
          <input
            type="text"
            aria-label="Nama panggilan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="mis. Raka"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
          />

          <div className="mt-5">
            <SectionLabel>Kode hasil CKG</SectionLabel>
            <input
              type="text"
              aria-label="Kode hasil CKG"
              value={code}
              onChange={(e) => {
                setCode(e.target.value)
                setError('')
              }}
              placeholder="MH-S2"
              maxLength={10}
              className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-4 text-center text-xl font-extrabold tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
            />
            <div className="h-5 mt-1.5 text-xs font-semibold text-rose-500">{error}</div>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-slate-400">Kode tidak ditampilkan di aplikasi untuk menjaga keakuratan hasil dan mencegah pemilihan kategori secara mandiri.</p>
        </Card>

        <div className="mt-6">
          <Button type="submit" disabled={busy || !code.trim()}>
            {busy ? 'Menyimpan…' : 'Analisis hasilku'} <ArrowRight size={16} />
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
