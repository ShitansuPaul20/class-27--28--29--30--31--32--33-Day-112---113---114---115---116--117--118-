import React, { useState } from 'react'
import FaceExpression from '../../expression/components/FaceExpression'
import FullScreenPlayer from '../components/FullScreenPlayer'
import LoadingScreen from '../components/LoadingScreen'
import { useSong } from '../hook/useSong'
import '../style/home.scss'
import Nav from '../../shared/components/Nav'


const emotionToMoodMap = {
  smiling: 'Happy',
  surprised: 'Surprised',
  sorrow: 'Sad'
}

const Home = () => {
  const [currentEmotion, setCurrentEmotion] = useState('smiling')
  const [isLoading, setIsLoading] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)
  const { handleGetSong } = useSong()

  const handleEmotionChange = async (emotions) => {
    let detectedEmotion = 'smiling'
    
    if (emotions.surprised) {
      detectedEmotion = 'surprised'
    } else if (emotions.sorrow) {
      detectedEmotion = 'sorrow'
    } else if (emotions.smiling) {
      detectedEmotion = 'smiling'
    }

    setCurrentEmotion(detectedEmotion)
    setIsLoading(true)
    
    // Map emotion to mood and fetch songs
    const mood = emotionToMoodMap[detectedEmotion]
    console.log(`Emotion detected: ${detectedEmotion} → Fetching ${mood} songs`)
    
    try {
      await handleGetSong({ mood })
    } catch (error) {
      console.error('Error loading songs:', error)
    }
    
    // Show loading screen then player
    setTimeout(() => {
      setIsLoading(false)
      setShowPlayer(true)
    }, 5000)
  }

  const handleDetectAgain = () => {
    setShowPlayer(false)
    setCurrentEmotion('smiling')
  }

  if (isLoading) {
    return <LoadingScreen emotion={currentEmotion} />
  }

  if (showPlayer) {
    return <FullScreenPlayer currentEmotion={currentEmotion} onDetectAgain={handleDetectAgain} />
  }

  return (
    <>
    
    <div className="home-container">
      <div className="home-detection-wrapper">
        <FaceExpression onEmotionChange={handleEmotionChange} />
      </div>
    </div>
    </>
  )
}

export default Home