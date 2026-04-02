import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../Auth/hook/useAuth'
import DefaultAvatar from './DefaultAvatar'
import '../style/navbar.scss'

const Navbar = ({ onAddSongClick }) => {
  const navigate = useNavigate()
  const { User } = useAuth()
  const [profileImage, setProfileImage] = useState(User?.profilePicture || null)

  const handleProfileClick = () => {
    navigate('/profile')
  }

  const handlePlaylistClick = () => {
    navigate('/my-playlist')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <span className="logo-text"><img src="../../../../Untitled design (6).png" alt="" /> Vibee</span>
        </div>

        {/* Center Buttons */}
        <div className="navbar-actions">
          <button className="action-btn add-song-btn" onClick={onAddSongClick}>
            <span className="btn-icon">➕</span>
            <span className="btn-text">Add Song</span>
          </button>
          <button className="action-btn playlist-btn" onClick={handlePlaylistClick}>
            <span className="btn-icon">📋</span>
            <span className="btn-text">My Playlist</span>
          </button>
        </div>

        {/* User Icon */}
        <div className="navbar-user">
          <button className="user-button" onClick={handleProfileClick}>
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="profile-avatar" />
            ) : (
              <DefaultAvatar 
                name={User?.fullName || User?.username} 
                size="md" 
                className="profile-avatar-default"
              />
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
