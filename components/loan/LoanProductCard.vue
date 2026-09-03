<script setup lang="ts">
import type { LoanProduct } from '~/types/loan'
import { useLoanFormatter } from '~/composables/useLoanFormatter'
import { Button } from '@/components/ui/button'

defineProps<{ product: LoanProduct; selected: boolean }>()
defineEmits<{ select: [] }>()

const { formatAmount } = useLoanFormatter()
</script>

<template>
  <Button type="button" variant="outline" class="product-card w-full justify-start"  :class="{ selected }" @click="$emit('select')">
    <div class="product-card-head">
      <span class="product-title">{{ product.title }}</span>
      <span class="product-rate">{{ product.interestRate }}٪ سود سالانه</span>
    </div>
    <p class="product-desc">{{ product.description }}</p>
    <div class="product-range">
      <span>{{ formatAmount(product.minAmount) }} تا {{ formatAmount(product.maxAmount) }}</span>
      <span>{{ product.minDurationMonths }} تا {{ product.maxDurationMonths }} ماه</span>
    </div>
  </Button>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.product-card {
  @apply block w-full h-28 cursor-pointer rounded-xl border-2 border-gray-200 bg-white p-4 text-right transition-[border-color,background-color] duration-200;
}
.product-card:hover {
  @apply border-blue-300;
}
.product-card.selected {
  @apply border-blue-500 bg-blue-50;
}
.product-card-head {
  @apply mb-1.5 flex items-center justify-between;
}
.product-title {
  @apply text-[0.95rem] font-semibold text-gray-900;
}
.product-rate {
  @apply text-[0.75rem] font-medium text-blue-500;
}
.product-desc {
  @apply mb-2.5 text-[0.8rem] text-gray-500;
}
.product-range {
  @apply flex justify-between text-[0.75rem] text-gray-400;
}
</style>
