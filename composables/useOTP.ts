import { ref, computed, onUnmounted } from 'vue'

export function useOTP(initialTime = 120) {
  const timer = ref(initialTime)
  const isRunning = ref(false)
  let intervalId: ReturnType<typeof setInterval> | null = null

  const formattedTime = computed(() => {
    const m = Math.floor(timer.value / 60).toString().padStart(2, '0')
    const s = (timer.value % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  })

  const canResend = computed(() => timer.value <= 0)

  function start() {
    if (isRunning.value) return
    isRunning.value = true
    timer.value = initialTime
    intervalId = setInterval(() => {
      if (timer.value > 0) timer.value--
      else stop()
    }, 1000)
  }

  function stop() {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
    isRunning.value = false
  }

  function reset() {
    stop()
    timer.value = initialTime
  }

  onUnmounted(() => stop())

  return { timer, formattedTime, isRunning, canResend, start, stop, reset }
}
