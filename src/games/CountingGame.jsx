import { useState } from 'react'
import { shuffle } from '../utils/shuffle'
import { playCorrect, playWrong } from '../utils/sound'

const EMOJIS = ['⭐', '🍎', '🐸', '🦋', '🌸', '🍕', '🐠', '🎈']

function makeQuestions() {
  return shuffle(
    Array.from({ length: 8 }, (_, i) => {
      const n = i + 1
      const wrongs = new Set()
      while (wrongs.size < 3) {
        const w = Math.max(1, n + (Math.random() < 0.5 ? 1 : -1) * (1 + Math.floor(Math.random() * 3)))
        if (w !== n) wrongs.add(w)
      }
      return { n, emoji: EMOJIS[i], choices: shuffle([n, ...[...wrongs]]) }
    })
  )
}

export default function CountingGame({ onWin }) {
  const [questions, setQuestions] = useState(makeQuestions)
  const [qi, setQi] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState('')

  function handleAnswer(val) {
    if (answered) return
    const correct = questions[qi].n
    setAnswered(true)
    setSelected(val)
    if (val === correct) {
      setScore(s => s + 1)
      setFeedback(`🎉 Yes! ${correct}!`)
      playCorrect()
    } else {
      setFeedback(`😊 The answer was ${correct}!`)
      playWrong()
    }
  }

  function handleNext() {
    const next = qi + 1
    if (next >= questions.length) {
      onWin('You counted them all! 🔢', `Score: ${score}/${questions.length} ⭐`)
      setQuestions(makeQuestions())
      setQi(0)
      setScore(0)
    } else {
      setQi(next)
    }
    setAnswered(false)
    setSelected(null)
    setFeedback('')
  }

  const q = questions[qi]

  return (
    <div className="game-container">
      <h2 className="game-title">🔢 Count &amp; Tap!</h2>
      <div className="score-strip">
        <span>Question {qi + 1}/{questions.length}</span>
        <span className="stars">{'⭐'.repeat(score)}</span>
      </div>
      <div className="card">
        <p className="prompt">How many {q.emoji} do you see?</p>
        <div className="emoji-grid">
          {Array.from({ length: q.n }, (_, i) => (
            <span key={i}>{q.emoji}</span>
          ))}
        </div>
        <div className="answers">
          {q.choices.map(c => (
            <button
              key={c}
              className={`ans-btn${answered ? (c === q.n ? ' correct' : c === selected ? ' wrong' : '') : ''}`}
              onClick={() => handleAnswer(c)}
              disabled={answered}
            >
              {c}
            </button>
          ))}
        </div>
        <p className={`feedback${answered ? (selected === q.n ? ' good' : ' bad') : ''}`}>{feedback}</p>
        <button className="next-btn" onClick={handleNext} disabled={!answered}>Next ➡️</button>
      </div>
    </div>
  )
}
