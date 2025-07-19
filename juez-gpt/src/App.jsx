import React, { useRef, useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import * as posedetection from '@tensorflow-models/pose-detection'
import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-backend-webgl'
import CameraView from './components/CameraView'

function App() {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)

  const [reps, setReps] = useState(0)
  const [lastPosition, setLastPosition] = useState('up')
  const lastPositionRef = useRef('up')

  useEffect(() => {
    const run = async () => {
      // le indica a TensorFlow que use la GPU del navegador
      await tf.setBackend('webgl')
      await tf.ready()

      //Crea el detector de poses usando el modelo MoveNet en modo rápido (Lightning).
      const detector = await posedetection.createDetector(
        posedetection.SupportedModels.MoveNet,
        {
          modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING
        }
      )
      //Verifica que la webcam está lista.
      const detect = async () => {
        if (
          webcamRef.current &&
          webcamRef.current.video.readyState === 4
        ) {
          const video = webcamRef.current.video
          const poses = await detector.estimatePoses(video)

          if (poses.length > 0) {
            const keypoints = poses[0].keypoints
            drawKeypointsAndSkeleton(keypoints)
            detectSquat(keypoints, setReps)
          }
        }

        requestAnimationFrame(detect)
      }

      detect()
    }

    run()
  }, [])


  const drawKeypointsAndSkeleton = (keypoints) => {
    //contexto de dibujo 2D del canvas
    const ctx = canvasRef.current.getContext('2d')
    ctx.save() // Guarda el estado original

    //Limpia e invierte horizontalmente el canvas para coincidir con el video mirrored
    ctx.clearRect(0, 0, 640, 480)
    ctx.scale(-1, 1)
    ctx.translate(-640, 0) // el -640 depende del ancho del canvas

    ctx.fillStyle = 'red'
    ctx.strokeStyle = 'lime'
    ctx.lineWidth = 2

    // Dibujar puntos
    keypoints.forEach((kp) => {
      if (kp.score > 0.5) {
        ctx.beginPath()
        ctx.arc(kp.x, kp.y, 5, 0, 2 * Math.PI)
        ctx.fill()
      }
    })

    // Dibujar esqueleto
    const connections = [
      ['left_shoulder', 'left_elbow'],
      ['left_elbow', 'left_wrist'],
      ['right_shoulder', 'right_elbow'],
      ['right_elbow', 'right_wrist'],
      ['left_shoulder', 'right_shoulder'],
      ['left_shoulder', 'left_hip'],
      ['right_shoulder', 'right_hip'],
      ['left_hip', 'right_hip'],
      ['left_hip', 'left_knee'],
      ['left_knee', 'left_ankle'],
      ['right_hip', 'right_knee'],
      ['right_knee', 'right_ankle'],
    ]

    const keypointMap = Object.fromEntries(keypoints.map(kp => [kp.name, kp]))

    connections.forEach(([a, b]) => {
      const kpA = keypointMap[a]
      const kpB = keypointMap[b]
      if (kpA && kpB && kpA.score > 0.5 && kpB.score > 0.5) {
        ctx.beginPath()
        ctx.moveTo(kpA.x, kpA.y)
        ctx.lineTo(kpB.x, kpB.y)
        ctx.stroke()
      }
    })

    // Visualización del ángulo de la pierna izquierda
    const hip = keypointMap['left_hip']
    const knee = keypointMap['left_knee']
    const ankle = keypointMap['left_ankle']

    if (hip && knee && ankle && hip.score > 0.5 && knee.score > 0.5 && ankle.score > 0.5) {
      // Dibujar los vectores
      ctx.strokeStyle = 'orange'
      ctx.beginPath()
      ctx.moveTo(knee.x, knee.y)
      ctx.lineTo(hip.x, hip.y)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(knee.x, knee.y)
      ctx.lineTo(ankle.x, ankle.y)
      ctx.stroke()

      // Calcular y mostrar el ángulo
      const angle = getAngle(hip, knee, ankle).toFixed(1)

      ctx.fillStyle = 'black'
      ctx.font = '18px Arial'
      ctx.fillStyle = angle < 90 ? 'red' : 'green'
     // Mostrar texto sin espejo
      ctx.save()
      ctx.scale(-1, 1) // invertir de nuevo para corregir el espejo
      ctx.fillText(`Ángulo: ${angle}°`, -knee.x - 10, knee.y - 10) // 👈 x con signo invertido
      ctx.restore()
    }

    ctx.restore() // Vuelve a la orientación original
}

const getAngle = (a, b, c) => {
  const ab = { x: a.x - b.x, y: a.y - b.y }
  const cb = { x: c.x - b.x, y: c.y - b.y }
  const dot = ab.x * cb.x + ab.y * cb.y
  const magAB = Math.hypot(ab.x, ab.y)
  const magCB = Math.hypot(cb.x, cb.y)
  const angleRad = Math.acos(dot / (magAB * magCB))
  return (angleRad * 180) / Math.PI || 180
}

const detectSquat = (keypoints, setReps) => {
  const hip = keypoints.find(p => p.name === 'left_hip')
  const knee = keypoints.find(p => p.name === 'left_knee')
  const ankle = keypoints.find(p => p.name === 'left_ankle')

  if (hip && knee && ankle && hip.score > 0.5 && knee.score > 0.5 && ankle.score > 0.5) {
    const angle = getAngle(hip, knee, ankle)

    if (angle < 90 && lastPositionRef.current === 'up') {
      updateLastPosition('down')
    }

    if (angle > 160 && lastPositionRef.current === 'down') {
      updateLastPosition('up')
      setReps(prev => prev + 1)
    }
  }
}

const updateLastPosition = (newPos) => {
  lastPositionRef.current = newPos
  setLastPosition(newPos)
}

  return (
    <>
      <div className="reps-counter">
      Repeticiones: <span>{reps}</span>
      </div>
      <CameraView webcamRef={webcamRef} canvasRef={canvasRef} />
    </>
  )
}

export default App
