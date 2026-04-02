import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../Auth/hook/useAuth'
import { updateProfile, getUserStats } from '../../Auth/services/profile.api'
import DefaultAvatar from '../components/DefaultAvatar'
import '../style/profile.scss'
import Navbar from '../components/Navbar'
import MobileSidebar from '../components/MobileSidebar'
import AddSongModal from '../components/AddSongModal'

const Profile = () => {
  const navigate = useNavigate()
  const { User } = useAuth()
  const [profileData, setProfileData] = useState({
    fullName: User?.fullName || '',
    profilePicture: User?.profilePicture || null,
  })
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [showAddSongModal, setShowAddSongModal] = useState(false)

  useEffect(() => {
    if (!User) {
      navigate('/login')
      return
    }
    fetchUserStats()
    setProfileData({
      fullName: User?.fullName || '',
      profilePicture: User?.profilePicture || null,
    })
  }, [User])

  const fetchUserStats = async () => {
    try {
      setLoading(true)
      const response = await getUserStats()
      setStats(response.stats)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateUsername = (name) => {
    if (!name) return `@${User?.username}`
    return `@${name.toLowerCase().replace(/\s+/g, '')}${Math.floor(Math.random() * 100)}`
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    const reader = new FileReader()
    reader.onloadend = async () => {
      try {
        const imageData = reader.result
        await updateProfile(profileData.fullName, imageData)
        setProfileData(prev => ({
          ...prev,
          profilePicture: imageData
        }))
      } catch (error) {
        console.error('Error uploading image:', error)
        alert('Failed to upload image')
      } finally {
        setUploadingImage(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSaveProfile = async () => {
    try {
      await updateProfile(profileData.fullName, profileData.profilePicture)
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile')
    }
  }

  const formatDate = (date) => {
    const d = new Date(date)
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const day = days[d.getDay()]
    const date_str = d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
    const time = d.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
    return `${day}, ${date_str} at ${time}`
  }

  const getMoodColor = (mood) => {
    switch(mood) {
      case 'Happy':
        return '#FFD700'
      case 'Sad':
        return '#4169E1'
      case 'Surprised':
        return '#FF69B4'
      default:
        return '#999'
    }
  }

  if (!User) {
    return null
  }

  return (
    <>
      <div className="desktop-navbar-wrapper">
        <Navbar onAddSongClick={() => setShowAddSongModal(true)} />
      </div>
      <MobileSidebar onAddSongClick={() => setShowAddSongModal(true)} />
      <div className="profile-container">
        <div className="profile-card">
          {/* Profile Header */}
          <div className="profile-header">
            {/* Profile Picture Section */}
            <div className="profile-picture-section">
              <div className="profile-picture-wrapper">
                {profileData.profilePicture ? (
                  <img 
                    src={profileData.profilePicture} 
                    alt="Profile" 
                    className="profile-picture"
                  />
                ) : (
                  <DefaultAvatar 
                    name={profileData.fullName || User?.username}
                    size="xxl"
                    className="profile-picture-default"
                  />
                )}
                <label className="upload-button">
                  {uploadingImage ? (
                    <span className="uploading">Uploading...</span>
                  ) : (
                    <>
                      <span>📷</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                    </>
                  )}
                </label>
              </div>

              {/* User Info Section */}
              <div className="user-info">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        fullName: e.target.value
                      }))}
                      className="edit-input fullname-input"
                      placeholder="Enter your name"
                    />
                    <div className="buttons-group">
                      <button className="save-btn" onClick={handleSaveProfile}>Save</button>
                      <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="user-name">{profileData.fullName || 'Add your name'}</h2>
                    <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
                  </>
                )}
                <p className="username">{generateUsername(profileData.fullName)}</p>
              </div>
            </div>
          </div>

          {/* Vibe Section */}
          <div className="vibe-section">
            <h3 className="section-title">📊 Your Vibe</h3>
            
            {loading ? (
              <div className="loading">Loading your stats...</div>
            ) : stats ? (
              <>
                {/* Total Songs */}
                <div className="total-songs">
                  <div className="stat-card">
                    <div className="stat-number">{stats.totalSongs}</div>
                    <div className="stat-label">Total Songs Added</div>
                  </div>
                </div>

                {/* Mood Breakdown */}
                <div className="mood-breakdown">
                  <h4 className="breakdown-title">Mood Distribution</h4>
                  <div className="moods-grid">
                    {['Happy', 'Sad', 'Surprised'].map(mood => (
                      <div key={mood} className="mood-card">
                        <div className="mood-header">
                          <span className="mood-name">{mood}</span>
                          <span className="mood-count">{stats.moods[mood]}</span>
                        </div>
                        <div className="mood-bar">
                          <div 
                            className="mood-progress" 
                            style={{
                              width: `${stats.moodPercentages[mood]}%`,
                              backgroundColor: getMoodColor(mood)
                            }}
                          />
                        </div>
                        <div className="mood-percentage">{stats.moodPercentages[mood]}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="no-stats">No stats available yet</div>
            )}
          </div>

          {/* History Section */}
          <div className="history-section">
            <h3 className="section-title">📅 Activity History</h3>
            
            {loading ? (
              <div className="loading">Loading history...</div>
            ) : stats?.history && stats.history.length > 0 ? (
              <div className="history-list">
                {stats.history.map((item, index) => (
                  <div key={index} className="history-item">
                    <div className="history-icon">
                      {item.type === 'uploaded' ? '⬆️' : '▶️'}
                    </div>
                    <div className="history-content">
                      <div className="history-action">
                        <span className="action-type">
                          {item.type === 'uploaded' ? 'Uploaded' : 'Listened to'}
                        </span>
                        <span className="song-title">{item.songTitle || 'Unknown Song'}</span>
                      </div>
                      <div className="history-details">
                        <span className="mood-badge" style={{
                          backgroundColor: getMoodColor(item.mood),
                          color: 'white'
                        }}>
                          {item.mood}
                        </span>
                        <span className="history-date">{formatDate(item.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-history">
                <p>No activity history yet</p>
                <p className="hint">Your uploads and listens will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AddSongModal
        isOpen={showAddSongModal}
        onClose={() => setShowAddSongModal(false)}
        onSongAdded={() => setShowAddSongModal(false)}
      />
    </>
  )
}

export default Profile
