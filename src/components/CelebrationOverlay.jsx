export default function CelebrationOverlay({ msg, sub, onClose }) {
  return (
    <div className="celebration-overlay">
      <div className="cel-content">
        <div className="big">🏆</div>
        <h2>{msg}</h2>
        <p>{sub}</p>
        <button onClick={onClose}>Play Again 🎮</button>
      </div>
    </div>
  )
}
