import { useMemo } from 'react'

const COLORS = ['#ff6eb4', '#ffe066', '#6ee7b7', '#60a5fa', '#fb923c', '#c084fc']

export default function Bubbles() {
  const bubbles = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      size: 30 + Math.random() * 60,
      left: Math.random() * 100,
      color: COLORS[i % COLORS.length],
      duration: 8 + Math.random() * 14,
      delay: Math.random() * 12,
    }))
  , [])

  return (
    <div className="bubbles">
      {bubbles.map(b => (
        <div
          key={b.id}
          className="bubble"
          style={{
            width: b.size,
            height: b.size,
            left: `${b.left}%`,
            background: b.color,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
