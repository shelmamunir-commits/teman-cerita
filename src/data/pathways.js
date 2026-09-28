export const MAIN_PROBLEMS = [
  { id: 'academic', label: 'Akademik / tugas kuliah', ico: '📚', desc: 'Ujian, tugas numpuk, takut gagal' },
  { id: 'social', label: 'Pertemanan / pergaulan', ico: '🤝', desc: 'Konflik, merasa dijauhi, canggung' },
  { id: 'anxiety', label: 'Rasa cemas / khawatir', ico: '💭', desc: 'Pikiran yang muter terus' },
  { id: 'sleep', label: 'Tidur / pola istirahat', ico: '🌙', desc: 'Susah tidur, sering kebangun' },
  { id: 'mood', label: 'Perasaan sedih / hampa', ico: '🌧️', desc: 'Kehilangan semangat atau minat' },
]

export const NEEDS = [
  { id: 'understand', label: 'Memahami apa yang terjadi', ico: '🧭', desc: 'Aku pengen ngerti kondisiku' },
  { id: 'cope', label: 'Belajar mengelola emosi', ico: '🌿', desc: 'Biar nggak gampang kewalahan' },
  { id: 'solve', label: 'Menghadapi masalah konkret', ico: '🎯', desc: 'Aku butuh langkah yang jelas' },
  { id: 'talk', label: 'Berbicara dengan seseorang', ico: '💬', desc: 'Aku pengen didengar' },
]

export const PROBLEM_MODULES = {
  academic: ['academic_01', 'stress_02'],
  social: ['social_01', 'social_02'],
  anxiety: ['anxiety_01', 'anxiety_02'],
  sleep: ['sleep_01', 'mood_02'],
  mood: ['mood_01', 'mood_02'],
}

export const NEED_MODULES = {
  understand: ['emotion_01'],
  cope: ['emotion_01', 'stress_02'],
  solve: ['help_01'],
  talk: ['social_01', 'help_01'],
}
