import { useEffect } from 'react'
import * as posedetection from '@tensorflow-models/pose-detection'
import * as tf from '@tensorflow/tfjs'

export const usePoseDetection = (webcamRef, onPoseDetected) => {
  useEffect(() => {
    const run = async () => {
      await tf.setBackend('webgl')
      await tf.ready()

      const detector = await posedetection.createDetector(
        posedetection.SupportedModels.MoveNet,
        { modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
      )

      const detect = async () => {
        if (webcamRef.current?.video.readyState === 4) {
          const poses = await detector.estimatePoses(webcamRef.current.video)
          if (poses.length > 0) onPoseDetected(poses[0].keypoints)
        }
        requestAnimationFrame(detect)
      }

      detect()
    }
    run()
  }, [webcamRef, onPoseDetected])
}
