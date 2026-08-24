import { useWizardStore, AUTH_TOKEN_STORAGE_KEY } from '~/stores/wizardStore'

export default defineNuxtPlugin(() => {
  const store = useWizardStore()
  const storedToken = sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY)

  if (storedToken) {
    store.authToken = storedToken
    store.isAuthenticated = true
  }
})