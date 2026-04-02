import React from 'react'
import '../style/default-avatar.scss'

const DefaultAvatar = ({ name, size = 'md', className = '' }) => {
  // Get initials from name
  const getInitials = (text) => {
    if (!text) return '?'
    return text
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Generate consistent color based on name using hash
  const getColorFromName = (text) => {
    if (!text) text = 'user'
    let hash = 0
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
      '#F7DC6F', '#BB8FCE', '#85C1E2', '#FAD7A0', '#F8B195',
      '#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'
    ]
    
    return colors[Math.abs(hash) % colors.length]
  }

  const initials = getInitials(name)
  const backgroundColor = getColorFromName(name)

  return (
    <div
      className={`default-avatar ${size} ${className}`}
      style={{
        backgroundColor,
      }}
      title={name}
    >
      <span className="avatar-initials">{initials}</span>
    </div>
  )
}

export default DefaultAvatar
