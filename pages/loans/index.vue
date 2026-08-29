<script setup lang="ts">
import { useLoanList } from '~/composables/useLoanList'
import { useLoanFormatter } from '~/composables/useLoanFormatter'
import PageContainer from '~/components/ui/PageContainer.vue'
import LoadingState from '~/components/ui/LoadingState.vue'
import LoanStatusBadge from '~/components/loan/LoanStatusBadge.vue'

const { applications, loading, error, fetchApplications } = useLoanList()
const { formatAmount } = useLoanFormatter()
</script>

<template>
  <PageContainer>
    <header class="loans-header">
      <div>
        <h1>درخواست‌های وام</h1>
        <p>لیست درخواست‌های ثبت‌شده و وضعیت هر کدوم</p>
      </div>
      <NuxtLink to="/loans/new" class="btn-new">درخواست جدید</NuxtLink>
    </header>

    <LoadingState :loading="loading" :error="error" loading-text="در حال دریافت لیست..." @retry="fetchApplications">
      <div v-if="applications.length === 0" class="state-box empty-box">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 15h6" />
        </svg>
        <p>هنوز هیچ درخواست وامی ثبت نکردی</p>
        <NuxtLink to="/loans/new" class="btn-new">ثبت اولین درخواست</NuxtLink>
      </div>

      <ul v-else class="loan-list">
        <li v-for="loan in applications" :key="loan.id" class="loan-card">
          <div class="loan-card-main">
            <span class="loan-amount">{{ formatAmount(loan.amount) }}</span>
            <span class="loan-duration">{{ loan.durationMonths }} ماهه</span>
          </div>
          <div class="loan-card-side">
            <LoanStatusBadge :status="loan.status" />
            <NuxtLink :to="`/loans/${loan.id}`" class="loan-detail-link">مشاهده جزئیات</NuxtLink>
          </div>
        </li>
      </ul>
    </LoadingState>
  </PageContainer>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.loans-header {
  @apply mb-6 flex items-start justify-between gap-4;
}
.btn-new {
  @apply inline-flex items-center whitespace-nowrap rounded-lg bg-blue-500 px-5 py-2.5 text-[0.9rem] font-medium text-white no-underline transition-colors duration-200 border-none;
}
.btn-new:hover { @apply bg-blue-600; }
.empty-box svg { @apply text-gray-300; }
.loan-list {
  @apply flex flex-col gap-3 list-none m-0 p-0;
}
.loan-card {
  @apply flex items-center justify-between gap-4 rounded-[10px] bg-white p-[1.1rem_1.25rem] shadow-[0_1px_3px_rgba(0,0,0,0.08)];
}
.loan-card-main { @apply flex flex-col gap-1; }
.loan-amount { @apply text-base font-semibold text-gray-900; }
.loan-duration { @apply text-[0.8rem] text-gray-500; }
.loan-card-side { @apply flex items-center gap-4; }
.loan-detail-link { @apply text-[0.85rem] text-blue-500 no-underline; }
.loan-detail-link:hover { @apply underline; }
@media (max-width: 480px) {
  .loans-header { @apply flex-col; }
  .loan-card { @apply flex-col items-start gap-3; }
  .loan-card-side { @apply w-full justify-between; }
}
</style>
