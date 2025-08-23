export function smoothAngle(prev, curr, alpha = 0.65) {
  if (prev == null || !isFinite(prev)) return curr
  return alpha * curr + (1 - alpha) * prev
}