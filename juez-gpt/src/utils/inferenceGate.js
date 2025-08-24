export function createInferenceGate(targetMs) {
    let busy = false
    let last = 0

    return {
        async run(now, fn) {
            if (busy || now - last < targetMs) return
            busy = true
            last = now
            try {
                await fn()
            } finally {
                busy = false
            }
        }
    }
}
