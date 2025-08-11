import { useEffect } from 'react'
import * as posedetection from '@tensorflow-models/pose-detection'
import * as tf from '@tensorflow/tfjs'
import { syncCanvasToVideo } from '../utils/syncCanvasToVideo'

export const usePoseDetection = (webcamRef, canvasRef, onPoseDetected) => {
  useEffect(() => {
    let sized = false
    let detector

    const run = async () => {
      await tf.setBackend('webgl')
      await tf.ready()

      const detector = await posedetection.createDetector(
        posedetection.SupportedModels.MoveNet,
        { modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
      )

      const detect = async () => {
        const video = webcamRef.current?.video
        if (video && video.readyState === 4) {
            if (!sized && video.videoWidth && video.videoHeight) {
                sized = syncCanvasToVideo(webcamRef, canvasRef)
            }
          const poses = await detector.estimatePoses(video)
          if (poses.length > 0) onPoseDetected(poses[0].keypoints)
        }
        requestAnimationFrame(detect)
      }

      detect()
    }
    run()
  }, [webcamRef, onPoseDetected])
}
