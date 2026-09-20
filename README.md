# Teman Cerita

Ruang aman dari Pesma Nur Alannur untuk memahami hasil skrining kesehatan (CKG), merawat diri melalui psikoedukasi personal dan aktivitas sederhana, serta menemukan arah bantuan yang tepat.

Website publik: [shelmamunir-commits.github.io/teman-cerita](https://shelmamunir-commits.github.io/teman-cerita/)

> **Disclaimer:** Prototipe konsep. Seluruh "AI" disimulasikan lewat rule engine di frontend — bukan model terlatih, bukan alat diagnosis, dan bukan pengganti psikolog/tenaga kesehatan.

© Teman Cerita · Pesma Nur Alannur — dikembangkan oleh **Shelma Nasywa Ramadhani Munir** dan **Ahmad Zainul Khofi**.

## Stack

- **React 18** (JavaScript/JSX)
- **Vite** — build & dev server
- **Tailwind CSS v4** — styling + dark mode
- **React Router** — routing (hash-based, siap deploy ke GitHub Pages)
- **Framer Motion** — animasi
- **Recharts** — radar & trend chart
- **lucide-react** — ikon
- **localStorage** — penyimpanan data (mood, jurnal, tema, progres)

## Menjalankan

```bash
npm install
npm run dev       # mode development
npm run build     # produksi (output ke dist/)
npm run preview   # pratinjau hasil build
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
10. **Dashboard psikolog/guru** — simulasi kasus prioritas
11. **Dark mode**
