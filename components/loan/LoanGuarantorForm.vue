<script setup lang="ts">
import { ref } from 'vue'
import type { LoanGuarantor } from '~/types/loan'

defineProps<{ submitting: boolean; errors: Record<string, string> }>()
const emit = defineEmits<{ submit: [payload: LoanGuarantor] }>()

const fullName = ref('')
const nationalId = ref('')
const phoneNumber = ref('')
const relationship = ref('')

function submit() {
  emit('submit', {
    fullName: fullName.value,
    nationalId: nationalId.value,
    phoneNumber: phoneNumber.value,
    relationship: relationship.value,
  })
}
</script>

<template>
  <div class="guarantor-form">
    <div class="form-row">
      <label>نام و نام‌خانوادگی ضامن</label>
      <input v-model="fullName" type="text" :class="{ 'has-error': errors.fullName }" />
      <span v-if="errors.fullName" class="error">{{ errors.fullName }}</span>
    </div>

    <div class="form-row">
      <label>کد ملی ضامن</label>
      <input v-model="nationalId" type="text" maxlength="10" :class="{ 'has-error': errors.nationalId }" />
      <span v-if="errors.nationalId" class="error">{{ errors.nationalId }}</span>
    </div>

    <div class="form-row">
      <label>شماره موبایل ضامن</label>
      <input v-model="phoneNumber" type="tel" maxlength="11" :class="{ 'has-error': errors.phoneNumber }" />
      <span v-if="errors.phoneNumber" class="error">{{ errors.phoneNumber }}</span>
    </div>

    <div class="form-row">
      <label>نسبت با متقاضی</label>
      <input v-model="relationship" type="text" placeholder="مثلاً همکار، اقوام" :class="{ 'has-error': errors.relationship }" />
      <span v-if="errors.relationship" class="error">{{ errors.relationship }}</span>
    </div>

    <button class="btn-guarantor" :disabled="submitting" @click="submit">
      <span v-if="submitting" class="spinner" />
      {{ submitting ? 'در حال ثبت...' : 'ثبت اطلاعات ضامن' }}
    </button>
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.form-row { @apply mb-4; }
.form-row label {
  @apply mb-1.5 block text-[0.85rem] font-medium text-gray-700;
}
.form-row input {
  @apply w-full rounded-lg border-[1.5px] border-gray-300 bg-white px-3 py-2.5 text-[0.9rem] font-[inherit] box-border transition-[border-color,box-shadow] duration-200;
}
.form-row input:focus {
  @apply border-blue-500 outline-none shadow-[0_0_0_3px_rgba(59,130,246,0.15)];
}
.form-row input.has-error { @apply border-red-500; }
.error {
  @apply mt-1.5 block text-[0.75rem] text-red-500;
}
.btn-guarantor {
  @apply flex w-full items-center justify-center gap-2 rounded-lg border-none bg-gray-100 p-[0.7rem] text-[0.9rem] font-medium text-gray-700 cursor-pointer transition-colors duration-200;
}
.btn-guarantor:hover:not(:disabled) { @apply bg-gray-200; }
.btn-guarantor:disabled { @apply cursor-not-allowed opacity-60; }
.spinner {
  @apply h-[14px] w-[14px] rounded-full border-2 border-gray-300 border-t-gray-700;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
