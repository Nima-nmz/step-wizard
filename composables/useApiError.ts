export function useApiError() {
  function getMessage(error: any, fallback: string): string {
    if (error?.data?.message) return error.data.message
    if (error?.data?.errors) {
      return Object.values(error.data.errors).flat().join(' - ')
    }
    return fallback
  }

  function getFieldErrors(error: any): Record<string, string> {
    const fields: Record<string, string> = {}
    if (error?.data?.errors) {
      Object.entries(error.data.errors).forEach(([field, msgs]: [string, any]) => {
        fields[field] = Array.isArray(msgs) ? msgs[0] : String(msgs)
      })
    }
    return fields
  }

  return { getMessage, getFieldErrors }
}
