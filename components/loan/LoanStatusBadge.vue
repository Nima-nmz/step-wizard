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
.loan-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

.badge-draft { background: #f3f4f6; color: #6b7280; }
.badge-pending { background: #fef3c7; color: #b45309; }
.badge-review { background: #dbeafe; color: #1d4ed8; }
.badge-approved { background: #dcfce7; color: #15803d; }
.badge-rejected { background: #fee2e2; color: #b91c1c; }
.badge-cancelled { background: #f3f4f6; color: #6b7280; }
</style>