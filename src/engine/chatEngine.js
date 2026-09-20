// Asisten percakapan berbasis aturan. Respons sengaja tidak membuat diagnosis.
const CRISIS_KEYWORDS = [
  'bunuh diri', 'akhiri hidup', 'mengakhiri hidup', 'menyakiti diri', 'nyakitin diri',
  'self harm', 'self-harm', 'mau mati', 'ingin mati', 'pengen mati', 'mati aja',
  'ga mau hidup', 'gak mau hidup', 'nggak mau hidup', 'tidak mau hidup',
  'hidup tidak berguna', 'hidup nggak berguna', 'gak kuat hidup', 'tidak berharga hidup',
  'melukai diri', 'sayat diri', 'overdosis', 'gantung diri', 'loncat dari',
]

function normalize(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function matchAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword))
}

export function detectCrisis(text) {
  return matchAny(normalize(text), CRISIS_KEYWORDS)
}

const reply = (text, actions = []) => ({ text, actions })

export function chatReply(userText, context = {}) {
  const t = normalize(userText)

  if (detectCrisis(t)) {
    return {
      crisis: true,
      text: 'Terima kasih sudah cerita. Keselamatanmu yang utama. Tolong jangan sendirian: dekati orang dewasa yang kamu percaya, jauhkan benda yang bisa dipakai untuk menyakiti diri, lalu hubungi bantuan sekarang. Aku bisa menemani lewat petunjuk, tetapi aku tidak bisa menggantikan bantuan manusia.',
      actions: [
        { label: 'Buka langkah darurat', to: '/safety' },
        { label: 'Healing119.id', href: 'https://www.healing119.id/' },
        { label: 'Telepon 119', href: 'tel:119' },
      ],
    }
  }

  const isGreeting = ['halo', 'hai', 'hi', 'hey', 'assalamu', 'tes', 'test']
    .some((word) => t === word || t.startsWith(`${word} `))
  if (isGreeting) {
    return reply(
      'Halo! Aku Teman Cerita, asisten virtual dari Pesma Nur Alannur. Kamu boleh cerita dengan bahasamu sendiri. Aku akan membantu merapikan apa yang kamu rasakan dan menawarkan langkah kecil yang aman.',
      [
        { label: 'Aku sedang cemas', reply: 'Aku sedang cemas dan ingin ditenangkan' },
        { label: 'Pikiranku penuh', reply: 'Pikiranku penuh karena banyak masalah' },
        { label: 'Aku ingin didengar', reply: 'Aku ingin cerita dan didengar dulu' },
      ],
    )
  }

  if (matchAny(t, ['hasil', 'skor', 'skrining', 'artinya apa', 'kode', 'phq'])) {
    if (context.category) {
      const label = { low: 'rendah', mid: 'sedang', high: 'tinggi' }[context.category]
      return reply(
        `Hasil skriningmu berada pada kategori ${label}. Itu bukan diagnosis, melainkan petunjuk awal tentang sinyal yang perlu diperhatikan. Kita bisa melihat detailnya atau menyusun langkah yang sesuai dengan masalahmu sekarang.`,
        [
          { label: 'Lihat hasil lengkap', to: '/understand' },
          { label: 'Susun jalur personal', to: '/personalize' },
          { label: 'Apa langkah pertama?', reply: 'Aku ingin memilih satu prioritas sekarang' },
        ],
      )
    }
    return reply('Kamu belum memiliki hasil skrining aktif. Kamu bisa memasukkan kode CKG atau mengisi skrining mandiri terlebih dahulu.', [
      { label: 'Masukkan kode CKG', to: '/result' },
      { label: 'Skrining mandiri', to: '/screening' },
    ])
  }

  if (matchAny(t, ['membedakan fakta', 'fakta dan kekhawatiran', 'bedah kekhawatiran'])) {
    return reply(
      'Gunakan tiga baris ini: (1) Fakta yang benar-benar aku tahu…, (2) Hal yang aku takutkan tetapi belum tentu terjadi…, (3) Langkah kecil yang bisa kulakukan hari ini…. Tulis satu kalimat untuk tiap baris; fokus pada bukti, bukan kemungkinan terburuk.',
      [
        { label: 'Aku mau menuliskannya', to: '/jurnal' },
        { label: 'Tubuhku masih tegang', to: '/breathing' },
      ],
    )
  }

  if (matchAny(t, ['memecah tugas', 'buat langkah kecil', 'bikin langkah kecil'])) {
    return reply(
      'Sebutkan satu tugas dan tenggat waktunya. Sambil menunggu, pakai pola ini: buka bahan → tulis target paling kecil → kerjakan 10 menit → berhenti untuk mengecek progres → lanjut satu sesi lagi bila mampu. Jangan mulai dari target “selesai semua”.',
      [
        { label: 'Atur napas sebelum mulai', to: '/breathing' },
        { label: 'Baca strategi stres', to: '/articles/mengenal-stres' },
      ],
    )
  }

  if (matchAny(t, ['menyusun pesan', 'membuat pesan', 'mulai percakapan', 'memulai percakapan', 'kalimat asertif'])) {
    return reply(
      'Kamu bisa memakai pola: “Aku ingin cerita tentang sesuatu. Aku merasa … ketika … . Aku membutuhkan … . Apakah kamu punya waktu untuk mendengarkan?” Untuk situasi tidak aman, jangan menghadapi pelaku sendirian—kirim pesan kepada orang dewasa tepercaya dan sebutkan bantuan konkret yang kamu butuhkan.',
      [
        { label: 'Panduan bantu teman', to: '/bantu-teman' },
        { label: 'Cari pendamping profesional', to: '/help' },
      ],
    )
  }

  if (matchAny(t, ['sedikit lebih tenang', 'sudah grounding'])) {
    return reply('Bagus, pertahankan tempo pelan itu. Sekarang pilih satu kebutuhan paling dasar: minum, duduk di tempat aman, mengendurkan bahu, atau menghubungi seseorang. Tidak perlu menyelesaikan semua masalah sekaligus.', [
      { label: 'Tulis yang kurasakan', to: '/jurnal' },
      { label: 'Lanjut meditasi', to: '/meditasi' },
    ])
  }

  if (matchAny(t, ['masih terasa berat', 'masih berat'])) {
    return reply('Terima kasih sudah mencoba. Kalau latihan mandiri belum cukup, jangan memaksakan diri. Dekati orang yang aman dan katakan, “Aku sedang tidak baik-baik saja dan butuh ditemani.” Jika keselamatanmu terancam, buka bantuan darurat.', [
      { label: 'Cari bantuan', to: '/help' },
      { label: 'Bantuan darurat', to: '/safety' },
    ])
  }

  if (matchAny(t, ['langkah konkret', 'langkah pertama', 'memilih satu prioritas'])) {
    return reply('Kita mulai dari satu area agar tidak terasa terlalu besar. Mana yang paling mendesak sekarang?', [
      { label: 'Sekolah atau tugas', reply: 'Masalah paling mendesak adalah tugas sekolah' },
      { label: 'Emosi atau kecemasan', reply: 'Masalah paling mendesak adalah emosi dan kecemasan' },
      { label: 'Hubungan dengan orang lain', reply: 'Masalah paling mendesak adalah hubungan dengan orang lain' },
    ])
  }

  if (matchAny(t, ['panik', 'sesak', 'jantung berdebar', 'deg degan', 'gemetar'])) {
    return reply(
      'Kita turunkan intensitasnya dulu. Letakkan kedua kaki di lantai, lihat satu benda di dekatmu, lalu hembuskan napas lebih panjang daripada saat menariknya. Jika sesak atau nyeri terasa berat, baru, atau mengkhawatirkan, minta pertolongan medis.',
      [
        { label: 'Pandu napas sekarang', to: '/breathing' },
        { label: 'Coba grounding', reply: 'Pandu aku melakukan grounding 5-4-3-2-1' },
        { label: 'Cari bantuan', to: '/help' },
      ],
    )
  }

  if (matchAny(t, ['grounding', '5-4-3-2-1', '54321'])) {
    return reply(
      'Ayo lakukan perlahan: sebutkan 5 hal yang kamu lihat, 4 yang bisa disentuh, 3 suara yang terdengar, 2 aroma yang tercium, dan 1 rasa di mulut. Tidak perlu sempurna—tujuannya membawa perhatian kembali ke saat ini.',
      [
        { label: 'Sedikit lebih tenang', reply: 'Aku sudah grounding dan sedikit lebih tenang' },
        { label: 'Masih terasa berat', reply: 'Aku sudah mencoba tapi masih terasa berat' },
      ],
    )
  }

  if (matchAny(t, ['cemas', 'khawatir', 'anxiety', 'gelisah', 'overthinking', 'takut'])) {
    return reply(
      'Kedengarannya pikiranmu sedang bekerja keras untuk mengantisipasi banyak hal. Coba pisahkan: apa yang benar-benar terjadi sekarang, apa yang masih berupa dugaan, dan satu hal kecil yang bisa kamu kendalikan hari ini?',
      [
        { label: 'Tenangkan tubuh dulu', to: '/breathing' },
        { label: 'Bedah kekhawatiranku', reply: 'Bantu aku membedakan fakta dan kekhawatiran' },
        { label: 'Skrining kecemasan', to: '/quiz/anxiety' },
      ],
    )
  }

  if (matchAny(t, ['sedih', 'hampa', 'depresi', 'mood', 'kosong', 'down', 'tidak semangat', 'gak semangat', 'males'])) {
    return reply(
      'Aku dengar kamu sedang merasa berat. Kamu tidak harus langsung membaik hari ini. Pilih satu langkah yang paling ringan: minum air, membuka jendela, mandi, atau menghubungi satu orang yang aman. Kalau perasaan ini menetap atau mengganggu aktivitas, bantuan profesional layak dipertimbangkan.',
      [
        { label: 'Catat perasaanku', to: '/jurnal' },
        { label: 'Aktivitas 5 menit', to: '/articles/memahami-mood' },
        { label: 'Cari teman bicara', to: '/help' },
      ],
    )
  }

  if (matchAny(t, ['tidur', 'insomnia', 'begadang', 'ngantuk', 'mimpi buruk', 'kebangun'])) {
    return reply(
      'Tidur yang terganggu bisa membuat emosi terasa lebih berat. Untuk malam ini, pilih satu perubahan kecil: redupkan layar 30–60 menit sebelum tidur, tulis pikiran yang berputar, dan pertahankan waktu bangun yang sama besok pagi.',
      [
        { label: 'Meditasi untuk tidur', to: '/meditasi' },
        { label: 'Panduan tidur', to: '/articles/tidur-yang-baik' },
        { label: 'Skrining pola tidur', to: '/quiz/sleep' },
      ],
    )
  }

  if (matchAny(t, ['tugas', 'ujian', 'nilai', 'sekolah', 'kuliah', 'skripsi', 'belajar', 'deadline', 'menunda', 'prokrastinasi'])) {
    return reply(
      'Beban belajar sering terasa seperti satu tumpukan besar. Tulis semua tugas, pilih satu yang paling dekat tenggatnya, lalu kecilkan menjadi pekerjaan 10–20 menit. Target pertamamu cukup “mulai”, bukan langsung selesai.',
      [
        { label: 'Buat langkah kecil', reply: 'Bantu aku memecah tugas menjadi langkah kecil' },
        { label: 'Skrining beban belajar', to: '/quiz/academic' },
        { label: 'Kelola stres', to: '/articles/mengenal-stres' },
      ],
    )
  }

  if (matchAny(t, ['stres', 'stress', 'tekanan', 'capek', 'lelah', 'kewalahan', 'burnout', 'penuh'])) {
    return reply(
      'Saat semuanya terasa menumpuk, otak sulit menentukan mana yang harus didahulukan. Berhenti sebentar, tulis tiga beban terbesar, lalu tandai mana yang bisa ditunda, didelegasikan, atau dikerjakan 10 menit sekarang.',
      [
        { label: 'Latihan menenangkan diri', to: '/breathing' },
        { label: 'Skrining stres', to: '/quiz/stress' },
        { label: 'Aku ingin cerita dulu', reply: 'Aku belum butuh solusi, aku ingin didengar dulu' },
      ],
    )
  }

  if (matchAny(t, ['bully', 'dibully', 'perundungan', 'diejek', 'dikucilkan', 'diancam'])) {
    return reply(
      'Perundungan bukan salahmu dan kamu tidak perlu menanganinya sendirian. Simpan bukti bila aman, hindari membalas saat situasi berbahaya, lalu ceritakan kepada orang dewasa tepercaya seperti pengasuh, guru, wali kelas, atau konselor.',
      [
        { label: 'Bantu susun kalimat', reply: 'Bantu aku menyusun pesan untuk orang dewasa tentang perundungan' },
        { label: 'Cari bantuan', to: '/help' },
        { label: 'Situasiku darurat', to: '/safety' },
      ],
    )
  }

  if (matchAny(t, ['sendiri', 'kesepian', 'tidak punya teman', 'gak punya teman', 'dijauhi', 'putus', 'ditolak'])) {
    return reply(
      'Merasa sendirian atau ditolak bisa sangat menyakitkan. Kamu tidak perlu memaksa diri langsung bersosialisasi besar-besaran—coba hubungi satu orang yang relatif aman dengan pesan sederhana seperti, “Kamu sempat ngobrol sebentar?”',
      [
        { label: 'Bantu susun pesan', reply: 'Bantu aku membuat pesan untuk mengajak seseorang ngobrol' },
        { label: 'Cari konselor', to: '/help' },
      ],
    )
  }

  if (matchAny(t, ['marah', 'emosi', 'kesal', 'benci', 'jengkel'])) {
    return reply(
      'Marah adalah sinyal bahwa ada batas atau kebutuhan yang terganggu. Sebelum merespons, ambil jeda, longgarkan rahang dan bahu, lalu tulis: “Aku merasa … ketika … dan aku membutuhkan …”.',
      [
        { label: 'Tenangkan diri', to: '/breathing' },
        { label: 'Susun kalimat asertif', reply: 'Bantu aku menyampaikan rasa marah secara asertif' },
      ],
    )
  }

  if (matchAny(t, ['keluarga', 'orang tua', 'ayah', 'ibu', 'rumah', 'bertengkar'])) {
    return reply(
      'Masalah di rumah bisa membuatmu merasa tidak punya ruang untuk beristirahat. Pilih waktu yang relatif tenang dan satu orang yang paling aman untuk diajak bicara. Jika ada kekerasan atau ancaman keselamatan, utamakan menjauh ke tempat aman dan hubungi bantuan.',
      [
        { label: 'Mulai percakapan', reply: 'Bantu aku memulai percakapan dengan keluarga' },
        { label: 'Ada ancaman keselamatan', to: '/safety' },
        { label: 'Cari pendamping', to: '/help' },
      ],
    )
  }

  if (matchAny(t, ['duka', 'kehilangan', 'meninggal', 'berkabung', 'kangen'])) {
    return reply(
      'Kehilangan tidak punya jadwal pemulihan yang sama untuk semua orang. Kamu boleh sedih, marah, bingung, atau mati rasa. Hari ini, cobalah menghubungi orang yang memahami situasimu atau menulis satu kenangan yang ingin kamu simpan.',
      [
        { label: 'Tulis di jurnal', to: '/jurnal' },
        { label: 'Aku ingin didengar', reply: 'Aku ingin cerita tentang kehilangan ini' },
        { label: 'Cari bantuan', to: '/help' },
      ],
    )
  }

  if (matchAny(t, ['meditasi', 'relaks', 'rileks', 'tenang', 'relaksasi', 'napas', 'breathing'])) {
    return reply('Kita bisa membantu tubuh merasa lebih aman lewat napas atau meditasi terpandu. Pilih yang terasa paling ringan sekarang.', [
      { label: 'Latihan napas cepat', to: '/breathing' },
      { label: 'Meditasi terpandu', to: '/meditasi' },
    ])
  }

  if (matchAny(t, ['bantuan', 'psikolog', 'konselor', 'konseling', 'guru bk', 'dokter', 'terapi'])) {
    return reply('Mencari bantuan adalah langkah yang wajar. Kamu bisa mulai dari orang dewasa tepercaya, pengasuh Pesma, guru BK, puskesmas, psikolog, atau Healing119.id untuk dukungan awal.', [
      { label: 'Lihat jalur bantuan', to: '/help' },
      { label: 'Buka Healing119.id', href: 'https://www.healing119.id/' },
    ])
  }

  if (matchAny(t, ['teman', 'sahabat', 'khawatir sama teman', 'nemenin'])) {
    return reply('Untuk membantu teman, dengarkan tanpa menghakimi dan jangan menjanjikan rahasia jika keselamatannya terancam. Libatkan orang dewasa atau tenaga profesional ketika situasinya berat.', [
      { label: 'Panduan membantu teman', to: '/bantu-teman' },
      { label: 'Tanda kondisi darurat', to: '/safety' },
    ])
  }

  if (matchAny(t, ['didengar', 'cerita dulu', 'belum butuh solusi'])) {
    return reply('Aku mendengarkan. Kamu bisa mulai dari bagian yang paling mengganggu pikiranmu hari ini—apa yang terjadi, dan bagian mana yang terasa paling berat?', [
      { label: 'Tentang sekolah', reply: 'Yang paling berat berkaitan dengan sekolah' },
      { label: 'Tentang hubungan', reply: 'Yang paling berat berkaitan dengan orang lain' },
      { label: 'Sulit menjelaskannya', reply: 'Aku sulit menjelaskan apa yang kurasakan' },
    ])
  }

  return reply(
    'Aku menangkap bahwa ini penting buatmu, meski aku belum cukup memahami detailnya. Ceritakan satu hal: apa yang terjadi, sejak kapan terasa, dan apa yang paling kamu butuhkan sekarang—didengar, ditenangkan, atau mencari langkah konkret?',
    [
      { label: 'Aku ingin didengar', reply: 'Aku ingin didengar dulu tanpa diberi solusi' },
      { label: 'Bantu aku tenang', reply: 'Aku ingin menenangkan tubuh dan pikiran' },
      { label: 'Cari langkah konkret', reply: 'Aku ingin langkah konkret untuk masalahku' },
    ],
  )
}
