import React, { useState, useRef, useEffect } from 'react'
import '../style/player-footer.scss'
import { useSong } from '../hook/useSong'

const Player = ({ currentEmotion = 'smiling' }) => {
  const { song, goToNextSong, goToPreviousSong, isFirstSong, isLastSong } = useSong();

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef(null)

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
      audioRef.current.playbackRate = speed
    }
  }, [speed])

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
      }
      setIsPlaying(!isPlaying)
    }
  }

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 10
    }
  }

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10)
    }
  }

  const handleProgressChange = (e) => {
    if (audioRef.current) {
      audioRef.current.currentTime = e.target.value
    }
  }

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const emotionEmojis = {
    smiling: '😊',
    surprised: '😲',
    sorrow: '😢',
  }

  return (
    <div className="player-footer-container">
      <audio 
        ref={audioRef} 
        src={song?.url} 
        onEnded={() => setIsPlaying(false)}
      />
      
      <div className="player-footer">
        {/* Song Image */}
        <div className="song-image-section">
          <img 
            src={song?.posterUrl} 
            alt={song?.title || 'Album Art'}
            className="song-image"
          />
        </div>

        {/* Song Info and Expression */}
        <div className="song-info-section">
          <div className="song-details">
            <p className="song-title">{song?.title || 'Now Playing'}</p>
            <p className="song-mood">{song?.mood || 'Unknown'}</p>
          </div>
          <div className="emotion-display">
            {emotionEmojis[currentEmotion] || '😊'}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleProgressChange}
            className="progress-bar"
          />
          <div className="time-display">
            <span className="current-time">{formatTime(currentTime)}</span>
            <span className="duration">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="controls-main">
          {/* Skip Backward */}
          <button 
            className="control-btn skip-btn"
            onClick={skipBackward}
            title="Skip backward 10 seconds"
          >
            <span className="icon">⏪</span>
          </button>

          {/* Play/Pause */}
          <button 
            className={`control-btn play-pause-btn ${isPlaying ? 'playing' : ''}`}
            onClick={togglePlayPause}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            <span className="icon">{isPlaying ? '⏸️' : '▶️'}</span>
          </button>

          {/* Skip Forward */}
          <button 
            className="control-btn skip-btn"
            onClick={skipForward}
            title="Skip forward 10 seconds"
          >
            <span className="icon">⏩</span>
          </button>
        </div>

        {/* Volume Controls */}
        <div className="volume-controls">
          <button 
            className="volume-btn"
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
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

        {/* Speed Control */}
        <div className="speed-control">
          <select 
            value={speed} 
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="speed-selector"
            title="Playback Speed"
          >
            <option value={0.5}>0.5x</option>
            <option value={0.75}>0.75x</option>
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={1.75}>1.75x</option>
            <option value={2}>2x</option>
          </select>
        </div>

        {/* Navigation */}
        <div className="navigation-controls">
          <button 
            className="nav-btn previous-btn"
            onClick={goToPreviousSong}
            disabled={isFirstSong}
            title="Previous Song"
          >
            <span className="icon">⬅️</span>
          </button>

          <button 
            className="nav-btn next-btn"
            onClick={goToNextSong}
            disabled={isLastSong}
            title="Next Song"
          >
            <span className="icon">➡️</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Player