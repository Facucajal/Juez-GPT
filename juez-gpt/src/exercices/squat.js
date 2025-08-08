import { getAngle } from '../utils/mathUtils'

export const detectSquat = (keypoints, lastPositionRef, updateLastPosition, setReps) => {
    const left_hip = keypoints.find(p => p.name === 'left_hip')
    const left_knee = keypoints.find(p => p.name === 'left_knee')
    const left_ankle = keypoints.find(p => p.name === 'left_ankle')
    const right_hip = keypoints.find(p => p.name === 'right_hip')
    const right_knee = keypoints.find(p => p.name === 'right_knee')
    const right_ankle = keypoints.find(p => p.name === 'right_ankle')

    const validLeft = left_hip.score > 0.5 && left_knee.score > 0.5 && left_ankle.score > 0.5
    const validRight = right_hip.score > 0.5 && right_knee.score > 0.5 && right_ankle.score > 0.5

    let angle

    
    if (validLeft && validRight) {
        angle = (getAngle(left_hip, left_knee, left_ankle) + getAngle(right_hip, right_knee, right_ankle)) / 2
    } else if (validLeft) {
        angle = getAngle(left_hip, left_knee, left_ankle)
    } else if (validRight) {
        angle = getAngle(right_hip, right_knee, right_ankle)
    } else {
        return // Ninguna pierna confiable → no hacer nada
    }

    if (angle < 90 && lastPositionRef.current === 'up') updateLastPosition('down')
    if (angle > 160 && lastPositionRef.current === 'down') { updateLastPosition('up'); setReps(r => r + 1) }
}