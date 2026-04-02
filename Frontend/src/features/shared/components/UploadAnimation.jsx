import React, { useEffect, useState } from 'react'
import '../style/upload-animation.scss'

const UploadAnimation = ({ isVisible, onComplete }) => {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (!isVisible) {
      setParticles([])
      return
    }

    const emojis = ['😊', '😲', '😢', '🎵', '♥️', '🎶', '⭐', '🎼']
    const newParticles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: Math.random() * 100,
      delay: Math.random() * 0.3,
      duration: 2 + Math.random() * 0.5,
    }))

    setParticles(newParticles)

    const timer = setTimeout(() => {
      if (onComplete) onComplete()
    }, 2500)

    return () => clearTimeout(timer)
  }, [isVisible, onComplete])

  if (!isVisible) return null

  return (
    <div className="upload-animation-container">
      <div className="confetti-wrapper">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="confetti-particle"
            style={{
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          >
            {particle.emoji}
          </div>
        ))}
      </div>
      <div className="upload-success-message">
        <div className="success-icon">✓</div>
        <h2>Song Uploaded Successfully!</h2>
        <p>Your song is now added to your playlist</p>
      </div>
    </div>
  )
}

export default UploadAnimation
