import { useState } from 'react'
import Bubbles from './components/Bubbles'
import CelebrationOverlay from './components/CelebrationOverlay'
import QuizGame from './games/QuizGame'
import CountingGame from './games/CountingGame'
import ColorsGame from './games/ColorsGame'
import ShapesGame from './games/ShapesGame'
import MemoryMatch from './games/MemoryMatch'
import animalData from './data/animalData'
import foodData from './data/foodData'
import { playWin } from './utils/sound'
import { confetti } from './utils/confetti'

const TABS = [
  { id: 'animals',  label: 'Animals',  emoji: '🐘', colors: ['#fb923c', '#f97316'] },
  { id: 'counting', label: 'Counting', emoji: '🔢', colors: ['#6ee7b7', '#34d399'] },
  { id: 'colors',   label: 'Colors',   emoji: '🎨', colors: ['#60a5fa', '#818cf8'] },
  { id: 'shapes',   label: 'Shapes',   emoji: '🔷', colors: ['#c084fc', '#a855f7'] },
  { id: 'memory',   label: 'Memory',   emoji: '🧠', colors: ['#f472b6', '#ec4899'] },
  { id: 'food',     label: 'Food',     emoji: '🍎', colors: ['#34d399', '#059669'] },
]

export default function App() {
  const [activeGame, setActiveGame] = useState('animals')
  const [celebration, setCelebration] = useState(null)

  function handleWin(msg, sub) {
    confetti()
    playWin()
    setCelebration({ msg, sub })
  }

  function switchTab(id) {
    setActiveGame(id)
    setCelebration(null)
  }

  return (
    <div className="app">
      <Bubbles />

      {celebration && (
        <CelebrationOverlay
          msg={celebration.msg}
          sub={celebration.sub}
          onClose={() => setCelebration(null)}
        />
      )}

      <header>
        <h1>🎈 Toddler Fun Zone 🎈</h1>
        <p>Learning is fun!</p>
      </header>

      <nav>
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn${activeGame === tab.id ? ' active' : ''}`}
            style={{ background: `linear-gradient(135deg, ${tab.colors[0]}, ${tab.colors[1]})` }}
            onClick={() => switchTab(tab.id)}
          >
            {tab.emoji} {tab.label}
          </button>
        ))}
      </nav>

      <main>
        {activeGame === 'animals'  && <QuizGame    key="animals"  data={animalData} title="Animals 🐘"    onWin={handleWin} />}
        {activeGame === 'counting' && <CountingGame key="counting"                                         onWin={handleWin} />}
        {activeGame === 'colors'   && <ColorsGame   key="colors"                                           onWin={handleWin} />}
        {activeGame === 'shapes'   && <ShapesGame   key="shapes"                                           onWin={handleWin} />}
        {activeGame === 'memory'   && <MemoryMatch  key="memory"                                           onWin={handleWin} />}
        {activeGame === 'food'     && <QuizGame    key="food"     data={foodData}   title="Food Quiz 🍎"  onWin={handleWin} />}
      </main>
    </div>
  )
}
