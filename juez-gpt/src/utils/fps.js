export function createFpsEmitter({ alpha = 0.25, emitMs = 400, onEmit }) {
    let ema = null
    let lastEmit = 0
    let lastTs = performance.now()

    return function update(nowTs) {
        const inst = 1000 / (nowTs - lastTs)
        lastTs = nowTs
        ema = ema == null ? inst : alpha * inst + (1 - alpha) * ema
        if (nowTs - lastEmit >= emitMs) {
            onEmit?.(Math.round(ema))
            lastEmit = nowTs
        }
    }
}
