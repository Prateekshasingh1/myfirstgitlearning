let ctx

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  return ctx
}

function beep(freq, type, dur, vol) {
  const c = getCtx()
  const o = c.createOscillator()
  const g = c.createGain()
  o.connect(g)
  g.connect(c.destination)
  o.type = type || 'sine'
  o.frequency.value = freq
  g.gain.setValueAtTime(vol || 0.3, c.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur)
  o.start()
  o.stop(c.currentTime + dur)
}

export function playCorrect() {
  beep(520, 'sine', 0.12, 0.3)
  setTimeout(() => beep(660, 'sine', 0.2, 0.25), 100)
  setTimeout(() => beep(780, 'sine', 0.3, 0.2), 220)
}

export function playWrong() {
  beep(200, 'square', 0.35, 0.2)
}

export function playWin() {
  ;[523, 659, 784, 1047].forEach((f, i) =>
    setTimeout(() => beep(f, 'sine', 0.4, 0.2), i * 130)
  )
}
