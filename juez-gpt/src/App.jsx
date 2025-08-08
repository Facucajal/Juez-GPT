import React, { useRef, useState } from 'react'
import CameraView from './components/CameraView'
import { usePoseDetection } from './hooks/usePoseDetection'
import { drawKeypointsAndSkeleton } from './utils/drawUtils'
import { detectSquat } from './exercices/squat'

function App() {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)
  const [reps, setReps] = useState(0)
  const [lastPosition, setLastPosition] = useState('up')
  const lastPositionRef = useRef('up')

  const updateLastPosition = (pos) => {
    lastPositionRef.current = pos
    setLastPosition(pos)
  }

  usePoseDetection(webcamRef, (keypoints) => {
    const ctx = canvasRef.current.getContext('2d')
    ctx.save()
    ctx.scale(-1, 1)
    ctx.translate(-640, 0)
    drawKeypointsAndSkeleton(ctx, keypoints)
    ctx.restore()

    detectSquat(keypoints, lastPositionRef, updateLastPosition, setReps)
  })

  return (
    <>
      <div className="reps-counter">Repeticiones: <span>{reps}</span></div>
      <CameraView webcamRef={webcamRef} canvasRef={canvasRef} />
    </>
  )
}

export default App
