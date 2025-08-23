// src/utils/syncCanvasToVideo.js
export const syncCanvasToVideo = (webcamRef, canvasRef) => {
  const video  = webcamRef.current?.video
  const canvas = canvasRef.current
  if (!video || !canvas) return false

  const vw = video.videoWidth
  const vh = video.videoHeight
  if (!vw || !vh) return false

  // tamaño en pantalla (CSS)
  const rect = video.getBoundingClientRect()
  const cssW = rect.width
  const cssH = rect.height

  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  // el canvas "físico" sigue al tamaño visible (CSS) del video
  canvas.style.width  = cssW + 'px'
  canvas.style.height = cssH + 'px'
  canvas.width  = Math.round(cssW * dpr)
  canvas.height = Math.round(cssH * dpr)

  // guardá escala/DPR para usar en draw
  canvas._scaleX = cssW / vw
  canvas._scaleY = cssH / vh
  canvas._dpr    = dpr
  canvas._vw     = vw
  canvas._vh     = vh
  return true
}
