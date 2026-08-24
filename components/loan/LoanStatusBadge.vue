<script setup lang="ts">
import { computed } from 'vue'
import type { LoanStatus } from '~/types/loan'

const props = defineProps<{ status: LoanStatus }>()

const statusMap: Record<LoanStatus, { label: string; className: string }> = {
  draft: { label: 'پیش‌نویس', className: 'badge-draft' },
  pending: { label: 'در انتظار بررسی', className: 'badge-pending' },
  under_review: { label: 'در حال بررسی', className: 'badge-review' },
  approved: { label: 'تأیید شده', className: 'badge-approved' },
  rejected: { label: 'رد شده', className: 'badge-rejected' },
  cancelled: { label: 'لغو شده', className: 'badge-cancelled' },
}

const config = computed(() => statusMap[props.status])
</script>

<template>
  <span class="loan-badge" :class="config.className"> {{config.label}}</span>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.loan-badge {
  @apply inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-[0.75rem] font-medium;
}
.badge-draft { @apply bg-gray-100 text-gray-500; }
.badge-pending { @apply bg-amber-100 text-amber-700; }
.badge-review { @apply bg-blue-100 text-blue-700; }
.badge-approved { @apply bg-green-100 text-green-700; }
.badge-rejected { @apply bg-red-100 text-red-700; }
.badge-cancelled { @apply bg-gray-100 text-gray-500; }
</style>
