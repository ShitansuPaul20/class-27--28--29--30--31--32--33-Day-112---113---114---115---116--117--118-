import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { getUserSongs, deleteUserSong } from '../../Auth/services/userSong.api'
import { useAuth } from '../../Auth/hook/useAuth'
import Navbar from '../components/Navbar'
import MobileSidebar from '../components/MobileSidebar'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'
import AddSongModal from '../components/AddSongModal'
import '../style/my-playlist.scss'

const MyPlaylist = () => {
  const navigate = useNavigate()
  const { User } = useAuth()
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddSongModal, setShowAddSongModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    song: null,
    typedTitle: ''
  })

  useEffect(() => {
    if (!User) {
      navigate('/login')
      return
    }
    fetchUserSongs()
  }, [User])

  const fetchUserSongs = async () => {
    try {
      setLoading(true)
      const response = await getUserSongs()
      setSongs(response.songs || [])
    } catch (error) {
      console.error('Error fetching songs:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMoodEmoji = (mood) => {
    const emojis = {
      Happy: '😊',
      Sad: '😢',
      Surprised: '😲'
    }
    return emojis[mood] || '🎵'
  }

  const handleDeleteClick = (song) => {
    setDeleteModal({
      isOpen: true,
      song,
      typedTitle: ''
    })
  }

  const handleConfirmDelete = async () => {
    if (deleteModal.typedTitle !== deleteModal.song.title) {
      alert('Song title does not match. Please type the exact title to confirm deletion.')
      return
    }

    try {
      await deleteUserSong(deleteModal.song._id)
      setSongs(songs.filter(s => s._id !== deleteModal.song._id))
      setDeleteModal({ isOpen: false, song: null, typedTitle: '' })
    } catch (error) {
      console.error('Error deleting song:', error)
      alert('Failed to delete song')
    }
  }

  const handlePlaySong = (song) => {
    // This will be handled by the main app to pass song to player
    navigate('/', { state: { selectedSong: song } })
  }

  return (
    <>
      <div className="desktop-navbar-wrapper">
        <Navbar onAddSongClick={() => setShowAddSongModal(true)} />
      </div>
      <MobileSidebar onAddSongClick={() => setShowAddSongModal(true)} />
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
                {/* Song Image */}
                <div className="song-image-wrapper">
                  {song.posterUrl ? (
                    <img src={song.posterUrl} alt={song.title} className="song-image" />
                  ) : (
                    <div className="default-song-image">
                      <span className="music-emoji">🎵</span>
                    </div>
                  )}
                  <div className="song-overlay">
                    <button 
                      className="play-btn"
                      onClick={() => handlePlaySong(song)}
                      title="Play song"
                    >
                      ▶️
                    </button>
                  </div>
                </div>

                {/* Song Info */}
                <div className="song-info">
                  <div className="mood-badge">
                    <span className="mood-emoji">{getMoodEmoji(song.mood)}</span>
                    <span className="mood-text">{song.mood}</span>
                  </div>
                  <h3 className="song-title">{song.title}</h3>
                  <p className="song-source">📤 Your Upload</p>
                </div>

                {/* Delete Button */}
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
        onCancel={() =>
          setDeleteModal({ isOpen: false, song: null, typedTitle: '' })
        }
      />

      <AddSongModal
        isOpen={showAddSongModal}
        onClose={() => setShowAddSongModal(false)}
        onSongAdded={() => {
          setShowAddSongModal(false)
          fetchUserSongs()
        }}
      />
    </>
  )
}

export default MyPlaylist
