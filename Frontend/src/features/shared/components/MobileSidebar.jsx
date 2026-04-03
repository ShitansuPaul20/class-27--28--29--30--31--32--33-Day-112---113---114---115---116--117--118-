import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../Auth/hook/useAuth'
import DefaultAvatar from './DefaultAvatar'
import '../style/mobile-sidebar.scss'

const MobileSidebar = ({ onAddSongClick }) => {
  const navigate = useNavigate()
  const { User } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const profileImage = User?.profilePicture;

  const handleNavigation = (path, callback) => {
    setIsOpen(false)
    if (callback) {
      callback()
    } else {
      navigate(path)
    }
  }

  return (
    <>
      <div className="mobile-navbar">
        <div className="mobile-navbar-container">
          {/* Logo */}
          <div className="mobile-navbar-logo" onClick={() => navigate('/')}>
            <span className="logo-text"><img src="../../../../Untitled design (6).png" alt="" /> Vibee</span>
          </div>

          {/* Menu Button */}
          <button
            className={`menu-toggle ${isOpen ? 'active' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* User Icon */}
          <button
            className="user-icon-btn"
            onClick={() => navigate('/profile')}
          >
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="profile-avatar" />
            ) : (
              <DefaultAvatar
                name={User?.fullName || User?.username}
                size="sm"
                className="profile-avatar-default"
              />
            )}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`mobile-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <nav className="sidebar-nav">
            <button
              className="nav-item add-song-item"
              onClick={() => handleNavigation(null, onAddSongClick)}
            >
              <span className="item-icon">➕</span>
              <span className="item-text">Add Song</span>
            </button>

            <button
              className="nav-item playlist-item"
              onClick={() => handleNavigation('/my-playlist')}
            >
              <span className="item-icon">📋</span>
              <span className="item-text">My Playlist</span>
            </button>

            <button
              className="nav-item profile-item"
              onClick={() => handleNavigation('/profile')}
            >
              <span className="item-icon">👤</span>
              <span className="item-text">Profile</span>
            </button>

            <button
              className="nav-item home-item"
              onClick={() => handleNavigation('/')}
            >
              <span className="item-icon">🏠</span>
              <span className="item-text">Home</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}

export default MobileSidebar