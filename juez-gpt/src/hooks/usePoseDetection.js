// src/hooks/usePoseDetection.js
import { useEffect, useRef } from 'react'
import * as posedetection from '@tensorflow-models/pose-detection'
import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-backend-webgl'
import '@tensorflow/tfjs-backend-webgpu'
// import '@tensorflow/tfjs-backend-wasm'

import { syncCanvasToVideo } from '../utils/syncCanvasToVideo'



export const usePoseDetection = (
  webcamRef,
  canvasRef,
  onPoseDetected,
  { onFps, targetFps = 24 } = {}
) => {
  // Mantener callbacks estables sin re-crear el detector
  const onPoseDetectedRef = useRef(onPoseDetected)
  const onFpsRef = useRef(onFps)
  useEffect(() => { onPoseDetectedRef.current = onPoseDetected }, [onPoseDetected])
  useEffect(() => { onFpsRef.current = onFps }, [onFps])

  useEffect(() => {
    let sized = false
    let detector = null
    let busy = false
    let rafId = 0
    let lastFrameTs = performance.now()
    let lastInferTs = 0
    const targetMs = 1000 / targetFps
    let cancelled = false

    const setIfAvailable = async (name) => {
      try {
        await tf.setBackend(name)
        await tf.ready()
        return tf.getBackend() === name
      } catch { return false }
    }

    const pickBestBackend = async () => {
      const order = ['webgpu', 'webgl'/*, 'wasm'*/]  // activa 'wasm' si lo importaste
      for (const b of order) {
        if (await setIfAvailable(b)) return b
      }
      return tf.getBackend()
    }

    const run = async () => {
      // (Opcional) liberar texturas WebGL más agresivamente para evitar acumulación
      try { tf.env().set('WEBGL_DELETE_TEXTURE_THRESHOLD', 0) } catch { }
      try {
        const chosen = await pickBestBackend()
        console.log('TFJS backend:', chosen)

        detector = await posedetection.createDetector(
          posedetection.SupportedModels.MoveNet,
          { modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
        )
      } catch (e) {
        console.error('Fallo inicializando TF/Detector:', e)
        return // no sigas si falló
      }



      const loop = async (t) => {
        if (cancelled) return

        // ✅ "now" definido siempre al comienzo y visible en todo el loop
        const now = t ?? performance.now()

        try {
          const video = webcamRef.current?.video
          if (video && video.readyState === 4) {
            if (!sized && video.videoWidth && video.videoHeight) {
              sized = syncCanvasToVideo(webcamRef, canvasRef)
            }

            // FPS del loop
            const fps = 1000 / (now - lastFrameTs)
            lastFrameTs = now
            onFpsRef.current?.(Math.round(fps))

            // Limitar inferencias y evitar solaparlas
            if (!busy && now - lastInferTs >= targetMs) {
              busy = true
              lastInferTs = now
              try {
                const poses = await detector.estimatePoses(video)
                if (poses?.length) onPoseDetectedRef.current?.(poses[0].keypoints)
              } finally {
                busy = false
              }
            }
          }
        } catch (e) {
          console.warn('Fallo en loop de detección:', e)
          // por las dudas, si falló en medio de una inferencia:
          busy = false
        }

        rafId = requestAnimationFrame(loop)
      }

      rafId = requestAnimationFrame(loop)
    }

    run()

    // Cleanup completo
    return () => {
      cancelled = true
      if (rafId) cancelAnimationFrame(rafId)
      try { detector?.dispose?.() } catch { }
    }
  }, [webcamRef, canvasRef, targetFps]) // 👈 dependencias mínimas
}
