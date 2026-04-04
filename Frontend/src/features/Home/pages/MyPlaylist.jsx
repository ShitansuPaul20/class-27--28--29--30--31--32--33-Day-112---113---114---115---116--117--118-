import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import '../style/my-playlist.scss'
import { useSong } from '../hook/useSong'  // Home/hook/useSong
import DeleteConfirmationModal from '../../shared/components/DeleteConformationModal'
import '../style/my-playlist.scss'

const MyPlaylist = () => {
  const navigate = useNavigate()
  const { handleGetUserSongs, handleDeleteUserSong ,loading } = useSong()

  const [songs, setSongs] = useState([])
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    song: null,
    typedTitle: ''
  })

  useEffect(() => {
  const loadSongs = async () => {
    const data = await handleGetUserSongs()
    setSongs(data)
  }
  loadSongs()
}, [])

  const getMoodEmoji = (mood) => {
    const emojis = { Happy: '😊', Sad: '😢', Surprised: '😲' }
    return emojis[mood] || '🎵'
  }

  const handleDeleteClick = (song) => {
    setDeleteModal({ isOpen: true, song, typedTitle: '' })
  }

  const handleConfirmDelete = async () => {
    if (deleteModal.typedTitle !== deleteModal.song.title) {
      alert('Song title does not match!')
      return
    }
    try {
      await handleDeleteUserSong(deleteModal.song._id)
      setSongs(songs.filter(s => s._id !== deleteModal.song._id))
      setDeleteModal({ isOpen: false, song: null, typedTitle: '' })
    } catch (error) {
      alert('Failed to delete song')
    }
  }

  return (
    <>
      <div className="my-playlist-container">
        <div className="playlist-header">
          <h1>My Playlist</h1>
          <p className="playlist-count">{songs.length} songs</p>
        </div>

        {loading ? (
          <div className="loading-message">
            <div className="spinner"></div>
            <p>Loading your songs...</p>
          </div>
        ) : songs.length === 0 ? (
          <div className="empty-playlist">
            <div className="empty-icon">🎵</div>
            <h2>No Songs Yet</h2>
            <p>Start adding your favorite songs to create your playlist</p>
            <button className="add-song-btn" onClick={() => navigate('/')}>
              Go Home & Add Songs
            </button>
          </div>
        ) : (
          <div className="songs-grid">
            {songs.map(song => (
              <div key={song._id} className="song-card">
                <div className="song-image-wrapper">
                  {song.posterUrl ? (
                    <img src={song.posterUrl} alt={song.title} className="song-image" />
                  ) : (
                    <div className="default-song-image">
                      <span className="music-emoji">🎵</span>
                    </div>
                  )}
                  <div className="song-overlay">
                    <button className="play-btn" title="Play song">▶️</button>
                  </div>
                </div>

                <div className="song-info">
                  <div className="mood-badge">
                    <span className="mood-emoji">{getMoodEmoji(song.mood)}</span>
                    <span className="mood-text">{song.mood}</span>
                  </div>
                  <h3 className="song-title">{song.title}</h3>
                  <p className="song-source">📤 Your Upload</p>
                </div>

                <button
                  className="delete-btn"
                  onClick={() => handleDeleteClick(song)}
                  title="Delete song"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        song={deleteModal.song}
        typedTitle={deleteModal.typedTitle}
        onTypedTitleChange={(value) =>
          setDeleteModal(prev => ({ ...prev, typedTitle: value }))
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, song: null, typedTitle: '' })}
      />
    </>
  )
}

export default MyPlaylist