import { ref, computed, onMounted } from 'vue'
import {
  getLoanDetail,
  getLoanTimeline,
  uploadLoanDocument,
  deleteLoanDocument,
  submitLoanGuarantor,
  submitLoanApplication,
  cancelLoan,
  approveLoanByAdmin,
  rejectLoanByAdmin,
} from '~/services/Useloan.service'
import type { LoanApplication, LoanTimelineEvent, LoanGuarantor } from '~/types/loan'
import { useAsyncOperation } from '~/composables/useAsyncOperation'
import { useApiError } from '~/composables/useApiError'

export function useLoanDetail(loanId: number) {
  const { getMessage, getFieldErrors } = useApiError()

  const mainOp = useAsyncOperation()
  const uploadOp = useAsyncOperation()
  const guarantorOp = useAsyncOperation()
  const finalOp = useAsyncOperation()
  const cancelOp = useAsyncOperation()
  const adminOp = useAsyncOperation()

  const application = ref<LoanApplication | null>(null)
  const timeline = ref<LoanTimelineEvent[]>([])
  const guarantorErrors = ref<Record<string, string>>({})

  const canSubmitFinal = computed(
    () => (application.value?.documents.length ?? 0) > 0 && !!application.value?.guarantor,
  )

  async function fetchAll() {
    await mainOp.execute(async () => {
      const [detail, events] = await Promise.all([getLoanDetail(loanId), getLoanTimeline(loanId)])
      application.value = detail
      timeline.value = events
    }, (e) => getMessage(e, 'دریافت اطلاعات درخواست با خطا مواجه شد.'))
  }

  async function uploadDocument(file: File) {
    await uploadOp.execute(async () => {
      const doc = await uploadLoanDocument(loanId, file)
      application.value?.documents.push(doc)
    }, (e) => getMessage(e, 'آپلود مدرک با خطا مواجه شد.'))
  }

  async function removeDocument(docId: number) {
    await uploadOp.execute(async () => {
      await deleteLoanDocument(loanId, docId)
      if (application.value) {
        application.value.documents = application.value.documents.filter((d) => d.id !== docId)
      }
    }, (e) => getMessage(e, 'حذف مدرک با خطا مواجه شد.'))
  }

  async function submitGuarantor(payload: LoanGuarantor) {
    guarantorErrors.value = {}
    guarantorOp.loading.value = true
    try {
      const updated = await submitLoanGuarantor(loanId, payload)
      application.value = updated
    } catch (e: any) {
      guarantorErrors.value = getFieldErrors(e)
    } finally {
      guarantorOp.loading.value = false
    }
  }

  async function submitFinal() {
    await finalOp.execute(async () => {
      const updated = await submitLoanApplication(loanId)
      application.value = updated
      const events = await getLoanTimeline(loanId)
      timeline.value = events
    }, (e) => getMessage(e, 'ارسال درخواست با خطا مواجه شد.'))
  }

  async function cancel() {
    await cancelOp.execute(async () => {
      const updated = await cancelLoan(loanId)
      application.value = updated
      const events = await getLoanTimeline(loanId)
      timeline.value = events
    }, (e) => getMessage(e, 'لغو درخواست با خطا مواجه شد.'))
  }

  async function handleAdminApprove() {
    if (!application.value) return
    await adminOp.execute(async () => {
      const updated = await approveLoanByAdmin(application.value!.id)
      application.value = updated
    }, (e) => getMessage(e, 'تأیید با خطا مواجه شد.'))
  }

  async function handleAdminReject(reason: string) {
    if (!application.value) return
    await adminOp.execute(async () => {
      const updated = await rejectLoanByAdmin(application.value!.id, reason)
      application.value = updated
    }, (e) => getMessage(e, 'رد درخواست با خطا مواجه شد.'))
  }

  onMounted(fetchAll)

  return {
    application,
    timeline,
    loading: mainOp.loading,
    loadError: mainOp.error,
    uploading: uploadOp.loading,
    uploadError: uploadOp.error,
    submittingGuarantor: guarantorOp.loading,
    guarantorErrors,
    submittingFinal: finalOp.loading,
    finalError: finalOp.error,
    cancelling: cancelOp.loading,
    submittingAdmin: adminOp.loading,
    canSubmitFinal,
    fetchAll,
    uploadDocument,
    removeDocument,
    submitGuarantor,
    submitFinal,
    cancel,
    handleAdminApprove,
    handleAdminReject,
  }
}
