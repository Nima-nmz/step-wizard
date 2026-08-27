<script setup lang="ts">
import type { LoanTimelineEvent } from '~/types/loan'
import LoanStatusBadge from '~/components/loan/LoanStatusBadge.vue'
import { useLoanFormatter } from '~/composables/useLoanFormatter'

defineProps<{
  timeline: LoanTimelineEvent[]
}>()

const { formatPersianDate } = useLoanFormatter()
</script>

<template>
  <div>
    <ul v-if="timeline.length" class="timeline-list">
      <li v-for="event in timeline" :key="event.id" class="timeline-item">
        <LoanStatusBadge :status="event.status" />
        <span v-if="event.note" class="timeline-note">{{ event.note }}</span>
        <span class="timeline-date">{{ formatPersianDate(event.createdAt) }}</span>
      </li>
    </ul>
    <p v-else class="empty-timeline">تاریخچه‌ای ثبت نشده است.</p>
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.timeline-list {
  @apply list-none m-0 p-0 flex flex-col gap-2;
}
.timeline-item {
  @apply flex items-center gap-3 p-2 px-3 bg-gray-50 rounded-lg text-[0.85rem];
}
.timeline-note {
  @apply text-gray-700 flex-1;
}
.timeline-date {
  @apply text-gray-400 text-[0.8rem] ms-auto;
}
.empty-timeline {
  @apply text-gray-400 text-[0.85rem];
}
</style>
