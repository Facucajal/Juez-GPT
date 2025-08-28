import React, { useMemo, useRef, useState } from 'react'
import CameraView from './components/CameraView/CameraView'
import { usePoseDetection } from './hooks/usePoseDetection'
import { drawKeypointsAndSkeleton, drawLegsOverlay } from './utils/drawUtils'
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

  // HUD
  const [fps, setFps] = useState(0)
  const [angle, setAngle] = useState(null)
  const [legsDetected, setLegsDetected] = useState(false)

  const videoConstraints = useMemo(() => ({
    facingMode,
    width: { ideal: 640 },   // estable y rápido en móviles
    height: { ideal: 360 },
    frameRate: { ideal: 30 },
  }), [facingMode])


  const updateLastPosition = (pos) => {
    lastPositionRef.current = pos
    setLastPosition(pos)
  }

  const changeShowKeyPoints = () => {
    setshowKeyPoints(prev => (prev === true ? false : true))
  }

  const toggleCamera = () => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'))
  }

  const onReset = () => {
    setReps(0)
    updateLastPosition('up')
    const c = canvasRef.current
    if (c) c.getContext('2d').clearRect(0, 0, c.width, c.height)
  }

  usePoseDetection(webcamRef, canvasRef, (keypoints) => {

    // Lógica de conteo
    detectSquat(keypoints, lastPositionRef, updateLastPosition, setReps, setAngle, setLegsDetected )

    // Dibujo alineado (maneja DPR, espejo y tamaños adentro)
    if (showedKeyPoints) {
      drawLegsOverlay(webcamRef, canvasRef, keypoints, angle, { mirrored })
    }
    else {
      // limpiar el canvas por si quedó algo dibujado
      const c = canvasRef.current
      if (c) c.getContext('2d').clearRect(0, 0, c.width, c.height)
    }
  }, { onFps: setFps, targetFps: 24 })

  return (
    <div className="app-container">
      {/* HUD */}
      <div className="hud">
        <span className={`status-dot ${legsDetected ? 'ok' : 'no'}`} />
        <span className="angle-chip">{angle != null ? `${angle}°` : '--°'}</span>
        <span className="fps-badge">{fps} FPS</span>
      </div>

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
        onReset={onReset}
        showedKeyPoints={showedKeyPoints}
        onChangeShowKeyPoints={changeShowKeyPoints}
      />
    </div>
  )
}

export default App
