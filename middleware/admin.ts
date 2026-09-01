import { useWizardStore } from '~/stores/wizardStore'

export default defineNuxtRouteMiddleware(() => {
  const store = useWizardStore()

  if (!store.isAuthenticated) {
    return navigateTo('/')
  }

  if (store.role !== 'admin') {
    return abortNavigation(
      createError({ statusCode: 403, statusMessage: 'دسترسی غیرمجاز' }),
    )
  }
})