import React from 'react'
import Webcam from 'react-webcam'
import './CameraView.scss'

function CameraView({ webcamRef, canvasRef }) {
  return (
    <div className="camera-container">
      <Webcam
        ref={webcamRef}
        mirrored
        width={640}
        height={480}
        className="camera-video"
      />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="camera-canvas"
      />
    </div>
  )
}

export default CameraView
