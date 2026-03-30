import Webcam from "react-webcam";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";


// Fixed and optimized utility functions for better performance and readability

const detectSmile = (blendshapes) => {
  const getScore = (name) => {
    const shape = blendshapes.find((b) => b.categoryName === name);
    return shape ? shape.score : 0;
  };
  return getScore("mouthSmileLeft") > 0.001 && getScore("mouthSmileRight") > 0.001;
};

const detectSurprise = (blendshapes) => {
  const getScore = (name) => {
    const shape = blendshapes.find((b) => b.categoryName === name);
    return shape ? shape.score : 0;
  };
  const browsUp = getScore("browInnerUp") > 0.1;
  const eyesWide = getScore("eyeWideLeft") > 0.1 || getScore("eyeWideRight") > 0.1;
  return browsUp && eyesWide;
};

const detectSorrow = (blendshapes) => {
  const getScore = (name) => {
    const shape = blendshapes.find((b) => b.categoryName === name);
    return shape ? shape.score : 0;
  };

  const frownLeft = getScore("mouthFrownLeft");
  const frownRight = getScore("mouthFrownRight");
  const browsUp = getScore("browInnerUp");

  const isFrowning = frownLeft > 0.001 && frownRight > 0.001;
  const isDistressed = browsUp > 0.01;
  return isFrowning && isDistressed;
};

const captureExpression = (faceLandmarker, webcamRef, setCurrentEmotions, onEmotionChange) => {
  if (
    faceLandmarker &&
    webcamRef.current &&
    webcamRef.current.video &&
    webcamRef.current.video.readyState === 4
  ) {
    const video = webcamRef.current.video;
    const startTimeMs = performance.now();

    const results = faceLandmarker.detectForVideo(video, startTimeMs);

    if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
      const blendshapes = results.faceBlendshapes[0].categories;

      const isSmiling = detectSmile(blendshapes);
      const isSurprised = detectSurprise(blendshapes);
      const isSorrow = detectSorrow(blendshapes);

      const emotions = {
        smiling: isSmiling,
        surprised: isSurprised,
        sorrow: isSorrow,
      };

      setCurrentEmotions(emotions);
      
      if (onEmotionChange) {
        onEmotionChange(emotions);
      }

      console.log("Expressions captured successfully!");
    } else {
      console.log("No face detected in this frame.");
      const emotions = { smiling: false, surprised: false, sorrow: false };
      setCurrentEmotions(emotions);
      if (onEmotionChange) {
        onEmotionChange(emotions);
      }
    }
  } else {
    console.log("Model or Camera is not ready yet.");
  }
};

export { detectSmile, detectSurprise, detectSorrow, captureExpression };
