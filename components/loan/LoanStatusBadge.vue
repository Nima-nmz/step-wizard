<script setup lang="ts">
import { computed } from 'vue'
import type { LoanStatus } from '~/types/loan'
import { Badge } from '@/components/ui/badge'

const props = defineProps<{ status: LoanStatus }>()

const statusMap: Record<LoanStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'|'success'|'warning'|'info'|'ghost' }> = {
  draft: { label: 'پیش‌نویس', variant: 'ghost' },
  pending: { label: 'در انتظار بررسی', variant: 'warning' },
  under_review: { label: 'در حال بررسی', variant: 'info' },
  approved: { label: 'تأیید شده', variant: 'success' },
  rejected: { label: 'رد شده', variant: 'destructive' },
  cancelled: { label: 'لغو شده', variant: 'ghost' },
}

const config = computed(() => statusMap[props.status])
</script>

<template>
  <Badge :variant="config.variant">{{ config.label }}</Badge>
</template>
