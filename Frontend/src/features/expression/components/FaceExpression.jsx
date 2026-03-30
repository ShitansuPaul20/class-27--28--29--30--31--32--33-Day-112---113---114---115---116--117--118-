import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import "../../shared/style/global.scss";
import { captureExpression } from "../utils/utils";
import "../style/face-expression.scss";

const FaceExpression = ({ onEmotionChange }) => {
  const webcamRef = useRef(null);
  const [faceLandmarker, setFaceLandmarker] = useState(null);
  const [currentEmotions, setCurrentEmotions] = useState({
    smiling: false,
    surprised: false,
    sorrow: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeModel = async () => {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
            delegate: "GPU",
          },
          outputFaceBlendshapes: true,
          runningMode: "VIDEO",
          numFaces: 1,
        });

        setFaceLandmarker(landmarker);
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing the model:", error);
        setIsLoading(false);
      }
    };

    initializeModel();
  }, []);

  const handleCaptureExpression = () => {
    captureExpression(faceLandmarker, webcamRef, setCurrentEmotions, onEmotionChange);
  };

  return (
    <div className="face-expression-container">
      <div className="face-expression-card">
        <h1 className="title">Let's detect your mood 🎵</h1>
        <p className="subtitle">Look at the camera and we'll read your expression</p>

        <div className="webcam-wrapper">
          {isLoading && (
            <div className="loading-overlay">
              <div className="spinner"></div>
              <p>Loading face detection model...</p>
            </div>
          )}
          <Webcam
            ref={webcamRef}
            audio={false}
            className="webcam-stream"
            videoConstraints={{ facingMode: "user" }}
          />
          <div className="webcam-border"></div>
        </div>

        <div className="emotion-status">
          <div className="status-item">
            <span className={currentEmotions.smiling ? "active" : ""}>😊 Smiling</span>
          </div>
          <div className="status-item">
            <span className={currentEmotions.surprised ? "active" : ""}>😲 Surprised</span>
          </div>
          <div className="status-item">
            <span className={currentEmotions.sorrow ? "active" : ""}>😢 Sad</span>
          </div>
        </div>

        <button
          onClick={handleCaptureExpression}
          disabled={!faceLandmarker || isLoading}
          className="btn-detect-expression"
        >
          <span className="btn-icon">✨</span>
          <span className="btn-text">
            {faceLandmarker ? "Detect My Mood" : "Loading..."}
          </span>
        </button>
      </div>
    </div>
  );
};

export default FaceExpression;