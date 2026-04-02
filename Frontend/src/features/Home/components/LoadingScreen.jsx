import React from 'react'
import '../style/loading-screen.scss'
import Navbar from '../../shared/components/Navbar'

const emotionEmojis = {
  smiling: '😊',
  surprised: '😲',
  sorrow: '😢',
}

const LoadingScreen = ({ emotion = 'smiling' }) => {
  return (
    <>
      <Navbar />
      <div className="loading-screen">
        <div className="loading-content">
          <div className="emotion-large">
            {emotionEmojis[emotion] || '😊'}
          </div>
          <h2 className="loading-text">Analyzing Your Mood...</h2>
          <div className="loader">
            <div className="loader-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
          <p className="loading-subtitle">Finding the perfect songs for you</p>
        </div>
      </div>
    </>
  )
}

export default LoadingScreen
