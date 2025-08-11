import React, { useRef, useState } from 'react'
import CameraView from './components/CameraView'
import { usePoseDetection } from './hooks/usePoseDetection'
import { drawKeypointsAndSkeleton } from './utils/drawUtils'
import { detectSquat } from './exercices/squat'
import './styles/App.scss'

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

    usePoseDetection(webcamRef, canvasRef, (keypoints) => {
    // Dibujo alineado (maneja DPR, espejo y tamaños adentro)
    drawKeypointsAndSkeleton(webcamRef, canvasRef, keypoints)
    // Lógica de conteo
    detectSquat(keypoints, lastPositionRef, updateLastPosition, setReps)
  })

    return (
      <div className="app-container">
        <div className="reps-counter">
          Repeticiones: <span>{reps}</span>
        </div>
        <CameraView webcamRef={webcamRef} canvasRef={canvasRef} />
      </div>
  )
}

export default App
