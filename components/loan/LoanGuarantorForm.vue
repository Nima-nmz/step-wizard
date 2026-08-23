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
.form-row { margin-bottom: 1rem; }
.form-row label {
  display: block;
  margin-bottom: 0.4rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: #374151;
}
.form-row input {
  width: 100%;
  padding: 0.65rem 0.75rem;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.form-row input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}
.form-row input.has-error { border-color: #ef4444; }

.error {
  display: block;
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.3rem;
}

.btn-guarantor {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.7rem;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.btn-guarantor:hover:not(:disabled) { background: #e5e7eb; }
.btn-guarantor:disabled { opacity: 0.6; cursor: not-allowed; }

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid #d1d5db;
  border-top-color: #374151;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>