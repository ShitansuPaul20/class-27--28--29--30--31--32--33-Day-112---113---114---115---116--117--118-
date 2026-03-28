import React, { useEffect, useRef } from 'react'

const SYMBOLS = [
  '🎵', '🎶', '🎸', '🎹', '🎷', '🎺', '🥁', '🎻',
  '😊', '😎', '🥰', '😄', '😢', '🤩', '😌', '😤',
]

const FloatingCanvas = ({ count = 28, minSize = 14, maxSize = 18, minSpeed = 0.4, maxSpeed = 0.8, minOpacity = 0.15, maxOpacity = 0.35 }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: count }, () => ({
      x:           Math.random() * window.innerWidth,
      y:           window.innerHeight + Math.random() * 200,
      symbol:      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      size:        minSize + Math.random() * maxSize,
      speed:       minSpeed + Math.random() * maxSpeed,
      drift:       (Math.random() - 0.5) * 0.4,
      opacity:     minOpacity + Math.random() * maxOpacity,
      rotate:      Math.random() * 360,
      rotateSpeed: (Math.random() - 0.5) * 0.6,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(p => {
        ctx.save()
        ctx.globalAlpha = p.opacity
        ctx.font        = `${p.size}px serif`
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotate * Math.PI) / 180)
        ctx.fillText(p.symbol, 0, 0)
        ctx.restore()

        p.y      -= p.speed
        p.x      += p.drift
        p.rotate += p.rotateSpeed

        // Reset when particle exits top
        if (p.y < -40) {
          p.y      = canvas.height + 20
          p.x      = Math.random() * canvas.width
          p.symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
          p.opacity = minOpacity + Math.random() * maxOpacity
        }
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      'fixed',
        inset:         0,
        zIndex:        0,
        pointerEvents: 'none',
      }}
    />
  )
}

export default FloatingCanvas
