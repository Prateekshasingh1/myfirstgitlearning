import { useState } from 'react'
import { shuffle } from '../utils/shuffle'
import { playCorrect, playWrong } from '../utils/sound'

const BASE_EMOJIS = ['🐶', '🐱', '🐭', '🦊', '🐻', '🐼', '🦁', '🐯']

function makeCards() {
  return shuffle([...BASE_EMOJIS, ...BASE_EMOJIS]).map((emoji, i) => ({ id: i, emoji }))
}

export default function MemoryMatch({ onWin }) {
  const [cards, setCards] = useState(makeCards)
  const [flipped, setFlipped] = useState([])    // ids currently face-up (not matched)
  const [matched, setMatched] = useState(new Set())
  const [moves, setMoves] = useState(0)
  const [locked, setLocked] = useState(false)

  function reset() {
    setCards(makeCards())
    setFlipped([])
    setMatched(new Set())
    setMoves(0)
    setLocked(false)
  }

  function handleFlip(id) {
    if (locked || matched.has(id) || flipped.includes(id) || flipped.length >= 2) return

    const newFlipped = [...flipped, id]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      const [a, b] = newFlipped.map(fid => cards.find(c => c.id === fid))
      const currentMoves = moves + 1
      setMoves(currentMoves)

      if (a.emoji === b.emoji) {
        const newMatched = new Set([...matched, a.id, b.id])
        setMatched(newMatched)
        setFlipped([])
        playCorrect()
        if (newMatched.size === cards.length) {
          setTimeout(() => {
            onWin('Memory Master! 🧠', `Done in ${currentMoves} moves! 🌟`)
            reset()
          }, 500)
        }
      } else {
        setLocked(true)
        playWrong()
        setTimeout(() => {
          setFlipped([])
          setLocked(false)
        }, 900)
      }
    }
  }

  return (
    <div className="game-container">
      <h2 className="game-title">🧠 Memory Match!</h2>
      <div className="score-strip">
        <span>Moves: {moves}</span>
        <span>Matched: {matched.size / 2}/8 🌟</span>
      </div>
      <div className="memory-grid">
        {cards.map(card => {
          const isFlipped = flipped.includes(card.id) || matched.has(card.id)
          const isMatched = matched.has(card.id)
          return (
            <div
              key={card.id}
              className={`mem-card${isFlipped ? ' flipped' : ''}${isMatched ? ' matched' : ''}`}
              onClick={() => handleFlip(card.id)}
            >
              <div className="back">❓</div>
              <div className="face">{card.emoji}</div>
            </div>
          )
        })}
      </div>
      <button
        className="next-btn"
        onClick={reset}
        style={{ background: 'linear-gradient(90deg,#f472b6,#a855f7)' }}
      >
        🔄 New Game
      </button>
    </div>
  )
}
