import React from 'react'
import '../style/delete-confirmation-modal.scss'

const DeleteConfirmationModal = ({
  isOpen,
  song,
  typedTitle,
  onTypedTitleChange,
  onConfirm,
  onCancel
}) => {
  if (!isOpen || !song) return null

  const isMatchingTitle = typedTitle === song.title

  return (
    <>
      <div className="confirm-modal-overlay" onClick={onCancel} />
      <div className="delete-confirmation-modal">
        <div className="modal-content">
          <div className="warning-icon">⚠️</div>
          <h2>Delete Song?</h2>
          <p className="warning-message">
            This action cannot be undone. The song will be permanently removed from your playlist and database.
          </p>

          <div className="song-details">
            <p><strong>Song Title:</strong> {song.title}</p>
            <p><strong>Mood:</strong> {song.mood}</p>
          </div>

          <div className="confirmation-input">
            <p className="instruction">
              Type the song title below to confirm deletion:
            </p>
            <code className="song-title-display">{song.title}</code>
            <input
              type="text"
              value={typedTitle}
              onChange={(e) => onTypedTitleChange(e.target.value)}
              placeholder="Type song title here..."
              className={`confirmation-input-field ${isMatchingTitle ? 'match' : ''}`}
            />
            {typedTitle && !isMatchingTitle && (
              <p className="error-text">❌ Title does not match. Please type exactly: {song.title}</p>
            )}
            {isMatchingTitle && (
              <p className="success-text">✓ Title matches. Ready to delete.</p>
            )}
          </div>

          <div className="modal-buttons">
            <button className="cancel-btn" onClick={onCancel}>
              Keep Song
            </button>
            <button
              className={`delete-btn ${isMatchingTitle ? 'enabled' : 'disabled'}`}
              onClick={onConfirm}
              disabled={!isMatchingTitle}
            >
              Delete Permanently
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default DeleteConfirmationModal