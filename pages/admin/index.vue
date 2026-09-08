<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getAdminLoanList, approveLoanByAdmin, rejectLoanByAdmin } from '~/services/Useloan.service'
import type { LoanApplication } from '~/types/loan'
import PageContainer from '~/components/ui/PageContainer.vue'
import LoadingState from '~/components/ui/LoadingState.vue'
import LoanCard from '~/components/loan/LoanCard.vue'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'

definePageMeta({ middleware: 'admin' })

const applications = ref<LoanApplication[]>([])
const loading = ref(false)
const error = ref('')
const actingOnId = ref<number | null>(null)
const actingAction = ref<'approve' | 'reject' | null>(null)
const filterStatus = ref('all')

const showRejectDialog = ref(false)
const rejectTargetId = ref<number | null>(null)
const rejectReason = ref('')
const rejectReasonError = ref('')

const filterOptions = [
  { key: 'all', label: 'همه' },
  { key: 'pending', label: 'در انتظار بررسی' },
  { key: 'under_review', label: 'در حال بررسی' },
  { key: 'approved', label: 'تأیید شده' },
  { key: 'rejected', label: 'رد شده' },
  { key: 'cancelled', label: 'لغو شده' },
]

const filteredApplications = computed(() => {
  if (filterStatus.value === 'all') return applications.value
  return applications.value.filter((a) => a.status === filterStatus.value)
})

const stats = computed(() => ({
  total: applications.value.length,
  pending: applications.value.filter((a) => a.status === 'pending').length,
  underReview: applications.value.filter((a) => a.status === 'under_review').length,
  approved: applications.value.filter((a) => a.status === 'approved').length,
  rejected: applications.value.filter((a) => a.status === 'rejected').length,
}))

async function fetchLoans() {
  loading.value = true
  error.value = ''
  try {
    const res = await getAdminLoanList()
    applications.value = res.items
  } catch {
    error.value = 'دریافت لیست درخواست‌ها با خطا مواجه شد'
  } finally {
    loading.value = false
  }
}

async function handleApprove(loan: LoanApplication) {
  actingOnId.value = loan.id
  actingAction.value = 'approve'
  try {
    const updated = await approveLoanByAdmin(loan.id)
    const idx = applications.value.findIndex((a) => a.id === loan.id)
    if (idx !== -1) applications.value[idx] = updated
  } catch (e: any) {
    error.value = e?.data?.message || 'خطا در تأیید درخواست'
  } finally {
    actingOnId.value = null
    actingAction.value = null
  }
}

function openRejectDialog(loanId: number) {
  rejectTargetId.value = loanId
  rejectReason.value = ''
  rejectReasonError.value = ''
  showRejectDialog.value = true
}

function closeRejectDialog() {
  showRejectDialog.value = false
  rejectTargetId.value = null
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
  if (!rejectTargetId.value) return

  actingOnId.value = rejectTargetId.value
  actingAction.value = 'reject'
  try {
    const updated = await rejectLoanByAdmin(rejectTargetId.value, rejectReason.value.trim())
    const idx = applications.value.findIndex((a) => a.id === rejectTargetId.value)
    if (idx !== -1) applications.value[idx] = updated
    closeRejectDialog()
  } catch (e: any) {
    error.value = e?.data?.message || 'خطا در رد درخواست'
  } finally {
    actingOnId.value = null
    actingAction.value = null
  }
}

onMounted(fetchLoans)
</script>

<template>
  <PageContainer>
    <header class="admin-header">
      <h1>پنل ادمین — مدیریت درخواست‌های وام</h1>
      <p>لیست درخواست‌های ثبت‌شده در سیستم</p>
    </header>

    <div class="stats-row">
      <div class="stat-card">
        <span class="stat-value">{{ stats.total }}</span>
        <span class="stat-label">کل</span>
      </div>
      <div class="stat-card stat-pending">
        <span class="stat-value">{{ stats.pending }}</span>
        <span class="stat-label">در انتظار</span>
      </div>
      <div class="stat-card stat-review">
        <span class="stat-value">{{ stats.underReview }}</span>
        <span class="stat-label">در بررسی</span>
      </div>
      <div class="stat-card stat-approved">
        <span class="stat-value">{{ stats.approved }}</span>
        <span class="stat-label">تأیید</span>
      </div>
      <div class="stat-card stat-rejected">
        <span class="stat-value">{{ stats.rejected }}</span>
        <span class="stat-label">رد</span>
      </div>
    </div>

    <div class="filter-row">
      <Button
        v-for="f in filterOptions"
        :key="f.key"
        variant="outline"
        size="sm"
        :class="{ 'bg-blue-500 text-white border-blue-500': filterStatus === f.key }"
        @click="filterStatus = f.key"
      >
        {{ f.label }}
      </Button>
    </div>

    <LoadingState :loading="loading" :error="error" loading-text="در حال دریافت لیست..." @retry="fetchLoans">
      <div v-if="filteredApplications.length === 0" class="state-box empty-box">
        <p>درخواستی یافت نشد</p>
      </div>

      <ul v-else class="loan-list">
        <LoanCard v-for="loan in filteredApplications" :key="loan.id" :loan="loan" showDate>
          <div class="flex gap-2">
            <Button
              variant="success"
              size="sm"
              :disabled="loan.status === 'approved'"
              :loading="actingOnId === loan.id && actingAction === 'approve'"
              @click="handleApprove(loan)"
            >
              تأیید
            </Button>
            <Button
              variant="destructive"
              size="sm"
              :disabled="loan.status === 'rejected'"
              :loading="actingOnId === loan.id && actingAction === 'reject'"
              @click="openRejectDialog(loan.id)"
            >
              رد کردن
            </Button>
          </div>
        </LoanCard>
      </ul>
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
            :disabled="actingAction === 'reject'"
            @click="confirmReject"
          >
            {{ actingAction === 'reject' ? 'در حال رد...' : 'تأیید رد درخواست' }}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </PageContainer>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.admin-header {
  @apply mb-6;
}
.admin-header h1 {
  @apply text-lg font-semibold text-gray-900;
}
.admin-header p {
  @apply mt-1 text-[0.875rem] text-gray-500;
}

.stats-row {
  @apply mb-4 flex flex-wrap gap-3;
}
.stat-card {
  @apply flex flex-col items-center rounded-lg bg-white px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.08)];
  min-width: 80px;
}
.stat-value {
  @apply text-xl font-semibold text-gray-900;
}
.stat-label {
  @apply text-[0.75rem] text-gray-500;
}
.stat-pending { @apply border-t-2 border-amber-500; }
.stat-review { @apply border-t-2 border-blue-500; }
.stat-approved { @apply border-t-2 border-green-500; }
.stat-rejected { @apply border-t-2 border-red-500; }

.filter-row {
  @apply mb-4 flex flex-wrap gap-2;
}

.loan-list {
  @apply flex flex-col gap-3 list-none m-0 p-0;
}
.empty-box {
  @apply rounded-[10px] bg-white p-8 text-center text-gray-500;
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
