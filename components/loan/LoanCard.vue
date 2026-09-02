<script setup lang="ts">
import { useLoanFormatter } from '~/composables/useLoanFormatter'
import LoanStatusBadge from './LoanStatusBadge.vue'

const props = defineProps<{
  loan: Record<string, any>
  showDate?: boolean
}>()

const { formatAmount, formatPersianDate } = useLoanFormatter()
defineEmits<{ detail: [] }>()
</script>

<template>
  <li class="loan-card">
    <div class="loan-card-main">
      <span class="loan-amount">{{ formatAmount(loan.amount) }}</span>
      <span class="loan-duration">{{ loan.durationMonths }} ماهه</span>
      <span v-if="showDate" class="loan-date">ثبت‌شده: {{ formatPersianDate(loan.createdAt) }}</span>
    </div>
    <div class="loan-card-side">
      <slot></slot>
      <LoanStatusBadge :status="loan.status" />
      <NuxtLink :to="`/loans/${loan.id}`" class="loan-detail-link">مشاهده جزئیات</NuxtLink>
    </div>
  </li>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.loan-card {
  @apply flex items-center justify-between gap-4 rounded-[10px] bg-white p-[1.1rem_1.25rem] shadow-[0_1px_3px_rgba(0,0,0,0.08)];
}
.loan-card-main { @apply flex flex-col gap-1; }
.loan-amount { @apply text-base font-semibold text-gray-900; }
.loan-duration { @apply text-[0.8rem] text-gray-500; }
.loan-date { @apply text-[0.8rem] text-gray-500; }
.loan-card-side { @apply flex items-center gap-4; }
.loan-detail-link { @apply text-[0.85rem] text-blue-500 no-underline; }
.loan-detail-link:hover { @apply underline; }
@media (max-width: 480px) {
  .loan-card { @apply flex-col items-start gap-3; }
  .loan-card-side { @apply w-full justify-between; }
}
</style>