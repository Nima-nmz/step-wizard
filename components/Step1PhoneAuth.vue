<script setup lang="ts">
import { useWizardStore } from '~/stores/wizardStore'
import { sendOtpApi, verifyOtpApi } from '~/services/Useauth.service'
import { useOTP } from '~/composables/useOTP'
import { storeToRefs } from 'pinia'

const store = useWizardStore()
const { validationErrors } = storeToRefs(store)
const { formattedTime, isRunning, canResend, start, reset } = useOTP(120)

let hasRequestedOtp = false

async function sendOtp() {
  if (!/^09\d{9}$/.test(store.phoneNumber)) {
    store.setValidationErrors({ phone_number: 'شماره موبایل معتبر نیست' })
    return
  }
  store.setValidationErrors({})
  store.setOtpStatus('sending')

  try {
    await sendOtpApi(store.phoneNumber)
    store.setOtpStatus('sent')
    hasRequestedOtp = true
    start()
  } catch {
    store.setOtpStatus('failed')
  }
}

async function verifyOtp() {
  if (store.otpCode.length !== 6) return
  store.setOtpStatus('verifying')

  try {
    const data =  await verifyOtpApi(store.phoneNumber,store.otpCode)
    store.setAuthToken(data.token)
    store.setOtpStatus('verified')
  } catch (error: any) {
    store.setOtpStatus('failed')
    if (error?.data?.errors) {
      const fieldErrors: Record<string, string> = {}
      Object.entries(error.data.errors).forEach(([field, msgs]) => {
        fieldErrors[field] = Array.isArray(msgs) ? msgs[0] : String(msgs)
      })
      store.setValidationErrors(fieldErrors)
    }
  }
}

function resendOtp() {
  if (!canResend.value) return
  reset()
  sendOtp()
}
</script>

<template>
  <div class="step-card">
    <h3>مرحله ۱: احراز هویت</h3>
    <p class="step-desc">شماره موبایل خود را وارد کنید تا کد تأیید برایتان پیامک شود.</p>

    <div class="form-group">
      <label for="phone">شماره موبایل</label>
      <input
        id="phone"
        v-model="store.phoneNumber"
        type="tel"
        inputmode="numeric"
        maxlength="11"
        placeholder="۰۹xxxxxxxxx"
        class="phone-input"
        :class="{ 'has-error': validationErrors.phone_number }"
        :disabled="store.otpStatus === 'sent' && isRunning"
      />
      <span v-if="validationErrors.phone_number" class="error">
        {{ validationErrors.phone_number }}
      </span>
    </div>

    <button
      v-if="!hasRequestedOtp"
      class="btn btn-primary"
      @click="sendOtp"
      :disabled="isRunning || store.otpStatus === 'sending'"
    >
      <span v-if="store.otpStatus === 'sending'" class="spinner" />
    ارسال کد
    </button>

    <div v-if="hasRequestedOtp" class="otp-section">
      <label for="otp">کد تأیید</label>
      <input
        id="otp"
        v-model="store.otpCode"
        type="text"
        inputmode="numeric"
        maxlength="6"
        placeholder="- - - - - -"
        class="otp-input"
        :class="{ 'has-error': validationErrors.code, 'is-verified': store.otpStatus === 'verified' }"
        :disabled="store.otpStatus === 'verified'"
        @input="store.setOtpCode(($event.target as HTMLInputElement).value)"
      />
      <span v-if="validationErrors.code" class="error">{{ validationErrors.code }}</span>
      <span v-if="store.otpStatus === 'verified'" class="success">شماره موبایل با موفقیت تأیید شد</span>

      <div class="otp-actions">
        <button
          class="btn btn-primary"
          @click="verifyOtp"
          :disabled="store.otpCode.length !== 6 || store.otpStatus === 'verifying' || store.otpStatus === 'verified'"
        >
          <span v-if="store.otpStatus === 'verifying'" class="spinner" />
          تأیید
        </button>
        <button class="btn btn-secondary" @click="resendOtp" :disabled="!canResend">
         {{ isRunning ? `ارسال مجدد (${formattedTime})` : 'ارسال مجدد' }}
        </button>
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
  margin: 0 0 0.35rem;
  font-size: 1.15rem;
  font-weight: 600;
  color: #111827;
}

.step-desc {
  margin: 0 0 1.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;
  color: #374151;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.form-group input:disabled {
  background: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.form-group input.has-error {
  border-color: #ef4444;
}
.form-group input.has-error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

/* اینپوت شماره موبایل و OTP باید اعداد رو خواناتر نشون بدن */
.phone-input {
  letter-spacing: 0.5px;
}

.otp-input {
  text-align: center;
  letter-spacing: 8px;
  font-size: 1.25rem;
  font-weight: 600;
  font-family: 'Courier New', monospace;
}

.otp-input.is-verified {
  border-color: #22c55e;
  background: #f0fdf4;
  color: #16a34a;
}

.error {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.375rem;
  display: block;
}

.success {
  color: #16a34a;
  font-size: 0.8rem;
  margin-top: 0.375rem;
  display: block;
}

/* ---------- دکمه‌ها ---------- */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease, opacity 0.2s ease;
}

.btn:active:not(:disabled) {
  transform: scale(0.97);
}

.btn:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.btn-primary {
  background: #3b82f6;
  color: #fff;
  width: 100%;
}
.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}
.btn-secondary:hover:not(:disabled) {
  background: #e5e7eb;
}

.spinner {
  width: 14px;
  height: 14px;
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

/* ---------- بخش OTP ---------- */
.otp-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.otp-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.otp-actions .btn {
  flex: 1;
  width: auto;
}

@media (max-width: 480px) {
  .step-card {
    padding: 1.25rem;
  }
  .otp-actions {
    flex-direction: column;
  }
}
</style>
