import * as posedetection from '@tensorflow-models/pose-detection'

export async function createMoveNetLightning() {
    return posedetection.createDetector(
        posedetection.SupportedModels.MoveNet,
        { modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
    )
}
