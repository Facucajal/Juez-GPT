import React, { useMemo, useRef, useState } from 'react'
import CameraView from './components/CameraView/CameraView'
import { usePoseDetection } from './hooks/usePoseDetection'
import { drawKeypointsAndSkeleton } from './utils/drawUtils'
import { detectSquat } from './exercices/squat'
import './styles/App.scss'
import FooterBar from './components/FooterBar/FooterBar'

function App() {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)

  const [reps, setReps] = useState(0)
  const [lastPosition, setLastPosition] = useState('up')
  const lastPositionRef = useRef('up')

  // cámara: 'user' (frontal) o 'environment' (trasera)
  const [facingMode, setFacingMode] = useState('user')
  const mirrored = facingMode === 'user'

  const [showKeyPoints, setshowKeyPoints] = useState(true)
  const showedKeyPoints = showKeyPoints === true;

  const updateLastPosition = (pos) => {
    lastPositionRef.current = pos
    setLastPosition(pos)
  }

  const videoConstraints = useMemo(() => ({
    facingMode,
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 30 },
  }), [facingMode])

  const toggleCamera = () => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'))
  }

  const changeShowKeyPoints = () => {
    setshowKeyPoints(prev => (prev === true ? false : true))
  }

  const resetCounter = () => {
    setReps(0)
    updateLastPosition('up')
  }

  usePoseDetection(webcamRef, canvasRef, (keypoints) => {
    // Dibujo alineado (maneja DPR, espejo y tamaños adentro)
    if (showedKeyPoints) {
      drawKeypointsAndSkeleton(webcamRef, canvasRef, keypoints, { mirrored })
    }
    else {
      // limpiar el canvas por si quedó algo dibujado
      const c = canvasRef.current
      if (c) c.getContext('2d').clearRect(0, 0, c.width, c.height)
    }

    // Lógica de conteo
    detectSquat(keypoints, lastPositionRef, updateLastPosition, setReps)
  })

  return (
    <div className="app-container">
      <div className="reps-counter">
        Repeticiones: <span>{reps}</span>
      </div>
      <CameraView
        webcamRef={webcamRef}
        canvasRef={canvasRef}
        mirrored={mirrored}
        videoConstraints={videoConstraints}
        webcamKey={facingMode}
      />
      <FooterBar
        onToggleCamera={toggleCamera}
        onReset={resetCounter}
        showedKeyPoints = {showedKeyPoints}
        onChangeShowKeyPoints={changeShowKeyPoints}
      />
    </div>
  )
}

export default App
