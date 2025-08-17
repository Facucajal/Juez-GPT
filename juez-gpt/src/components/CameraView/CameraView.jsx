import React, { useEffect } from 'react'
import Webcam from 'react-webcam'
import './CameraView.scss'

function CameraView({ webcamRef, canvasRef, mirrored, videoConstraints, webcamKey }) {
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
        key={webcamKey}
        ref={webcamRef}
        mirrored={mirrored}
        audio={false}
        videoConstraints={videoConstraints}
        className="camera-video"
      />
      <canvas ref={canvasRef} className="camera-canvas" />
        <div className="camera-gradient-top" />
        <div className="camera-gradient-bottom" />
        <div className="camera-ui">{/* botones, contador, etc. */}</div>
    </div>
  )
}

export default CameraView
