import { useWizardStore, AUTH_TOKEN_STORAGE_KEY,AUTH_ROLE_STORAGE_KEY } from '~/stores/wizardStore'

export default defineNuxtPlugin(() => {
  const store = useWizardStore()
  const storedToken = sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
  const storedRole = sessionStorage.getItem(AUTH_ROLE_STORAGE_KEY) as 'user' | 'admin' | null

  if (storedToken) {
    store.authToken = storedToken
    store.isAuthenticated = true
  }
  if (storedRole) {
    store.role = storedRole
  }
})