const COLORS = ['#ff6eb4', '#ffe066', '#6ee7b7', '#60a5fa', '#fb923c', '#c084fc', '#f87171']

export function confetti() {
  for (let i = 0; i < 80; i++) {
    const el = document.createElement('div')
    const size = 8 + Math.random() * 10
    el.style.cssText = `
      position:fixed; pointer-events:none; z-index:1100; border-radius:2px;
      width:${size}px; height:${size * 0.5}px;
      left:${Math.random() * 100}vw;
      top:${-20 - Math.random() * 40}px;
      background:${COLORS[Math.floor(Math.random() * COLORS.length)]};
      transform:rotate(${Math.random() * 360}deg);
      animation:confettiFall ${1.5 + Math.random() * 2}s ${Math.random() * 0.5}s linear forwards;
    `
    document.body.appendChild(el)
    el.addEventListener('animationend', () => el.remove())
  }
}
