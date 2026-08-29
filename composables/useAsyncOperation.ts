import { ref } from 'vue'

export function useAsyncOperation<T = string>() {
  const loading = ref(false)
  const error = ref<T>('' as T)

  async function execute(
    fn: () => Promise<void>,
    fallback?: string | ((rawError: any) => T),
  ) {
    loading.value = true
    error.value = '' as T
    try {
      await fn()
    } catch (e: any) {
      if (typeof fallback === 'function') {
        error.value = fallback(e)
      } else if (typeof fallback === 'string') {
        error.value = fallback as T
      }
    } finally {
      loading.value = false
    }
  }

  function reset() {
    loading.value = false
    error.value = '' as T
  }

  return { loading, error, execute, reset }
}
