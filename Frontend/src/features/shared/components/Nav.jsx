import React from 'react'
import { useNavigate } from 'react-router'
import { useUser } from '../../User/hooks/useUser'
import DefaultAvatar from './DefaultAvatar'
import '../style/navbar.scss'

const Nav = ({ onAddSongClick }) => {
  const navigate = useNavigate()
  const { user } = useUser()
  const profileImage = user?.profilePicture

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <span className="logo-text">
            <img src="/logo.png" alt="" /> Vibee
          </span>
        </div>

        <div className="navbar-actions">
          <button className="action-btn add-song-btn" onClick={onAddSongClick}>
            <span className="btn-icon">➕</span>
            <span className="btn-text">Add Song</span>
          </button>
          <button className="action-btn playlist-btn" onClick={() => navigate('/my-playlist')}>
            <span className="btn-icon">📋</span>
            <span className="btn-text">My Playlist</span>
          </button>
        </div>

        <div className="navbar-user">
          <button className="user-button" onClick={() => navigate('/profile')}>
            {profileImage ? (
              <img 
                src={profileImage} 
                alt="Profile" 
                className="profile-avatar"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            ) : (
              <DefaultAvatar name={user?.username} size="md" />
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default React.memo(Nav)