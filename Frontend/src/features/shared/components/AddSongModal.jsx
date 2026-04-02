import React, { useState } from 'react'
import { uploadUserSong } from '../../Auth/services/userSong.api'
import UploadAnimation from './UploadAnimation'
import '../style/add-song-modal.scss'

const AddSongModal = ({ isOpen, onClose, onSongAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    mood: 'Happy'
  })
  const [files, setFiles] = useState({
    songFile: null,
    posterFile: null
  })
  const [loading, setLoading] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)
  const [error, setError] = useState('')

  const getMoodEmoji = (mood) => {
    const emojis = {
      Happy: '😊',
      Sad: '😢',
      Surprised: '😲'
    }
    return emojis[mood]
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleFileChange = (e) => {
    const { name } = e.target
    const file = e.target.files?.[0]
    
    if (!file) return

    // Validate file type
    if (name === 'songFile') {
      const audioMimes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/m4a']
      if (!audioMimes.includes(file.type)) {
        setError('Please select a valid audio file (MP3, WAV, OGG, M4A)')
        return
      }
      // Check file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        setError('Song file must be less than 50MB')
        return
      }
    } else if (name === 'posterFile') {
      const imageMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      if (!imageMimes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, WebP, GIF)')
        return
      }
      // Check file size (10MB limit for images)
      if (file.size > 10 * 1024 * 1024) {
        setError('Poster file must be less than 10MB')
        return
      }
    }

    setFiles(prev => ({
      ...prev,
      [name]: file
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.title.trim()) {
      setError('Please enter a song title')
      return
    }

    if (!files.songFile) {
      setError('Please select a song file to upload')
      return
    }

    setLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('mood', formData.mood)
      formDataToSend.append('songFile', files.songFile)
      
      if (files.posterFile) {
        formDataToSend.append('posterFile', files.posterFile)
      }

      await uploadUserSong(formDataToSend)

      setShowAnimation(true)
      setFormData({
        title: '',
        mood: 'Happy'
      })
      setFiles({
        songFile: null,
        posterFile: null
      })

      if (onSongAdded) {
        setTimeout(() => {
          onSongAdded()
        }, 2500)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload song')
    } finally {
      setLoading(false)
    }
  }

  const handleAnimationComplete = () => {
    setShowAnimation(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="add-song-modal">
        <div className="modal-header">
          <h2>Add Your Song</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="song-form">
          <div className="form-group">
            <label>Song Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter song title"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Song File *</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                name="songFile"
                accept="audio/*"
                onChange={handleFileChange}
                disabled={loading}
              />
              <span className="file-label">
                {files.songFile ? files.songFile.name : 'Choose audio file'}
              </span>
            </div>
            <small>Supported formats: MP3, WAV, OGG, M4A (Max 50MB)</small>
          </div>

          <div className="form-group">
            <label>Poster/Cover Image (Optional)</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                name="posterFile"
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
              />
              <span className="file-label">
                {files.posterFile ? files.posterFile.name : 'Choose image file'}
              </span>
            </div>
            <small>Supported formats: JPEG, PNG, WebP, GIF (Max 10MB)</small>
          </div>

          <div className="form-group">
            <label>Mood/Vibe</label>
            <div className="mood-selector">
              {['Happy', 'Sad', 'Surprised'].map(mood => (
                <button
                  key={mood}
                  type="button"
                  className={`mood-btn ${formData.mood === mood ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, mood }))}
                  disabled={loading}
                >
                  <span className="mood-emoji">{getMoodEmoji(mood)}</span>
                  <span>{mood}</span>
                </button>
              ))}
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading || !files.songFile}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Uploading...
              </>
            ) : (
              'Add Song'
            )}
          </button>
        </form>
      </div>

      <UploadAnimation 
        isVisible={showAnimation}
        onComplete={handleAnimationComplete}
      />
    </>
  )
}

export default AddSongModal
