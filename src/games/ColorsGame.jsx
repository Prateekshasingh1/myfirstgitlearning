import { useState, useEffect } from 'react'
import { shuffle } from '../utils/shuffle'
import { playCorrect, playWrong } from '../utils/sound'
import colorData from '../data/colorData'

export default function ColorsGame({ onWin }) {
  const [questions, setQuestions] = useState(() => shuffle([...colorData]))
  const [qi, setQi] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [choices, setChoices] = useState([])

  useEffect(() => {
    setChoices(shuffle([...questions[qi].choices]))
  }, [qi, questions])

  function handleAnswer(hex) {
    if (answered) return
    const correct = questions[qi].hex
    setAnswered(true)
    setSelected(hex)
    if (hex === correct) {
      setScore(s => s + 1)
      setFeedback('🌈 Correct!')
      playCorrect()
    } else {
      setFeedback('😊 Keep trying!')
      playWrong()
    }
  }

  function handleNext() {
    const next = qi + 1
    if (next >= questions.length) {
      onWin('Color Master! 🎨', `Score: ${score}/${questions.length} ⭐`)
      setQuestions(shuffle([...colorData]))
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
      <h2 className="game-title">🎨 Tap the Color!</h2>
      <div className="score-strip">
        <span>Question {qi + 1}/{questions.length}</span>
        <span className="stars">{'⭐'.repeat(score)}</span>
      </div>
      <div className="card">
        <p className="prompt" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
          Find <span style={{ color: q.hex, textShadow: '1px 1px 0 rgba(0,0,0,.12)' }}>{q.name}</span>!
        </p>
        <div className="color-choices">
          {choices.map(hex => {
            let cls = 'color-box'
            if (answered) {
              if (hex === q.hex) cls += ' correct'
              else if (hex === selected) cls += ' wrong'
            }
            return (
              <div
                key={hex}
                className={cls}
                style={{ background: hex, cursor: answered ? 'default' : 'pointer' }}
                onClick={() => handleAnswer(hex)}
              />
            )
          })}
        </div>
        <p className={`feedback${answered ? (selected === q.hex ? ' good' : ' bad') : ''}`}>{feedback}</p>
        <button className="next-btn" onClick={handleNext} disabled={!answered}>Next ➡️</button>
      </div>
    </div>
  )
}
