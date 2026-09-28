import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Database, HardDrive, MapPin, MessageCircle, ShieldCheck } from 'lucide-react'
import Card from '../components/ui/Card.jsx'

const ITEMS = [
  {
    icon: Database,
    title: 'Data akun dan skrining',
    text: 'ID pengguna, nama, kelas, role, status akun, serta ringkasan hasil skrining disimpan di server Pesma. Santri hanya dapat melihat data miliknya; Admin melihat ringkasan Pesma; Sysadmin mengelola akun dan hak akses.',
  },
  {
    icon: HardDrive,
    title: 'Data pribadi di perangkat',
    text: 'Mood, jurnal, percakapan asisten, dan progres aktivitas tersimpan di browser serta dipisahkan untuk setiap akun. Pada perangkat bersama, selalu keluar dari akun dan gunakan menu Hapus data perangkat bila diperlukan.',
  },
  {
    icon: MapPin,
    title: 'Lokasi dan peta',
    text: 'Lokasi presisi hanya diminta setelah kamu memilih Gunakan lokasiku. Peta menggunakan Google Maps, sehingga penggunaan peta mengikuti ketentuan privasi Google.',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    text: 'Tombol kontak membuka WhatsApp dengan pesan awal yang telah disiapkan. Teman Cerita tidak mengirim isi jurnal, skrining, atau percakapan secara otomatis ke WhatsApp.',
  },
]

export default function Privacy() {
  return (
    <motion.div className="mx-auto max-w-4xl" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"><ShieldCheck /></span>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Privasi dan penggunaan data</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">Ringkasan tentang data yang digunakan Teman Cerita dan siapa yang dapat mengaksesnya.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {ITEMS.map((item) => (
          <Card key={item.title}>
            <item.icon size={20} className="text-brand" />
            <h2 className="mt-3 font-bold text-slate-900 dark:text-white">{item.title}</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">{item.text}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-4">
        <h2 className="font-bold text-slate-900 dark:text-white">Kendali atas data</h2>
        <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">
          <li>• Data yang tersimpan di browser dapat dihapus melalui halaman Pengaturan.</li>
          <li>• Perbaikan profil, perubahan akses, reset sandi, atau permintaan terkait data server dilakukan melalui Sysadmin Pesma.</li>
          <li>• Data server dipertahankan sesuai kebutuhan layanan dan kebijakan pengelolaan Pesma Nur Alannur.</li>
        </ul>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/pengaturan" className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-deep">Buka pengaturan</Link>
          <Link to="/help" className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 hover:border-brand dark:border-slate-700 dark:text-slate-200">Hubungi pendamping</Link>
        </div>
      </Card>

      <p className="mt-5 text-xs text-slate-400">Terakhir diperbarui: 21 September 2026.</p>
    </motion.div>
  )
}
