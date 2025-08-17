
export const syncCanvasToVideo = (webcamRef, canvasRef) => {
      const video = webcamRef.current?.video
      const canvas = canvasRef.current
      if (!video || !canvas) return false
      const vw = video.videoWidth
      const vh = video.videoHeight
      if (!vw || !vh) return false
      const dpr = window.devicePixelRatio || 1

      // tamaño real (pixeles físicos)
      canvas.width = vw * dpr
      canvas.height = vh * dpr

      return true
    }