<script setup lang="ts">
import { useWizardStore } from '~/stores/wizardStore'
import { registerApi } from '~/services/useRegister.service'
import { storeToRefs } from 'pinia'

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
      <button @click="store.clearStore" class="reset-btn">ثبت‌نام جدید</button>
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

      <button @click="submitForm" :disabled="store.isSubmitting" class="submit-btn">
<span v-if="store.isSubmitting" class="spinner" />
        <span v-else>تأیید و ثبت‌نام</span>
      </button>

      <div v-if="validationErrors.general" class="general-error">
        {{ validationErrors.general }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.step-card {
  padding: 1.75rem;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
}

.step-card h3 {
  margin: 0 0 1.5rem;
  font-size: 1.15rem;
  font-weight: 600;
  color: #111827;
}

/* ---------- پیام موفقیت ---------- */
.success-message {
  text-align: center;
  padding: 2.5rem 1rem;
}

.success-message svg {
  color: #22c55e;
  margin-bottom: 1rem;
}

.success-message h4 {
  margin: 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
}

.success-message p {
  color: #6b7280;
  font-size: 0.9rem;
}

.reset-btn {
  margin-top: 1.5rem;
  width: 100%;
  padding: 0.75rem;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.reset-btn:hover {
  background: #e5e7eb;
}

.reset-btn:active {
  transform: scale(0.98);
}

.reset-btn:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* ---------- خلاصه اطلاعات ---------- */
.summary {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.summary-section {
  padding: 1rem 1.25rem;
  background: #f9fafb;
  border: 1px solid #f1f2f4;
  border-radius: 10px;
}

.summary-section h4 {
  margin: 0 0 0.6rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.goto-loans-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #3b82f6;
  color: #fff;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: background-color 0.2s ease, transform 0.1s ease;
}
.goto-loans-btn:hover { background: #2563eb; }
.goto-loans-btn:active { transform: scale(0.98); }
.goto-loans-btn:focus-visible { outline: 2px solid #3b82f6; outline-offset: 2px; }

.summary-section p {
  margin: 0.3rem 0;
  font-size: 0.95rem;
  color: #1f2937;
  line-height: 1.6;
}

.preview-img {
  max-width: 160px;
  max-height: 160px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  display: block;
}

/* ---------- دکمه ارسال ---------- */
.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  font-size: 1.05rem;
  font-weight: 500;
  font-family: inherit;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.submit-btn:hover:not(:disabled) {
  background: #2563eb;
}

.submit-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.submit-btn:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.submit-btn:disabled {
  background: #93c5fd;
  cursor: not-allowed;
}

.spinner {
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ---------- خطای عمومی ---------- */
.general-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 1rem;
}

@media (max-width: 480px) {
  .step-card {
    padding: 1.25rem;
  }
  .summary-section {
    padding: 0.85rem 1rem;
  }
}
</style>
