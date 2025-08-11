import React, { useEffect } from 'react'
import Webcam from 'react-webcam'
import './CameraView.scss'

function CameraView({ webcamRef, canvasRef }) {
  // iOS safari: ayuda a que el video se reproduzca inline
  useEffect(() => {
    const video = webcamRef.current?.video
    if (video) {
      video.setAttribute('playsinline', true)
      video.setAttribute('autoplay', true)
      video.setAttribute('muted', true)
    }
  }, [webcamRef])

  return (
    <div className="camera-container">
      <Webcam
        ref={webcamRef}
        mirrored
        className="camera-video"
        audio={false}
      />
      <canvas ref={canvasRef} className="camera-canvas" />
    </div>
  )
}

export default CameraView
