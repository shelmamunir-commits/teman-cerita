import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Trash2, AArrowDown, AArrowUp, Moon } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import SectionLabel from '../components/ui/SectionLabel.jsx'
import Toggle from '../components/ui/Toggle.jsx'
import Modal from '../components/ui/Modal.jsx'
import { useSettings } from '../context/SettingsContext.jsx'
import { useTheme } from '../theme/ThemeProvider.jsx'

export default function Settings() {
  const { reduceMotion, setReduceMotion, fontScale, setFontScale, consent, setConsent, reminder, setReminder, clearAllData } = useSettings()
  const { theme, toggle } = useTheme()
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Pengaturan</h1>
      <p className="mt-2 text-[14.5px] text-slate-500 dark:text-slate-400">Kelola preferensi tampilan, privasi, dan datamu.</p>

      <Card className="mt-6">
        <SectionLabel>Aksesibilitas</SectionLabel>
        <div className="space-y-5">
          <Toggle checked={reduceMotion} onChange={setReduceMotion} label="Kurangi animasi" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-700 dark:text-slate-300">Ukuran teks</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFontScale((s) => Math.max(0.85, s - 0.05))}
                className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:border-brand"
                aria-label="Perkecil teks"
              >
                <AArrowDown size={16} />
              </button>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300 w-10 text-center">
                {Math.round(fontScale * 100)}%
              </span>
              <button
                onClick={() => setFontScale((s) => Math.min(1.3, s + 0.05))}
                className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:border-brand"
                aria-label="Perbesar teks"
              >
                <AArrowUp size={16} />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-700 dark:text-slate-300 inline-flex items-center gap-2">
              <Moon size={15} /> Mode gelap
            </span>
            <Toggle checked={theme === 'dark'} onChange={toggle} />
          </div>
        </div>
      </Card>

      <Card className="mt-4">
        <SectionLabel>Notifikasi</SectionLabel>
        <Toggle checked={reminder} onChange={setReminder} label="Ingatkan check-in harian di beranda" />
      </Card>

      <Card className="mt-4">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-emerald-500" />
          <span className="font-bold text-slate-900 dark:text-white">Privasi &amp; data</span>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
          Hasil skrining, mood, jurnal, dan percakapan tersimpan di perangkat ini (localStorage). Peta memakai layanan
          Google Maps; lokasi presisi hanya digunakan setelah kamu memberi izin.
        </p>
        <div className="mt-4 space-y-3">
          <Toggle
            checked={consent}
            onChange={setConsent}
            label="Saya telah membaca dan menyetujui disclaimer"
          />
          <Button variant="secondary" onClick={() => setConfirmOpen(true)}>
            <Trash2 size={15} /> Hapus semua data
          </Button>
        </div>
      </Card>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Hapus semua data?">
        <p className="text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-300">
          Tindakan ini akan menghapus semua data yang tersimpan di perangkat ini — termasuk mood, jurnal, hasil
          skrining, dan pengaturan. Tindakan ini tidak bisa dibatalkan.
        </p>
        <div className="mt-5 flex gap-3">
          <Button onClick={clearAllData} className="flex-1" variant="secondary">
            Ya, hapus semuanya
          </Button>
          <Button onClick={() => setConfirmOpen(false)} className="flex-1">
            Batal
          </Button>
        </div>
      </Modal>
    </motion.div>
  )
}
