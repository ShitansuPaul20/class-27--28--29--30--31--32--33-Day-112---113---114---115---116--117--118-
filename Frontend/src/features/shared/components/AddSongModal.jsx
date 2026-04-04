import React, { useState } from 'react'
import { uploadUserSong } from '../../Home/service/song.api'
import UploadAnimation from './UploadAnimation'
import '../style/add-song-modal.scss'

const AddSongModal = ({ isOpen, onClose, onSongAdded }) => {
  const [mood, setMood] = useState('Happy')
  const [songFile, setSongFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)
  const [error, setError] = useState('')

  const getMoodEmoji = (m) => ({ Happy: '😊', Sad: '😢', Surprised: '😲' }[m])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const audioMimes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/m4a']
    if (!audioMimes.includes(file.type)) {
      setError('Please select a valid audio file (MP3, WAV, OGG, M4A)')
      return
    }
    if (file.size > 50 * 1024 * 1024) {
      setError('Song file must be less than 50MB')
      return
    }
    setSongFile(file)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!songFile) { setError('Please select a song file'); return }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('song', songFile)
      formData.append('mood', mood)

      await uploadUserSong(formData)

      setShowAnimation(true)
      setSongFile(null)
      setMood('Happy')

      if (onSongAdded) setTimeout(() => onSongAdded(), 2500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload song')
    } finally {
      setLoading(false)
    }
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
            <label>Song File *</label>
            <label className="file-drop-zone" htmlFor="songFileInput">
              <span className="file-icon">🎵</span>
              <span className="file-text">
                {songFile ? songFile.name : 'Click to choose MP3, WAV, OGG, M4A'}
              </span>
              <small>Max 50MB</small>
              <input
                id="songFileInput"
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                disabled={loading}
                hidden
              />
            </label>
          </div>

          <div className="form-group">
            <label>Mood/Vibe</label>
            <div className="mood-selector">
              {['Happy', 'Sad', 'Surprised'].map(m => (
                <button
                  key={m}
                  type="button"
                  className={`mood-btn ${mood === m ? 'active' : ''}`}
                  onClick={() => setMood(m)}
                  disabled={loading}
                >
                  <span className="mood-emoji">{getMoodEmoji(m)}</span>
                  <span>{m}</span>
                </button>
              ))}
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn" disabled={loading || !songFile}>
            {loading ? <><span className="spinner"></span>Uploading...</> : 'Add Song 🎶'}
          </button>

        </form>
      </div>

      <UploadAnimation isVisible={showAnimation} onComplete={() => { setShowAnimation(false); onClose() }} />
    </>
  )
}

export default AddSongModal