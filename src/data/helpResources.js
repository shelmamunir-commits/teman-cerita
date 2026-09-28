export const HELP_LADDER = [
  { t: 'Pengasuh / pendamping Pesma', d: 'Langkah pertama yang paling mudah dan dekat. Bisa mengobrol saat ada waktu luang di Pesma.', tag: 'Paling dekat' },
  { t: 'Puskesmas terdekat', d: 'Layanan kesehatan dasar. Bisa bantu menilai dan merujuk ke layanan yang tepat.', tag: 'Rujukan awal' },
  { t: 'Psikolog / tenaga profesional', d: 'Penanganan lebih lanjut buat keluhan yang menetap atau mengganggu.', tag: 'Lebih mendalam' },
  { t: 'Healing119.id / 119 ext. 8', d: 'Dukungan emosional dan pertolongan pertama psikologis dari Kementerian Kesehatan melalui panggilan atau chat.', tag: 'Gratis' },
]

export const HOTLINE = {
  number: '119 ext. 8',
  desc: 'Healing119.id · dukungan psikologis awal Kementerian Kesehatan',
  url: 'https://www.healing119.id/',
}

const WHATSAPP_MESSAGE = encodeURIComponent("Assalamu'alaikum, saya menghubungi melalui aplikasi Teman Cerita dan membutuhkan bantuan.")

export const SCHOOL_HELP_CONTACTS = [
  {
    name: "Ustadzah Ma'rufah",
    number: '+62 857-0692-2188',
    url: `https://wa.me/6285706922188?text=${WHATSAPP_MESSAGE}`,
  },
  {
    name: 'Kak Caca',
    number: '+62 895-3781-96107',
    url: `https://wa.me/62895378196107?text=${WHATSAPP_MESSAGE}`,
  },
]

export const EMERGENCY_CONTACTS = [
  {
    id: 'kak-caca',
    name: 'Kak Caca',
    role: 'Pendamping Pesma',
    detail: '+62 895-3781-96107',
    url: `https://wa.me/62895378196107?text=${WHATSAPP_MESSAGE}`,
    action: 'WhatsApp',
    kind: 'whatsapp',
    external: true,
  },
  {
    id: 'ambulan',
    name: 'Ambulan',
    role: 'Gawat darurat medis',
    detail: '119',
    url: 'tel:119',
    action: 'Telepon 119',
    kind: 'phone',
  },
  {
    id: 'satgas-ppk-unesa',
    name: 'Pelaporan Satgas PPK UNESA',
    role: 'Formulir pelaporan resmi',
    detail: 'Google Forms',
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSd8CheSYJP7xyuQxIZTF3pOoJwCbhGGryn0G_cnKYwOMvg5nw/viewform?fbclid=PAAaaMds9C0xeGTIdpchuESieKmqDcdWLPjbXRKXdT6moVYNbZLWt1PwC0-9U&pli=1',
    action: 'Buka formulir',
    kind: 'form',
    external: true,
  },
  {
    id: 'mitigasi-crisis-center-unesa',
    name: 'Subdirektorat Mitigasi Crisis Center UNESA',
    role: 'Layanan kesehatan mental UNESA',
    detail: '+62 812-2611-7729',
    url: `https://wa.me/6281226117729?text=${WHATSAPP_MESSAGE}`,
    action: 'WhatsApp',
    kind: 'whatsapp',
    external: true,
  },
]

export const EMERGENCY_NUMBERS = [
  { number: '112', label: 'Darurat terpadu', desc: 'Tersedia di wilayah yang sudah menerapkan layanan 112' },
  { number: '110', label: 'Kepolisian', desc: 'Ancaman keselamatan / tindak kriminal' },
  { number: '119', label: 'Ambulans', desc: 'Gawat darurat medis' },
  { number: '129', label: 'KemenPPPA', desc: 'SAPA129 · perlindungan anak & perempuan' },
]

export const EMERGENCY_STEPS = [
  'Hubungi Kak Caca sebagai Pendamping Pesma jika kamu membutuhkan bantuan dan pendampingan.',
  'Untuk kegawatdaruratan medis, segera hubungi Ambulan melalui 119.',
  'Untuk pelaporan kekerasan, buka formulir Pelaporan Satgas PPK UNESA.',
  'Jangan tinggal sendirian — minta seseorang menemani sampai bantuan tiba.',
]
