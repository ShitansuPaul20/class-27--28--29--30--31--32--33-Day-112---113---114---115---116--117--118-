import React, { useState, useCallback, useMemo } from 'react'
import FaceExpression from '../../expression/components/FaceExpression'
import FullScreenPlayer from '../components/FullScreenPlayer'
import LoadingScreen from '../components/LoadingScreen'
import { useSong } from '../hook/useSong'
import Navbar from '../../shared/components/Navbar'
import MobileSidebar from '../../shared/components/MobileSidebar'
import AddSongModal from '../../shared/components/AddSongModal'
import '../style/home.scss'

const Home = () => {
  const [currentEmotion, setCurrentEmotion] = useState('smiling')
  const [isLoading, setIsLoading] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)
  const [showAddSongModal, setShowAddSongModal] = useState(false)
  
  const { handleGetSongWithUserSongs } = useSong()

  // Memoize the map to prevent it from being recreated
  const emotionToMoodMap = useMemo(() => ({
    smiling: 'Happy',
    surprised: 'Surprised',
    sorrow: 'Sad'
  }), [])

  // useCallback ka use karke re-render ko control kiya hai
  const handleEmotionChange = useCallback(async (emotions) => {
    // 1. Agar pehle se loading ya player on hai, toh function ko skip karo
    if (isLoading || showPlayer) return;

    let detectedEmotion = 'smiling'
    if (emotions.surprised) {
      detectedEmotion = 'surprised'
    } else if (emotions.sorrow) {
      detectedEmotion = 'sorrow'
    } else if (emotions.smiling) {
      detectedEmotion = 'smiling'
    }

    // 2. Sirf tabhi fetch karo jab emotion sach mein change ho
    if (detectedEmotion !== currentEmotion || !showPlayer) {
      setCurrentEmotion(detectedEmotion)
      setIsLoading(true)
      
      const mood = emotionToMoodMap[detectedEmotion]
      console.log(`Emotion: ${detectedEmotion} → Mood: ${mood}`)
      
      try {
        await handleGetSongWithUserSongs({ mood })
        
        // 3. Loading experience ke baad player show karo
        setTimeout(() => {
          setIsLoading(false)
          setShowPlayer(true)
        }, 2000)
      } catch (error) {
        console.error('Error loading songs:', error)
        setIsLoading(false)
      }
    }
  }, [isLoading, showPlayer, currentEmotion, emotionToMoodMap, handleGetSongWithUserSongs])

  const handleDetectAgain = useCallback(() => {
    setShowPlayer(false)
    setIsLoading(false) // Safety reset
  }, [])

  const handleAddSongSuccess = useCallback(() => {
    setShowAddSongModal(false)
  }, [])

  // Conditional Rendering
  if (isLoading) {
    return <LoadingScreen emotion={currentEmotion} />
  }

  if (showPlayer) {
    return <FullScreenPlayer currentEmotion={currentEmotion} onDetectAgain={handleDetectAgain} />
  }

  return (
    <>
      <div className="desktop-navbar-wrapper">
        <Navbar onAddSongClick={() => setShowAddSongModal(true)} />
      </div>

      <MobileSidebar onAddSongClick={() => setShowAddSongModal(true)} />

      <div className="home-container">
        <div className="home-detection-wrapper">
          {/* FaceExpression ab baar-baar trigger nahi karega */}
          <FaceExpression onEmotionChange={handleEmotionChange} />
        </div>
      </div>

      <AddSongModal
        isOpen={showAddSongModal}
        onClose={() => setShowAddSongModal(false)}
        onSongAdded={handleAddSongSuccess}
      />
    </>
  )
}

export default Home