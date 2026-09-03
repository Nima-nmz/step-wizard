<script setup lang="ts">
import { useWizardStore } from '~/stores/wizardStore'
import { registerApi } from '~/services/useRegister.service'
import { storeToRefs } from 'pinia'
import { Button } from '@/components/ui/button'

const store = useWizardStore()
const { validationErrors } = storeToRefs(store)

async function submitForm() {
  if (!store.idCardFile) return

  const payload = {
    phone_number: store.phoneNumber,
    first_name: store.personalInfo.firstName,
    last_name: store.personalInfo.lastName,
    national_id: store.personalInfo.nationalId,
    birth_date: store.personalInfo.birthDate,
    email: store.personalInfo.email || undefined,
    national_id_image: store.idCardFile,
  }

  try {
    await registerApi(payload)
  } catch {
    // خطاها در store.validationErrors قرار گرفته‌اند
  }
}
</script>

<template>
  <div class="step-card">
    <h3>مرحله ۳: تأیید و ارسال</h3>

    <div v-if="store.submitSuccess" class="success-message">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
      <h4>ثبت‌نام با موفقیت انجام شد</h4>
      <p>اطلاعات شما ثبت گردید.</p>
      <NuxtLink to="/loans" class="goto-loans-btn">مشاهده وام‌ها</NuxtLink>
      <Button @click="store.clearStore" variant="secondary" class="w-full">ثبت‌نام جدید</Button>
    </div>

    <div v-else class="summary">
      <div class="summary-section">
        <h4>شماره موبایل</h4>
        <p>{{ store.phoneNumber }}</p>
      </div>

      <div class="summary-section">
        <h4>اطلاعات شخصی</h4>
        <p>{{ store.personalInfo.firstName }} {{ store.personalInfo.lastName }}</p>
        <p>کد ملی: {{ store.personalInfo.nationalId }}</p>
        <p>تاریخ تولد: {{ store.personalInfo.birthDate }}</p>
        <p v-if="store.personalInfo.email">ایمیل: {{ store.personalInfo.email }}</p>
      </div>

      <div class="summary-section">
        <h4>کارت ملی</h4>
        <img v-if="store.idCardPreview" :src="store.idCardPreview" alt="کارت ملی" class="preview-img" />
      </div>
      <div class="flex justify-center">
      <Button @click="submitForm" variant="success" size="lg" :disabled="store.isSubmitting" class="w-70 justify-center items-center text-center mt-2">
<span v-if="store.isSubmitting" class="spinner" />
        <span v-else>تأیید و ثبت‌نام</span>
      </Button>
      </div>
      <div v-if="validationErrors.general" class="general-error">
        {{ validationErrors.general }}
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.step-card {
  @apply rounded-xl bg-white p-7 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)];
}
.step-card h3 {
  @apply mb-6 text-[1.15rem] font-semibold text-gray-900;
}
.success-message {
  @apply py-10 space-y-2 px-4 text-center;
}
.success-message svg {
  @apply mb-4 text-green-500;
}
.success-message h4 {
  @apply my-2 text-[1.1rem] font-semibold text-gray-900;
}
.success-message p {
  @apply text-[0.9rem] text-gray-500;
}
.summary {
  @apply flex flex-col gap-5;
}
.summary-section {
  @apply rounded-[10px] border border-gray-100 bg-gray-50 p-5;
}
.summary-section h4 {
  @apply mb-2.5 text-[0.8rem] font-semibold uppercase tracking-[0.02em] text-gray-500;
}
.goto-loans-btn {
  @apply mt-4 flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-500 px-3 py-3 text-[0.95rem] font-medium text-white no-underline transition-[background-color,transform] duration-200;
}
.goto-loans-btn:hover { @apply bg-blue-600; }
.goto-loans-btn:active { @apply scale-[0.98]; }
.goto-loans-btn:focus-visible { @apply outline-2 outline-blue-500 outline-offset-2; }
.summary-section p {
  @apply my-1 text-[0.95rem] leading-relaxed text-gray-800;
}
.preview-img {
  @apply mt-2 block max-w-[160px] max-h-[160px] rounded-lg border border-gray-200 object-cover;
}
.spinner {
  @apply h-[15px] w-[15px] rounded-full border-2 border-white/40 border-t-white;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.general-error {
  @apply mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3.5 text-[0.875rem] text-red-600;
}
@media (max-width: 480px) {
  .step-card { @apply p-5; }
  .summary-section { @apply p-3.5; }
}
</style>
