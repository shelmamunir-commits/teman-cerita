# Teman Cerita

Ruang aman dari Pesma Nur Alannur untuk memahami hasil skrining kesehatan (CKG), merawat diri melalui psikoedukasi personal dan aktivitas sederhana, serta menemukan arah bantuan yang tepat.

Website publik: [temanceritanura.web.id](https://temanceritanura.web.id/)

© Teman Cerita · Pesma Nur Alannur — dikembangkan oleh **Prof. Dr. Mutimmatul Faidah, M.Ag.**, **Shelma Nasywa Ramadhani Munir**, **Mahla Zayani**, dan **Ahmad Zainul Khofi**.

## Stack

- **React 18** (JavaScript/JSX)
- **Vite** — build & dev server
- **Tailwind CSS v4** — styling + dark mode
- **React Router** — routing (hash-based, siap deploy ke GitHub Pages)
- **Framer Motion** — animasi
- **Recharts** — radar & trend chart
- **lucide-react** — ikon
- **Supabase** — autentikasi, profil, RBAC, RLS, dan ringkasan skrining
- **localStorage** — penyimpanan di perangkat yang dipisahkan per akun (mood, jurnal, chat, tema, progres)

## Menjalankan

```bash
npm install
npm run dev       # mode development
npm run build     # produksi (output ke dist/)
npm run preview   # pratinjau hasil build
```

## Menyiapkan akun dan database

1. Buat proyek Supabase dan nonaktifkan pendaftaran pengguna mandiri.
2. Jalankan seluruh migration di `supabase/migrations/` secara berurutan.
3. Deploy Edge Functions `change-password`, `admin-api`, dan `bootstrap-sysadmin`.
4. Atur secret `BOOTSTRAP_SECRET` pada Edge Functions.
5. Salin `.env.example` ke `.env.local`, lalu isi Project URL dan publishable key Supabase. Variabel lama `VITE_SUPABASE_ANON_KEY` tetap didukung untuk kompatibilitas.
6. Panggil `bootstrap-sysadmin` sekali dengan header `x-bootstrap-secret` dan JSON berikut:

```json
{
  "login_id": "sysadmin",
  "full_name": "Nama Pengelola"
}
```

Endpoint akan mengembalikan sandi sementara satu kali. Login memakai ID tersebut lalu ganti sandi. Setelah akun pertama tersedia, akun lain dan impor CSV dikelola dari halaman `/sysadmin`.

Format CSV impor:

```csv
id_santri,nama_lengkap,kelas,alamat,tanggal_lahir,kampus,semester,program_studi,nama_orang_tua_wali,hubungan_orang_tua_wali,no_hp_orang_tua_wali,role
SNT-001,Nama Santri,Kelas A,Alamat lengkap,2005-01-31,Nama Kampus,3,Program Studi,Nama Wali,Ibu,081234567890,Santri
```

Hanya `id_santri` dan `nama_lengkap` yang wajib saat impor. Data lainnya dapat dilengkapi oleh santri setelah login.

`SUPABASE_SERVICE_ROLE_KEY` hanya digunakan otomatis di lingkungan Edge Functions dan tidak boleh dimasukkan ke `.env.local` atau frontend.

## Deploy ke GitHub Pages

Tambahkan repository secrets berikut di **Settings → Secrets and variables → Actions**:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Jika proyek masih memakai anon key lama, isi `VITE_SUPABASE_ANON_KEY` sebagai pengganti publishable key. Workflow tidak pernah membutuhkan `SUPABASE_SERVICE_ROLE_KEY`.

Sebelum deploy, jalankan:

```bash
npm audit --omit=dev
npm run build
npm run preview
```

## Struktur

```
src/
├── main.jsx              # entry + providers
├── App.jsx               # routes + layout
├── index.css             # Tailwind + design tokens
├── lib/                  # utilitas (cn, storage, constants)
├── data/                 # domain, kode CKG, modul, jalur, bantuan, dashboard
├── engine/               # rule-based analyzer & pathway engine
├── context/              # App, Mood, Journal, Theme
├── hooks/                # useLocalStorage, useTypewriter
├── components/
│   ├── ui/               # Button, Card, Badge, SectionLabel
│   ├── layout/           # Topbar, Footer, Layout, StepsBar
│   ├── charts/           # DomainRadar, DomainBars, MoodTrendChart
│   ├── breathing/        # BreathingGuide
│   └── mood/             # MoodPicker, MoodCalendar
└── pages/                # 12 halaman aplikasi
```

## Fitur

1. **My CKG Result** — input kode hasil skrining
2. **Understand My Result** — penjelasan berbasis aturan (streaming) + radar chart
3. **My Mental Health Pathway** — jalur personal (wizard multi-langkah)
4. **What Can I Do?** — modul psikoedukasi + aktivitas 5 menit
5. **Where Can I Get Help?** — tangga rujukan + hotline
6. **Safety Protocol** — halaman darurat (tanpa psikoedukasi)
7. **Mood tracker + kalender** — tren mood tersimpan
8. **Jurnal harian** — syukur, jadwal, catatan, riwayat
9. **Latihan napas interaktif** — animasi 4-7-8
10. **Dashboard Pesma** — ringkasan skrining baca-saja untuk Admin
11. **Manajemen akun & role** — halaman Sysadmin, RBAC, dan impor CSV
12. **Data Santri** — profil diri, akademik, dan orang tua/wali untuk Ustadzah, Admin, dan Sysadmin
13. **Dark mode**
