import { DOMAINS } from '../data/domains'
import { RESULT_EXPLAIN } from '../data/ckgCodes'
import { PHQ4_LEVELS } from '../data/quizzes'

const BASE_SCORES = { stress: 0, anxiety: 0, mood: 0, sleep: 0, social: 0 }

export function scoreQuiz(quiz, answers) {
  const total = answers.reduce((a, b) => a + b, 0)
  const max = quiz.questions.length * 3

  // kategori relatif terhadap skor maksimal
  const ratio = total / max
  let category = 'low'
  if (ratio >= 0.6) category = 'high'
  else if (ratio >= 0.3) category = 'mid'

  const primary = quiz.domain
  const primaryScore = Math.round((total / max) * 4)

  const domainScores = { ...BASE_SCORES, [primary]: primaryScore }

  const topDomains = primaryScore >= 2 ? [DOMAINS[primary].short] : []

  const explain =
    RESULT_EXPLAIN[category] +
    (topDomains.length ? ' Area yang paling menonjol dari jawabanmu: ' + DOMAINS[primary].short + '.' : '')

  return {
    code: 'SELF-' + quiz.id.toUpperCase(),
    quizTitle: quiz.title,
    category,
    domainScores,
    explain,
    topDomains,
  }
}

const TIER_TO_CATEGORY = { normal: 'low', mild: 'low', moderate: 'mid', severe: 'high' }

export function scorePhq4(quiz, answers) {
  const total = answers.reduce((a, b) => a + b, 0)
  const anxiety = (answers[0] ?? 0) + (answers[1] ?? 0)
  const depression = (answers[2] ?? 0) + (answers[3] ?? 0)

  const tier = total <= 2 ? 'normal' : total <= 5 ? 'mild' : total <= 8 ? 'moderate' : 'severe'
  const level = PHQ4_LEVELS[tier]
  const category = TIER_TO_CATEGORY[tier]

  const domainScores = {
    stress: 0,
    anxiety: Math.round((anxiety / 6) * 4),
    mood: Math.round((depression / 6) * 4),
    sleep: 0,
    social: 0,
  }

  return {
    code: 'PHQ-4',
    quizTitle: quiz.title,
    category,
    domainScores,
    explain: `Skor PHQ-4 kamu ${total} dari 12, masuk kategori ${level.label.toLowerCase()}.`,
    topDomains: ['kecemasan', 'depresi'],
    phq4: {
      total,
      tier,
      label: level.label,
      range: level.range,
      desc: level.desc,
      anxiety,
      depression,
      anxietyPositive: anxiety >= 3,
      depressionPositive: depression >= 3,
      source: quiz.source,
      reference: quiz.reference,
    },
  }
}
