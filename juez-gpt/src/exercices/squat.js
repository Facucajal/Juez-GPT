import { getAngle } from '../utils/mathUtils'

export const detectSquat = (
    keypoints,
    lastPositionRef,
    updateLastPosition,
    setReps,
    setAngle,
    setLegsDetected
) => {
    const get = (name) => keypoints.find(p => p.name === name)

    const lh = get('left_hip')
    const lk = get('left_knee')
    const la = get('left_ankle')
    const rh = get('right_hip')
    const rk = get('right_knee')
    const ra = get('right_ankle')

    const validLeft = lh?.score > 0.5 && lk?.score > 0.5 && la?.score > 0.5
    const validRight = rh?.score > 0.5 && rk?.score > 0.5 && ra?.score > 0.5

    const legs = validLeft || validRight
    setLegsDetected?.(legs)

    if (!legs) return 

    // ángulo por pierna (ponderado por score si están ambas)
    let angle
    if (validLeft && validRight) {
        const aL = getAngle(lh, lk, la)
        const aR = getAngle(rh, rk, ra)
        const sL = (lh.score + lk.score + la.score) / 3
        const sR = (rh.score + rk.score + ra.score) / 3
        angle = (aL * sL + aR * sR) / (sL + sR)
    } else if (validLeft) {
        angle = getAngle(lh, lk, la)
    } else {
        angle = getAngle(rh, rk, ra)
    }

    // actualizar UI
    setAngle?.(Math.round(angle))

    // conteo con FSM simple
    const DOWN = 90
    const UP = 160

    if (angle < DOWN && lastPositionRef.current === 'up') {
        updateLastPosition('down')
    } else if (angle > UP && lastPositionRef.current === 'down') {
        updateLastPosition('up')
        setReps(r => r + 1)
    }
}
