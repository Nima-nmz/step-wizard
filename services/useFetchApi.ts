import { useWizardStore } from "~/stores/wizardStore";

interface FetchCustomConfig {
    setToken?:boolean,
    silent?:boolean
}

export function useFetchApi<R>() {
  return async (
    url: string,
    options: Record<string, any> = {},
    customConfig: FetchCustomConfig = {},
  ): Promise<R> => {
    const store = useWizardStore()
    const { setToken = true, silent = false } = customConfig
    const method = (options.method || 'GET').toUpperCase()
 
    const headers: Record<string, string> = { ...(options.headers || {}) }
    if (setToken && store.authToken && !headers.Authorization) {
      headers.Authorization = `Bearer ${store.authToken}`
    }
 
    const startedAt = Date.now()
 
    try {
      const response = await $fetch<R>(url, { ...options, headers })
 
      if (!silent) {
        console.log(`[API] ${method} ${url} → OK (${Date.now() - startedAt}ms)`, response)
      }
 
      return response
    } catch (error: any) {
      if (!silent) {
        console.error(
          `[API] ${method} ${url} → FAILED (${Date.now() - startedAt}ms)`,
          error?.data || error,
        )
      }
      throw error
    }
  }
}