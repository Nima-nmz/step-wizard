<script setup lang="ts">
import { useWizardStore } from '~/stores/wizardStore'
import { useWizard } from '~/composables/useWizard'
import { storeToRefs } from 'pinia'

const store = useWizardStore()
const { isSubmitting } = storeToRefs(store)
const { currentStep, isFirstStep, isLastStep, nextStep, prevStep, canGoNext } = useWizard()

const steps = [
  { number: 1, title: 'احراز هویت' },
  { number: 2, title: 'اطلاعات و فایل' },
  { number: 3, title: 'تأیید و ارسال' },
]

const emit = defineEmits<{ submit: [] }>()
</script>

<template>
  <div class="wizard-layout" dir="rtl">
    <div class="progress-bar">
      <div
        v-for="(step, index) in steps"
        :key="step.number"
        class="step-indicator"
        :class="{ active: currentStep >= step.number, completed: currentStep > step.number }"
      >
        <div class="step-circle">{{ step.number }}</div>
        <div class="step-label">{{ step.title }}</div>
        <div v-if="index < steps.length - 1" class="step-line" :class="{ active: currentStep > step.number }" />
      </div>
    </div>

    <div class="step-content">
      <slot />
    </div>

    <div class="wizard-nav">
      <button v-if="!isFirstStep" @click="prevStep" class="btn-prev">قبلی</button>

      <div v-if="isLastStep" class="nav-spacer" />

      <button v-if="!isLastStep" @click="nextStep" :disabled="!canGoNext" class="btn-next">بعدی</button>


    </div>
  </div>
</template>

<style scoped>
.wizard-layout {
  max-width: 700px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
  font-family: inherit;
}

/* ---------- Progress bar ---------- */
.progress-bar {
  display: flex;
  align-items: flex-start;
  margin-bottom: 2.5rem;
  position: relative;
}

.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
  z-index: 1;
}

.step-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 3px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.95rem;
  background: #fff;
  color: #9ca3af;
  transition: border-color 0.25s ease, background-color 0.25s ease, color 0.25s ease;
}

.step-indicator.active .step-circle {
  border-color: #3b82f6;
  color: #3b82f6;
}

.step-indicator.completed .step-circle {
  border-color: #22c55e;
  background: #22c55e;
  color: #fff;
}

.step-label {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #9ca3af;
  text-align: center;
  transition: color 0.25s ease, font-weight 0.25s ease;
}

.step-indicator.active .step-label,
.step-indicator.completed .step-label {
  color: #374151;
  font-weight: 500;
}

/* از منطق inline استفاده می‌کنیم تا در RTL درست بشه */
.step-line {
  position: absolute;
  top: 21px;
  inset-inline-start: 59%;
  inset-inline-end: -50%;
  height: 3px;
  background: #e5e7eb;
  z-index: 0;
  transition: background-color 0.3s ease;
}

.step-line.active {
  background: #22c55e; /* رنگ سبز چون یعنی مرحله رد شده */
}

/* ---------- محتوای مرحله ---------- */
.step-content {
  min-height: 300px;
}

/* ---------- ناوبری ---------- */
.wizard-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
  gap: 0.75rem;
}

.nav-spacer {
  width: 80px;
}

button {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease, opacity 0.2s ease;
}

button:active {
  transform: scale(0.97);
}

button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.btn-prev {
  background: #f3f4f6;
  color: #374151;
}
.btn-prev:hover {
  background: #e5e7eb;
}

.btn-next {
  background: #3b82f6;
  color: #fff;
}
.btn-next:hover:not(:disabled) {
  background: #2563eb;
}
.btn-next:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-submit {
  background: #22c55e;
  color: #fff;
  min-width: 130px;
}
.btn-submit:hover:not(:disabled) {
  background: #16a34a;
}
.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ---------- ریسپانسیو ---------- */
@media (max-width: 480px) {
  .step-label {
    font-size: 0.7rem;
  }
  .step-circle {
    width: 34px;
    height: 34px;
    font-size: 0.85rem;
  }
  .wizard-nav button {
    padding: 0.65rem 1.25rem;
    font-size: 0.9rem;
  }
}
</style>
