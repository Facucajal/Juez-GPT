export const getAngle = (a, b, c) => {
  const ab = { x: a.x - b.x, y: a.y - b.y }
  const cb = { x: c.x - b.x, y: c.y - b.y }
  const dot = ab.x * cb.x + ab.y * cb.y
  const magAB = Math.hypot(ab.x, ab.y)
  const magCB = Math.hypot(cb.x, cb.y)
  const angleRad = Math.acos(dot / (magAB * magCB))
  return (angleRad * 180) / Math.PI || 180
}