import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-backend-webgl'
import '@tensorflow/tfjs-backend-webgpu'
// import '@tensorflow/tfjs-backend-wasm'

export function tuneWebGL() {
  try { tf.env().set('WEBGL_DELETE_TEXTURE_THRESHOLD', 0) } catch {}
}

async function setIfAvailable(name) {
  try {
    await tf.setBackend(name)
    await tf.ready()
    return tf.getBackend() === name
  } catch {
    return false
  }
}

export async function pickBestBackend(order = ['webgpu', 'webgl' /*, 'wasm'*/]) {
  for (const b of order) {
    if (await setIfAvailable(b)) return b
  }
  return tf.getBackend()
}
