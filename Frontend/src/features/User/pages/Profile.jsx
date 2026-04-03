// import React, { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router'
// import { useAuth } from '../../Auth/hook/useAuth'
// import axios from 'axios' // Axios import karo direct API calls ke liye
// import DefaultAvatar from '../../shared/components/DefaultAvatar'
// import Navbar from '../components/Navbar'
// import MobileSidebar from '../../shared/components/MobileSidebar'
// import AddSongModal from '../components/AddSongModal'
// import '../style/profile.scss'

// const Profile = () => {
//   const navigate = useNavigate()
//   const { User, setUser, handleGetMe } = useAuth() // setUser zaroori hai state update ke liye
//   const [stats, setStats] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [uploadingImage, setUploadingImage] = useState(false)
//   const [showAddSongModal, setShowAddSongModal] = useState(false)

//   // 1. Fetch User Stats on Mount
//   useEffect(() => {
//     if (!User) {
//       navigate('/login')
//       return
//     }

//     const fetchStats = async () => {
//       try {
//         setLoading(true)
//         // Apne actual stats endpoint se replace karein
//         const response = await axios.get('/api/songs/stats'); 
//         setStats(response.data.stats)
//       } catch (error) {
//         console.error('Error fetching stats:', error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchStats()
//   }, [User, navigate])

//   // 2. Image Upload Logic (Multipart/Form-Data for Multer)
//   const handleImageUpload = async (e) => {
//     const file = e.target.files?.[0]
//     if (!file) return

//     const formData = new FormData()
//     formData.append('profilePicture', file)

//     try {
//       setUploadingImage(true)
//       // Backend route: router.put('/update-profile', ...)
//       const res = await axios.put('/api/users/update-profile', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       })
      
//       setUser(res.data.user) // Global Auth State update karo
//       alert('Profile picture updated! 🔥')
//     } catch (error) {
//       console.error('Upload error:', error)
//       alert('Failed to upload image')
//     } finally {
//       setUploadingImage(false)
//     }
//   }

//   // 3. Helper: Format Date & Time (User Schema timestamps)
//   const formatDate = (date) => {
//     if (!date) return 'Just now'
//     const d = new Date(date)
//     return d.toLocaleDateString('en-US', { 
//       weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' 
//     }) + ' at ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//   }

//   if (!User) return null

//   return (
//     <div className="profile-page-wrapper">
//       <Navbar onAddSongClick={() => setShowAddSongModal(true)} />
//       <MobileSidebar onAddSongClick={() => setShowAddSongModal(true)} />

//       <div className="profile-container">
//         <div className="profile-card">
          
//           {/* Header Section */}
//           <div className="profile-header">
//             <div className="profile-picture-section">
//               <div className="profile-picture-wrapper">
//                 {User.profilePicture ? (
//                   <img src={User.profilePicture} alt="Profile" className="profile-picture" />
//                 ) : (
//                   <DefaultAvatar name={User.username} size="xxl" />
//                 )}
                
//                 <label className="upload-button">
//                   {uploadingImage ? "..." : "📷"}
//                   <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
//                 </label>
//               </div>

//               <div className="user-info">
//                 <h2 className="user-name">{User.username}</h2>
//                 <p className="user-email">{User.email}</p>
//                 <p className="member-since">Member since: {new Date(User.createdAt).getFullYear()}</p>
//               </div>
//             </div>
//           </div>

//           {/* Vibe/Stats Section */}
//           <div className="vibe-section">
//             <h3 className="section-title">📊 Your Vibe</h3>
//             <div className="stats-grid">
//               <div className="stat-card">
//                 <span className="stat-number">{User.songHistory?.length || 0}</span>
//                 <span className="stat-label">Songs Added</span>
//               </div>
//               {/* Add more stats here based on your logic */}
//             </div>
//           </div>

//           {/* History Section */}
//           <div className="history-section">
//             <h3 className="section-title">📅 Activity History</h3>
//             <div className="history-list">
//               {User.songHistory && User.songHistory.length > 0 ? (
//                 User.songHistory.slice().reverse().map((item, index) => (
//                   <div key={index} className="history-item">
//                     <div className="history-icon">🎵</div>
//                     <div className="history-content">
//                       <div className="history-action">
//                         <span className="action-type">Uploaded </span>
//                         <span className="song-title">{item.songTitle}</span>
//                       </div>
//                       <div className="history-details">
//                         <span className="mood-tag">{item.mood}</span>
//                         <span className="history-date">{formatDate(item.timestamp || item.createdAt)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="no-history">No activity yet. Start uploading!</div>
//               )}
//             </div>
//           </div>

//         </div>
//       </div>

//       <AddSongModal
//         isOpen={showAddSongModal}
//         onClose={() => setShowAddSongModal(false)}
//         onSongAdded={() => {
//            setShowAddSongModal(false);
//            // Optional: Refresh user data here
//         }}
//       />
//     </div>
//   )
// }

// export default Profile