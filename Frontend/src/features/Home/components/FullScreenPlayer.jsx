import React, { useState, useRef, useEffect } from 'react'
import '../style/fullscreen-player.scss'
import { useSong } from '../hook/useSong'

const emotionEmojis = {
  smiling: '😊',
  surprised: '😲',
  sorrow: '😢',
}

const FullScreenPlayer = ({ currentEmotion = 'smiling', onDetectAgain }) => {
  const { song, goToNextSong, goToPreviousSong, isFirstSong, isLastSong, trackSongListen } = useSong()

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef(null)

  // Song change hone par reset karo
  useEffect(() => {
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.load()
    }
  }, [song?.url])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
        trackSongListen(song?.title, song?.mood)
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleNextSong = () => {
    goToNextSong()
    setIsPlaying(false)
  }

  const handlePreviousSong = () => {
    goToPreviousSong()
    setIsPlaying(false)
  }

  const skipForward = () => {
    if (audioRef.current) audioRef.current.currentTime += 10
  }

  const skipBackward = () => {
    if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10)
  }

  const handleProgressChange = (e) => {
    if (audioRef.current) audioRef.current.currentTime = e.target.value
  }

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="fullscreen-player">
      <audio
        ref={audioRef}
        src={song?.url}
        onEnded={() => {
          setIsPlaying(false)
          if (!isLastSong) {
            goToNextSong()
            // thoda delay de taaki song load ho
            setTimeout(() => {
              if (audioRef.current) {
                audioRef.current.play()
                setIsPlaying(true)
              }
            }, 500)
          }
        }}
      />

      {/* Top Bar */}
      <div className="player-top-bar">
        <button className="btn-detect" onClick={onDetectAgain} title="Detect Face Again">
          <span className="icon">📹</span>
        </button>
        <h1 className="player-title">Now Playing</h1>
        <div className="emotion-badge">{emotionEmojis[currentEmotion]}</div>
      </div>

      {/* Album Art */}
      <div className="album-art-section">
        <div className="album-art">
          <img
            src={song?.posterUrl}
            alt={song?.title}
            className={isPlaying ? 'playing' : ''}
          />
        </div>
      </div>

      {/* Song Info */}
      <div className="song-info-full">
        <h2 className="song-title">{song?.title || 'Unknown Song'}</h2>
        <p className="song-mood">{song?.mood || 'Mood'}</p>
        <p className="song-source">
          {song?.uploadedBy ? '👤 Uploaded by User' : '🎼 Uploaded by Admin'}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <span className="time-current">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleProgressChange}
          className="progress-bar"
        />
        <span className="time-duration">{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="player-controls">
        <button className="control-btn previous-btn" onClick={handlePreviousSong} disabled={isFirstSong} title="Previous">
          <span className="icon">⏮️</span>
        </button>
        <button className="control-btn skip-back-btn" onClick={skipBackward} title="Skip -10s">
          <span className="icon">⏪</span>
        </button>
        <button className={`control-btn play-pause-btn ${isPlaying ? 'playing' : ''}`} onClick={togglePlayPause}>
          <span className="icon">{isPlaying ? '⏸️' : '▶️'}</span>
        </button>
        <button className="control-btn skip-forward-btn" onClick={skipForward} title="Skip +10s">
          <span className="icon">⏩</span>
        </button>
        <button className="control-btn next-btn" onClick={handleNextSong} disabled={isLastSong} title="Next">
          <span className="icon">⏭️</span>
        </button>
      </div>

      {/* Volume */}
      <div className="volume-container">
        <button className="volume-btn" onClick={() => setIsMuted(!isMuted)}>
          <span className="icon">{isMuted ? '🔇' : '🔊'}</span>
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="volume-slider"
        />
      </div>
    </div>
  )
}

export default FullScreenPlayer