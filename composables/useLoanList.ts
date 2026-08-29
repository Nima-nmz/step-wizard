import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useLoanStore } from '~/stores/Loanstore'
import { getLoanList } from '~/services/Useloan.service'
import { useAsyncOperation } from '~/composables/useAsyncOperation'

export function useLoanList() {
  const store = useLoanStore()
  const { applications, applicationsLoading } = storeToRefs(store)
  const listOp = useAsyncOperation()

  async function fetchApplications() {
    store.setApplicationsLoading(true)
    listOp.error.value = ''
    try {
      const data = await getLoanList()
      store.setApplications(data.items, data.meta)
    } catch {
      listOp.error.value = 'دریافت لیست درخواست‌ها با خطا مواجه شد.'
    } finally {
      store.setApplicationsLoading(false)
    }
  }

  onMounted(fetchApplications)

  return {
    applications,
    loading: applicationsLoading,
    error: listOp.error,
    fetchApplications,
  }
}
