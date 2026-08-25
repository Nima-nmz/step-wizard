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
@reference "~/assets/css/main.css";

.wizard-layout {
  @apply mx-auto max-w-[700px] px-4 py-6 font-[inherit];
}
.progress-bar {
  @apply relative mb-10 flex items-start;
}
.step-indicator {
  @apply relative z-[1] flex flex-1 flex-col items-center;
}
.step-circle {
  @apply flex h-[42px] w-[42px] items-center justify-center rounded-full border-[3px] border-gray-200 bg-white text-[0.95rem] font-semibold text-gray-400 transition-[border-color,background-color,color] duration-250;
}
.step-indicator.active .step-circle {
  @apply border-blue-500 text-blue-500;
}
.step-indicator.completed .step-circle {
  @apply border-green-500 bg-green-500 text-white;
}
.step-label {
  @apply mt-2 text-center text-[0.8rem] text-gray-400 transition-[color,font-weight] duration-250;
}
.step-indicator.active .step-label,
.step-indicator.completed .step-label {
  @apply text-gray-700 font-medium;
}
.step-line {
  @apply absolute top-[21px] z-0 h-[3px] bg-gray-200 transition-colors duration-300;
  inset-inline-start: 59%;
  inset-inline-end: -50%;
}
.step-line.active {
  @apply bg-green-500;
}
.step-content {
  @apply min-h-[300px];
}
.wizard-nav {
  @apply mt-8 flex items-center justify-between gap-3 border-t border-gray-200 pt-6;
}
.nav-spacer {
  @apply w-20;
}
button {
  @apply rounded-lg px-8 py-3 text-base font-medium cursor-pointer transition-[background-color,transform,opacity] duration-200;
}
button:active {
  @apply scale-[0.97];
}
button:focus-visible {
  @apply outline-2 outline-blue-500 outline-offset-2;
}
.btn-prev {
  @apply bg-gray-100 text-gray-700;
}
.btn-prev:hover {
  @apply bg-gray-200;
}
.btn-next {
  @apply bg-blue-500 text-white;
}
.btn-next:hover:not(:disabled) {
  @apply bg-blue-600;
}
.btn-next:disabled {
  @apply opacity-50 cursor-not-allowed;
}
@media (max-width: 480px) {
  .step-label { @apply text-[0.7rem]; }
  .step-circle { @apply h-[34px] w-[34px] text-[0.85rem]; }
  button { @apply px-5 py-2.5 text-[0.9rem]; }
}
</style>
