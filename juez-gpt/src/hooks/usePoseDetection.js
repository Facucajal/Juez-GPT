// src/hooks/usePoseDetection.js
import { useEffect, useRef } from 'react'
import * as tf from '@tensorflow/tfjs'
import { syncCanvasToVideo } from '../utils/syncCanvasToVideo'
import { tuneWebGL, pickBestBackend, ensureBackend } from '../utils/tfBackend'
import { createMoveNetLightning } from '../services/detector'
import { createFpsEmitter } from '../utils/fps'
import { createInferenceGate } from '../utils/inferenceGate'

// Dejalos si querés permitir esos backends:
import '@tensorflow/tfjs-backend-webgl'
import '@tensorflow/tfjs-backend-webgpu' // si no querés WebGPU, comentá esta línea

export const usePoseDetection = (
  webcamRef,
  canvasRef,
  onPoseDetected,
  { onFps, targetFps = 24, backendPreference = 'auto' } = {}
) => {
  const onPoseDetectedRef = useRef(onPoseDetected)
  const onFpsRef = useRef(onFps)
  useEffect(() => { onPoseDetectedRef.current = onPoseDetected }, [onPoseDetected])
  useEffect(() => { onFpsRef.current = onFps }, [onFps])

  useEffect(() => {
    let detector = null
    let sized = false
    let rafId = 0
    let cancelled = false

    // Helpers
    const isVideoReady = (v) =>
      v && v.readyState === 4 &&
      v.videoWidth > 0 && v.videoHeight > 0 &&
      !v.paused && !v.ended

    const recreateDetectorOn = async (backendName) => {
      try { await detector?.dispose?.() } catch {}
      await tf.setBackend(backendName)
      await tf.ready()
      detector = await createMoveNetLightning()
      console.log('TFJS backend (switch):', tf.getBackend())
    }

    // Control de tasa (inferencias) + FPS estable
    const targetMs = 1000 / targetFps
    const gate = createInferenceGate(targetMs)
    const emitFps = createFpsEmitter({ alpha: 0.25, emitMs: 400, onEmit: onFpsRef.current })

    const run = async () => {
      try {
        tuneWebGL()
        // Si tu pickBestBackend acepta orden, podés pasarla: { order: ['webgl','webgpu'] }
        const chosen = await ensureBackend(backendPreference) // 👈 fuerza/auto
        console.log('TFJS backend (init):', chosen)
        detector = await createMoveNetLightning()
      } catch (e) {
        console.error('Init TF/Detector failed:', e)
        return
      }

      const loop = async (t) => {
        if (cancelled) return
        const now = t ?? performance.now()

        try {
          const video = webcamRef.current?.video
          if (isVideoReady(video)) {
            // Re-sync si cambió la resolución real del stream
            if (
              !sized ||
              canvasRef.current?._vw !== video.videoWidth ||
              canvasRef.current?._vh !== video.videoHeight
            ) {
              sized = syncCanvasToVideo(webcamRef, canvasRef)
            }

            // FPS (EMA con throttling de UI)
            emitFps(now)

            // Inferencia a ritmo objetivo y sin solapes
            await gate.run(now, async () => {
              try {
                const poses = await detector.estimatePoses(video)
                if (poses?.length) onPoseDetectedRef.current?.(poses[0].keypoints)
              } catch (e) {
                const msg = String(e?.message || e)
                const isWebGPU = tf.getBackend() === 'webgpu'
                if (isWebGPU && msg.includes('importExternalTexture')) {
                  console.warn('WebGPU no pudo importar el frame del video; fallback a WebGL…')
                  await recreateDetectorOn('webgl')
                } else {
                  // otros errores: log y seguimos
                  console.warn('estimatePoses error:', e)
                }
              }
            })
          }
        } catch (e) {
          console.warn('Detection loop error:', e)
        }

        rafId = requestAnimationFrame(loop)
      }

      rafId = requestAnimationFrame(loop)
    }

    run()

    return () => {
      cancelled = true
      if (rafId) cancelAnimationFrame(rafId)
      try { detector?.dispose?.() } catch {}
    }
  }, [webcamRef, canvasRef, targetFps])
}
