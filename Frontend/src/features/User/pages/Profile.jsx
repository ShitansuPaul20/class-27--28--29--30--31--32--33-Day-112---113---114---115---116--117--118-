import AddSongModal from '../../shared/components/AddSongModal'
import React, { useState, useEffect } from 'react'
import DefaultAvatar from '../../shared/components/DefaultAvatar'
import { useUser } from '../hooks/useUser'
import '../style/profile.scss'

const Profile = ({ songAddedTrigger = 0 }) => {
  const { user, loading, handleGetMe, handleUpdateProfile, handleUserStats, handleUserHistory } = useUser()

  const [stats, setStats] = useState(null)
  const [history, setHistory] = useState([])
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    handleGetMe()
  }, [])

  const fetchData = async () => {
    const statsData = await handleUserStats()
    setStats(statsData)
    const historyData = await handleUserHistory()
    setHistory(historyData || [])
  }

  useEffect(() => {
    if (!user) return
    fetchData()
  }, [user, songAddedTrigger])

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      await handleUpdateProfile(file)
    } catch (err) {
      console.error('Upload error:', err)
    } finally {
      setUploadingImage(false)
    }
  }

  const formatDate = (date) => {
    if (!date) return 'Just now'
    const d = new Date(date)
    return (
      d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }) +
      ' at ' +
      d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    )
  }

  const moodConfig = [
    { key: 'Happy',     color: '#EF9F27', track: 'rgba(239,159,39,0.2)' },
    { key: 'Sad',       color: '#378ADD', track: 'rgba(55,138,221,0.2)' },
    { key: 'Surprised', color: '#7F77DD', track: 'rgba(127,119,221,0.2)' },
  ]

  const RingChart = ({ pct, color, track, label }) => {
    const size = 76, stroke = 7, r = (size - stroke) / 2
    const circ = 2 * Math.PI * r
    const dash = (pct / 100) * circ
    return (
      <div className="ring-item">
        <div className="ring-svg-wrap">
          <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
            <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
              strokeWidth={stroke} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
          </svg>
          <span className="ring-center-pct" style={{ color }}>{pct}%</span>
        </div>
        <span className="ring-label">{label}</span>
      </div>
    )
  }

  if (loading && !user) return <div className="loading">Loading...</div>
  if (!user) return null

  return (
    <div className="profile-page-wrapper">
      <div className="profile-container">
        <div className="profile-card">

          <div className="profile-header">
            <div className="profile-picture-section">
              <div className="profile-picture-wrapper">
                {user.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt="Profile" 
                    className="profile-picture"
                    onError={(e) => { e.target.style.display = 'none' }} 
                  />
                ) : (
                  <DefaultAvatar name={user.username} size="xxl" />
                )}
                <label className="upload-button">
                  {uploadingImage ? '⏳' : '📷'}
                  <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>
              <div className="user-info">
                <h2 className="user-name">{user.username}</h2>
                <p className="user-email">{user.email}</p>
                <span className="user-role-badge">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="vibe-section">
            <h3 className="section-title">📊 Your Vibe</h3>
            {stats ? (
              <div className="vibe-flex">
                <div className="mood-rings">
                  {moodConfig.map(({ key, color, track }) => (
                    <RingChart
                      key={key}
                      pct={stats.moodPercentages[key]}
                      color={color}
                      track={track}
                      label={key}
                    />
                  ))}
                </div>
                <div className="stats-col">
                  <div className="stat-row">
                    <span className="stat-row-label">🎵 Total Songs</span>
                    <span className="stat-row-val">{stats.totalSongs}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-row-label">⬆️ Uploaded</span>
                    <span className="stat-row-val">{stats.totalUploaded}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-row-label">🎧 Listened</span>
                    <span className="stat-row-val">{stats.totalListened}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="loading-text">Loading stats...</p>
            )}
          </div>

          <div className="history-section">
            <h3 className="section-title">📅 Activity History</h3>
            <div className="history-list">
              {history.length > 0 ? (
                history.map((item, index) => (
                  <div key={item._id || index} className="history-item">
                    <div className="history-icon">🎵</div>
                    <div className="history-content">
                      <div className="history-action">
                        <span className="action-type">
                          {item.type === 'uploaded' ? 'Uploaded' : 'Listened to'}
                        </span>
                        <span className="song-title">{item.songTitle}</span>
                      </div>
                      <div className="history-details">
                        <span className="mood-tag">{item.mood}</span>
                        <span className="history-date">{formatDate(item.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-history">No activity yet. Start uploading!</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Profile