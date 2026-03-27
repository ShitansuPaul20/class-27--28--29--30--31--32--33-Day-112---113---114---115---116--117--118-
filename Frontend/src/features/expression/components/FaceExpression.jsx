import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import '../../../index.css';
import { captureExpression } from "../utils/utils";

const FaceExpression = () => {
  const webcamRef = useRef(null);
  const [faceLandmarker, setFaceLandmarker] = useState(null);
  const [currentEmotions, setCurrentEmotions] = useState({
    smiling: false,
    surprised: false,
    sorrow: false,
  });

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
      } catch (error) {
        console.error("Error initializing the model:", error);
      }
    };

    initializeModel();
  }, []);

  const handleCaptureExpression = () => {
    captureExpression(faceLandmarker, webcamRef, setCurrentEmotions);
  };

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", marginTop: "20px" }}>
      <Webcam
        ref={webcamRef}
        audio={false}
        style={{ width: "640px", height: "480px", borderRadius: "8px" }}
        videoConstraints={{ facingMode: "user" }}
      />

      <button
        onClick={handleCaptureExpression}
        disabled={!faceLandmarker}
        style={{
          padding: "12px 24px",
          fontSize: "18px",
          backgroundColor: faceLandmarker ? "#3b82f6" : "#9ca3af",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: faceLandmarker ? "pointer" : "not-allowed",
          fontWeight: "bold",
        }}
      >
        {faceLandmarker ? "Detect Expression Now" : "Loading Model..."}
      </button>

      <div style={{ background: "#1f2937", color: "#fff", padding: "20px", borderRadius: "8px", fontFamily: "sans-serif", width: "300px", textAlign: "center" }}>
        <h3 style={{ margin: "0 0 15px 0" }}>Last Detected Emotion:</h3>
        <div style={{ fontSize: "20px" }}>
          <p style={{ margin: "8px 0", color: currentEmotions.smiling ? "#4ade80" : "white" }}>
            Smiling: {currentEmotions.smiling ? "Yes 😊" : "No"}
          </p>
          <p style={{ margin: "8px 0", color: currentEmotions.surprised ? "#facc15" : "white" }}>
            Surprised: {currentEmotions.surprised ? "Yes 😲" : "No"}
          </p>
          <p style={{ margin: "8px 0", color: currentEmotions.sorrow ? "#60a5fa" : "white" }}>
            Sorrow: {currentEmotions.sorrow ? "Yes 😔" : "No"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FaceExpression;