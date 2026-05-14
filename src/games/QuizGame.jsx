import { useState, useEffect } from 'react'
import { shuffle } from '../utils/shuffle'
import { playCorrect, playWrong } from '../utils/sound'

const PRAISE = ['🎉 Yes!', '🌟 Correct!', '✨ Amazing!', '🏆 Great!']

export default function QuizGame({ data, title, onWin }) {
  const [questions, setQuestions] = useState(() => shuffle([...data]))
  const [qi, setQi] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [choices, setChoices] = useState([])

  useEffect(() => {
    setChoices(shuffle([...questions[qi].choices]))
  }, [qi, questions])

  function handleAnswer(choice) {
    if (answered) return
    const correct = questions[qi].a
    const isCorrect = choice === correct
    setAnswered(true)
    setSelected(choice)
    if (isCorrect) {
      setScore(s => s + 1)
      setFeedback(PRAISE[Math.floor(Math.random() * PRAISE.length)])
      playCorrect()
    } else {
      setFeedback(`😊 The answer was ${correct}!`)
      playWrong()
    }
  }

  function handleNext() {
    const next = qi + 1
    if (next >= questions.length) {
      onWin(`${title} Complete! 🎉`, `Score: ${score}/${questions.length} ⭐`)
      setQuestions(shuffle([...data]))
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
  const correct = q.a

  return (
    <div className="game-container">
      <h2 className="game-title">{title}</h2>
      <div className="score-strip">
        <span>Question {qi + 1}/{questions.length}</span>
        <span className="stars">{'⭐'.repeat(score)}</span>
      </div>
      <div className="card">
        <p className="prompt">{q.q}</p>
        <div className="big-emoji">{q.a.split(' ')[0]}</div>
        <div className="answers">
          {choices.map(c => (
            <button
              key={c}
              className={`ans-btn${answered ? (c === correct ? ' correct' : c === selected ? ' wrong' : '') : ''}`}
              onClick={() => handleAnswer(c)}
              disabled={answered}
            >
              {c}
            </button>
          ))}
        </div>
        <p className={`feedback${answered ? (selected === correct ? ' good' : ' bad') : ''}`}>{feedback}</p>
        <button className="next-btn" onClick={handleNext} disabled={!answered}>Next ➡️</button>
      </div>
    </div>
  )
}
