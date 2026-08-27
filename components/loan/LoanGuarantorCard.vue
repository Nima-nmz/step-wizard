<script setup lang="ts">
import type { LoanGuarantor } from '~/types/loan'

defineProps<{
  guarantor: LoanGuarantor
}>()
</script>

<template>
  <div class="guarantor-grid">
    <div class="info-box">
      <span class="info-label">نام و نام‌خانوادگی</span>
      <span class="info-value">{{ guarantor.fullName }}</span>
    </div>
    <div class="info-box">
      <span class="info-label">کد ملی</span>
      <span class="info-value">{{ guarantor.nationalId }}</span>
    </div>
    <div class="info-box">
      <span class="info-label">شماره تماس</span>
      <span class="info-value">{{ guarantor.phoneNumber }}</span>
    </div>
    <div class="info-box">
      <span class="info-label">نسبت با متقاضی</span>
      <span class="info-value">{{ guarantor.relationship }}</span>
    </div>
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";
.guarantor-grid { @apply grid grid-cols-1 gap-2 sm:grid-cols-2; }
.info-box { @apply flex flex-col gap-1 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3; }
.info-label { @apply text-[0.7rem] font-medium uppercase tracking-wide text-gray-400; }
.info-value { @apply text-[0.9rem] font-semibold text-gray-800; }
</style>
