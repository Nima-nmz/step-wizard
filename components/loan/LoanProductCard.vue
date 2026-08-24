<script setup lang="ts">
import type { LoanProduct } from '~/types/loan'

defineProps<{ product: LoanProduct; selected: boolean }>()
defineEmits<{ select: [] }>()

function formatAmount(amount: number) {
  return new Intl.NumberFormat('fa-IR').format(amount)
}
</script>

<template>
  <button type="button" class="product-card" :class="{ selected }" @click="$emit('select')">
    <div class="product-card-head">
      <span class="product-title">{{ product.title }}</span>
      <span class="product-rate">{{ product.interestRate }}٪ سود سالانه</span>
    </div>
    <p class="product-desc">{{ product.description }}</p>
    <div class="product-range">
      <span>{{ formatAmount(product.minAmount) }} تا {{ formatAmount(product.maxAmount) }} تومان</span>
      <span>{{ product.minDurationMonths }} تا {{ product.maxDurationMonths }} ماه</span>
    </div>
  </button>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.product-card {
  @apply block w-full cursor-pointer rounded-xl border-2 border-gray-200 bg-white p-4 text-right font-[inherit] transition-[border-color,background-color] duration-200;
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
