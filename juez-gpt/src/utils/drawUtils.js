import { getAngle } from "./mathUtils"

export const drawKeypointsAndSkeleton = (webcamRef, canvasRef, keypoints, opts) => {
  const { mirrored = true } = opts
  const video = webcamRef.current.video
  const canvas = canvasRef.current
  const ctx = canvas.getContext('2d')

  const vw = video.videoWidth
  const vh = video.videoHeight
  const dpr = window.devicePixelRatio || 1

  ctx.save()
  // dibujamos en coordenadas “CSS px”
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, vw, vh)

  if (mirrored) {
    ctx.translate(vw, 0)
    ctx.scale(-1, 1)
  }

  // estilos
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

  // Conexiones del esqueleto
  const connections = [
    ['left_shoulder', 'left_elbow'], ['left_elbow', 'left_wrist'],
    ['right_shoulder', 'right_elbow'], ['right_elbow', 'right_wrist'],
    ['left_shoulder', 'right_shoulder'], ['left_shoulder', 'left_hip'],
    ['right_shoulder', 'right_hip'], ['left_hip', 'right_hip'],
    ['left_hip', 'left_knee'], ['left_knee', 'left_ankle'],
    ['right_hip', 'right_knee'], ['right_knee', 'right_ankle']
  ]

  const keypointMap = Object.fromEntries(keypoints.map(kp => [kp.name, kp]))
  connections.forEach(([a, b]) => {
    const kpA = keypointMap[a], kpB = keypointMap[b]
    if (kpA?.score > 0.5 && kpB?.score > 0.5) {
      ctx.beginPath()
      ctx.moveTo(kpA.x, kpA.y)
      ctx.lineTo(kpB.x, kpB.y)
      ctx.stroke()


    }
  })

  // Visualización del ángulo de la pierna izquierda
  const left_hip = keypointMap['left_hip']
  const left_knee = keypointMap['left_knee']
  const left_ankle = keypointMap['left_ankle']

  if (left_hip && left_knee && left_ankle && left_hip.score > 0.5 && left_knee.score > 0.5 && left_ankle.score > 0.5) {
    // Dibujar los vectores
    ctx.strokeStyle = 'orange'
    ctx.beginPath()
    ctx.moveTo(left_knee.x, left_knee.y)
    ctx.lineTo(left_hip.x, left_hip.y)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(left_knee.x, left_knee.y)
    ctx.lineTo(left_ankle.x, left_ankle.y)
    ctx.stroke()

    // Calcular y mostrar el ángulo
    const angle = getAngle(left_hip, left_knee, left_ankle).toFixed(1)

    ctx.fillStyle = 'black'
    ctx.font = '18px Arial'
    ctx.fillStyle = angle < 90 ? 'red' : 'green'
    // Mostrar texto sin espejo
    ctx.save()
    ctx.scale(-1, 1) // invertir de nuevo para corregir el espejo
    ctx.fillText(`Ángulo: ${angle}°`, -left_knee.x - 10, left_knee.y - 10) // 👈 x con signo invertido
    ctx.restore()
  }

  // Visualización del ángulo de la pierna derecha
  const right_hip = keypointMap['right_hip']
  const right_knee = keypointMap['right_knee']
  const right_ankle = keypointMap['right_ankle']

  if (right_hip && right_knee && right_ankle && right_hip.score > 0.5 && right_knee.score > 0.5 && right_ankle.score > 0.5) {
    // Dibujar los vectores
    ctx.strokeStyle = 'orange'
    ctx.beginPath()
    ctx.moveTo(right_knee.x, right_knee.y)
    ctx.lineTo(right_hip.x, right_hip.y)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(right_knee.x, right_knee.y)
    ctx.lineTo(right_ankle.x, right_ankle.y)
    ctx.stroke()

    // Calcular y mostrar el ángulo
    const right_angle = getAngle(right_hip, right_knee, right_ankle).toFixed(1)

    ctx.fillStyle = 'black'
    ctx.font = '18px Arial'
    ctx.fillStyle = right_angle < 90 ? 'red' : 'green'
    // Mostrar texto sin espejo
    ctx.save()
    ctx.scale(-1, 1) // invertir de nuevo para corregir el espejo
    ctx.fillText(`Ángulo: ${right_angle}°`, -right_knee.x - 10, right_knee.y - 10) // 👈 x con signo invertido
    ctx.restore()
  }

  ctx.restore() // Vuelve a la orientación original
}