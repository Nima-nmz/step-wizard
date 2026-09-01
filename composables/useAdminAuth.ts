import { useRouter } from 'vue-router'
import { useWizardStore } from '~/stores/wizardStore'

export function useAdminAuth() {
  const store = useWizardStore()
  const router = useRouter()

  function handleAdminRedirect(role: string | null) {
    if (role === 'admin') {
      router.push('/admin')
    }
  }

  return { handleAdminRedirect }
}
