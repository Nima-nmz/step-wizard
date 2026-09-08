<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWizardStore } from '~/stores/wizardStore'
import { useLoanDetail } from '~/composables/useLoanDetail'
import PageContainer from '~/components/ui/PageContainer.vue'
import LoadingState from '~/components/ui/LoadingState.vue'
import SectionCard from '~/components/ui/SectionCard.vue'
import { Button } from '@/components/ui/button'
import LoanDetailHeader from '~/components/loan/LoanDetailHeader.vue'
import LoanGuarantorForm from '~/components/loan/LoanGuarantorForm.vue'
import LoanGuarantorCard from '~/components/loan/LoanGuarantorCard.vue'
import LoanTimeline from '~/components/loan/LoanTimeline.vue'
import LoanDocuments from '~/components/loan/LoanDocuments.vue'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { ArrowRightIcon, AlertTriangleIcon } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const store = useWizardStore()
const loanId = Number(route.params.id)
const isAdmin = computed(() => store.role === 'admin')

const {
  application, timeline, loading, loadError,
  uploading, uploadError, submittingGuarantor, guarantorErrors,
  submittingFinal, finalError, cancelling, submittingAdmin, canSubmitFinal,
  fetchAll, uploadDocument, removeDocument, submitGuarantor, submitFinal, cancel, handleAdminApprove, handleAdminReject,
} = useLoanDetail(loanId)

const showRejectDialog = ref(false)
const rejectReason = ref('')
const rejectReasonError = ref('')

function openRejectDialog() {
  rejectReason.value = ''
  rejectReasonError.value = ''
  showRejectDialog.value = true
}

function closeRejectDialog() {
  showRejectDialog.value = false
  rejectReason.value = ''
  rejectReasonError.value = ''
}

function validateRejectReason() {
  if (!rejectReason.value.trim()) {
    rejectReasonError.value = 'دلیل رد الزامی است'
    return false
  }
  if (rejectReason.value.trim().length < 5) {
    rejectReasonError.value = 'دلیل رد باید حداقل ۵ کاراکتر باشد'
    return false
  }
  rejectReasonError.value = ''
  return true
}

async function confirmReject() {
  if (!validateRejectReason()) return
  await handleAdminReject(rejectReason.value.trim())
  closeRejectDialog()
}
</script>

<template>
  <PageContainer>
    <Button variant="info-soft" class="back-link" @click="router.push(isAdmin ? '/admin' : '/loans')">
      <ArrowRightIcon />
      بازگشت به لیست
    </Button>

    <LoadingState :loading="loading" :error="loadError" loading-text="در حال دریافت اطلاعات..." @retry="fetchAll">
      <template v-if="application">
        <LoanDetailHeader
          :amount="application.amount"
          :duration-months="application.durationMonths"
          :status="application.status"
          :cancelling="cancelling"
          :error="finalError"
          @cancel="cancel"
        />

        <div v-if="application.status === 'rejected' && application.rejectionReason" class="rejection-banner">
          <div class="rejection-icon">
            <AlertTriangleIcon class="size-5" />
          </div>
          <div class="rejection-content">
            <span class="rejection-title">دلیل رد درخواست</span>
            <span class="rejection-text">{{ application.rejectionReason }}</span>
          </div>
        </div>


        <SectionCard v-if="isAdmin && application.status !== 'draft'" title="عملیات ادمین">
          <div class="flex mx-8 gap-3 w-70">
            <Button variant="success" :disabled="application.status === 'approved' || submittingAdmin" :loading="submittingAdmin" @click="handleAdminApprove">
              تأیید درخواست
            </Button>
            <Button variant="destructive" :disabled="application.status === 'rejected' || submittingAdmin" :loading="submittingAdmin" @click="openRejectDialog">
              رد درخواست
            </Button>
          </div>
        </SectionCard>

        <SectionCard v-if="application.status === 'draft'" title="مدارک ضمانت">
          <LoanDocuments
            v-if="!isAdmin"
            mode="manage"
            :documents="application.documents"
            :uploading="uploading"
            :error="uploadError"
            @upload="uploadDocument"
            @remove="removeDocument"
          />
        </SectionCard>

        <SectionCard v-if="application.status === 'draft'" title="اطلاعات ضامن">
          <div v-if="application.guarantor" class="guarantor-done">
            <p>✓ اطلاعات ضامن ({{ application.guarantor.fullName }}) ثبت شد.</p>
          </div>
          <LoanGuarantorForm
            v-else
            :submitting="submittingGuarantor"
            :errors="guarantorErrors"
            @submit="submitGuarantor"
          />
        </SectionCard>

        <SectionCard v-if="application.status === 'draft'">
          <Button variant="success" :loading="submittingFinal" :disabled="!canSubmitFinal" @click="submitFinal">
            {{ submittingFinal ? 'در حال ارسال...' : 'ارسال نهایی درخواست' }}
          </Button>
          <p v-if="!canSubmitFinal" class="hint">برای ارسال نهایی، حداقل یک مدرک و اطلاعات ضامن لازمه.</p>
        </SectionCard>

        <SectionCard v-if="application.status !== 'draft' && application.documents.length" title="مدارک ارسالی">
          <LoanDocuments
            mode="view"
            :documents="application.documents"
          />
        </SectionCard>

        <SectionCard v-if="application.status !== 'draft' && application.guarantor" title="اطلاعات ضامن">
          <LoanGuarantorCard
            :guarantor="application.guarantor"
          />
        </SectionCard>

        <SectionCard v-if="application.status !== 'draft'" title="تاریخچه وضعیت">
          <LoanTimeline :timeline="timeline" />
        </SectionCard>
      </template>
    </LoadingState>

    <AlertDialog v-model:open="showRejectDialog">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>رد درخواست وام</AlertDialogTitle>
          <AlertDialogDescription>
            لطفاً دلیل رد درخواست را بنویسید. این دلیل برای متقاضی نمایش داده خواهد شد.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div class="reject-dialog-body">
          <textarea
            v-model="rejectReason"
            class="reject-textarea"
            :class="{ 'has-error': rejectReasonError }"
            rows="4"
            placeholder="دلیل رد درخواست را بنویسید (حداقل ۵ کاراکتر)..."
            @input="rejectReasonError = ''"
          />
          <span v-if="rejectReasonError" class="field-error">{{ rejectReasonError }}</span>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel @click="closeRejectDialog">انصراف</AlertDialogCancel>
          <Button
            variant="destructive"
            :disabled="submittingAdmin"
            @click="confirmReject"
          >
            {{ submittingAdmin ? 'در حال رد...' : 'تأیید رد درخواست' }}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </PageContainer>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.back-link {
  @apply cursor-pointer mb-4 text-[0.85rem] text-blue-500;
}
.guarantor-done {
  @apply rounded-lg bg-green-50 p-3 text-[0.85rem] text-green-700;
}
.hint {
  @apply mt-[0.6rem] text-center text-[0.8rem] text-gray-400;
}

.rejection-banner {
  @apply mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4;
}
.rejection-icon {
  @apply flex size-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600;
}
.rejection-content {
  @apply flex flex-1 flex-col gap-1;
}
.rejection-title {
  @apply text-sm font-semibold text-red-800;
}
.rejection-text {
  @apply text-sm leading-6 text-red-700;
}

.reject-dialog-body {
  @apply px-1;
}
.reject-textarea {
  @apply w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm resize-none transition-colors;
  @apply focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20;
}
.reject-textarea.has-error {
  @apply border-red-500;
}
.field-error {
  @apply mt-1.5 block text-[0.75rem] text-red-500;
}
</style>
