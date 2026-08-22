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
.product-card {
  display: block;
  width: 100%;
  text-align: right;
  padding: 1rem 1.1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.product-card:hover {
  border-color: #93c5fd;
}

.product-card.selected {
  border-color: #3b82f6;
  background: #eff6ff;
}

.product-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.4rem;
}

.product-title {
  font-weight: 600;
  font-size: 0.95rem;
  color: #111827;
}

.product-rate {
  font-size: 0.75rem;
  color: #3b82f6;
  font-weight: 500;
}

.product-desc {
  margin: 0 0 0.6rem;
  font-size: 0.8rem;
  color: #6b7280;
}

.product-range {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #9ca3af;
}
</style>