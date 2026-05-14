import { useState, useEffect } from 'react'
import { shuffle } from '../utils/shuffle'
import { playCorrect, playWrong } from '../utils/sound'

const SHAPES = {
  Circle:   <svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="34" fill="#60a5fa"/></svg>,
  Square:   <svg viewBox="0 0 80 80"><rect x="8" y="8" width="64" height="64" rx="4" fill="#fb923c"/></svg>,
  Triangle: <svg viewBox="0 0 80 80"><polygon points="40,6 74,74 6,74" fill="#6ee7b7"/></svg>,
  Star:     <svg viewBox="0 0 80 80"><polygon points="40,5 48,30 74,30 54,46 62,72 40,56 18,72 26,46 6,30 32,30" fill="#ffe066"/></svg>,
  Diamond:  <svg viewBox="0 0 80 80"><polygon points="40,6 74,40 40,74 6,40" fill="#f87171"/></svg>,
  Heart:    <svg viewBox="0 0 80 80"><path d="M40 70 C10 50 5 20 20 12 C28 8 35 12 40 18 C45 12 52 8 60 12 C75 20 70 50 40 70Z" fill="#ec4899"/></svg>,
}

const ALL_SHAPES = Object.keys(SHAPES)

function makeQuestions() {
  return Array.from({ length: 8 }, () => {
    const correct = ALL_SHAPES[Math.floor(Math.random() * ALL_SHAPES.length)]
    const rest = shuffle(ALL_SHAPES.filter(s => s !== correct)).slice(0, 3)
    return { correct, choices: shuffle([correct, ...rest]) }
  })
}

export default function ShapesGame({ onWin }) {
  const [questions, setQuestions] = useState(makeQuestions)
  const [qi, setQi] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState('')

  function handleAnswer(shape) {
    if (answered) return
    const correct = questions[qi].correct
    setAnswered(true)
    setSelected(shape)
    if (shape === correct) {
      setScore(s => s + 1)
      setFeedback(`✨ That's the ${correct}!`)
      playCorrect()
    } else {
      setFeedback(`😊 It was the ${correct}!`)
      playWrong()
    }
  }

  function handleNext() {
    const next = qi + 1
    if (next >= questions.length) {
      onWin('Shape Star! 🔷', `Score: ${score}/${questions.length} ⭐`)
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
      <h2 className="game-title">🔷 Find the Shape!</h2>
      <div className="score-strip">
        <span>Question {qi + 1}/{questions.length}</span>
        <span className="stars">{'⭐'.repeat(score)}</span>
      </div>
      <div className="card">
        <p className="prompt">Find the <strong>{q.correct}</strong>!</p>
        <div className="shape-choices">
          {q.choices.map(shape => {
            let cls = 'shape-btn'
            if (answered) {
              if (shape === q.correct) cls += ' correct'
              else if (shape === selected) cls += ' wrong'
            }
            return (
              <button
                key={shape}
                className={cls}
                onClick={() => handleAnswer(shape)}
                disabled={answered}
              >
                {SHAPES[shape]}
              </button>
            )
          })}
        </div>
        <p className={`feedback${answered ? (selected === q.correct ? ' good' : ' bad') : ''}`}>{feedback}</p>
        <button className="next-btn" onClick={handleNext} disabled={!answered}>Next ➡️</button>
      </div>
    </div>
  )
}
