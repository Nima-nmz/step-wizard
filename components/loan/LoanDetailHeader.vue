<script setup lang="ts">
import type { LoanStatus } from '~/types/loan'
import LoanStatusBadge from '~/components/loan/LoanStatusBadge.vue'
import { useLoanFormatter } from '~/composables/useLoanFormatter'
import { Button } from '@/components/ui/button'
import { useWizardStore } from '~/stores/wizardStore'

const store = useWizardStore()
const props = defineProps<{
  amount: number
  durationMonths: number
  status: LoanStatus
  cancelling?: boolean
  error?: string
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
}>()

const { formatAmount } = useLoanFormatter()
const canCancel = computed(() => ['pending', 'under_review'].includes(props.status))
</script>

<template>
  <div class="summary-card">
    <div class="summary-head">
      <div>
        <span class="summary-amount">{{ formatAmount(amount) }}</span>
        <span class="summary-duration">{{ durationMonths }} ماهه</span>
      </div>
      <LoanStatusBadge :status="status" />
    </div>

    <Button
      v-if="canCancel && !store.isAdmin"
      variant="destructive-soft"
      size="sm"
      :loading="cancelling"
      @click="emit('cancel')"
    >
      {{ cancelling ? 'در حال لغو...' : 'لغو درخواست' }}
    </Button>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.summary-card {
  @apply p-5 space-y-4 bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] mb-4;
}
.summary-head {
  @apply flex items-center justify-between;
}
.summary-amount {
  @apply text-[1.15rem] font-semibold text-gray-900 me-2.5;
}
.summary-duration {
  @apply text-[0.85rem] text-gray-500;
}
.error {
  @apply text-red-600 text-[0.8rem] mt-2;
}
</style>
