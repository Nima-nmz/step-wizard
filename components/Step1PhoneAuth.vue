<script setup lang="ts">
import { useWizardStore } from '~/stores/wizardStore'
import { sendOtpApi, verifyOtpApi } from '~/services/Useauth.service'
import { useOTP } from '~/composables/useOTP'
import { useAdminAuth } from '~/composables/useAdminAuth'
import { storeToRefs } from 'pinia'
import InputOTP from './ui/input-otp/InputOTP.vue'
import InputOTPGroup from './ui/input-otp/InputOTPGroup.vue'
import InputOTPSlot from './ui/input-otp/InputOTPSlot.vue'
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'vue-input-otp'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const store = useWizardStore()
const { validationErrors } = storeToRefs(store)
const { handleAdminRedirect } = useAdminAuth()
const { formattedTime, isRunning, canResend, start, reset } = useOTP(120)

let hasRequestedOtp = false

const statusClass = computed(() => {
  if (store.otpStatus === 'verified') {
    return '!border-green-500 !ring-green-500 text-green-600 bg-green-50/30'
  }
  if (store.otpStatus === 'failed') {
    return '!border-destructive !ring-destructive text-destructive bg-destructive/10'
  }
  return ''
})

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
    const data = await verifyOtpApi(store.phoneNumber, store.otpCode)
    store.setRole(data.role)
    store.setAuthToken(data.token)
    store.setOtpStatus('verified')
    handleAdminRedirect(data.role)
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
      <Input 
      v-model="store.phoneNumber" 
      type="tel" 
      class="phone-input"
      inputmode="numeric" 
      placeholder="۰۹xxxxxxxxx" 
      maxlength="11" 
      :disabled="store.otpStatus === 'sent' && isRunning" 
      :class="{ 'has-error': validationErrors.phone_number }"  />

      <span v-if="validationErrors.phone_number" class="error">
        {{ validationErrors.phone_number }}
      </span>
    </div>

    <Button
      v-if="!hasRequestedOtp"
      variant="info"
      class="w-l"
      @click="sendOtp"
      :disabled="isRunning || store.otpStatus === 'sending'"
    >
      <span v-if="store.otpStatus === 'sending'" class="spinner" />
      ارسال کد
    </Button>

    <div v-if="hasRequestedOtp" class="otp-section">
      <div class="flex gap-5">
      <label for="otp">کد تأیید : </label>
      
        <InputOTP 
        id="otp" 
        class="otp-input"
        v-model="store.otpCode" 
        @input="store.setOtpCode(($event.target as HTMLInputElement).value)" 
        inputmode="numeric" 
        :maxlength="6"
        :pattern="REGEXP_ONLY_DIGITS_AND_CHARS
        ">
    <InputOTPGroup dir="ltr">
        <InputOTPSlot 
          v-for="index in 6" 
          :key="index - 1" 
          :index="index - 1" 
          :class="statusClass"
        />
    </InputOTPGroup>
  </InputOTP>
  </div>

      <span v-if="validationErrors.code" class="error">{{ validationErrors.code }}</span>
      <span v-if="store.otpStatus === 'verified'" class="success">شماره موبایل با موفقیت تأیید شد</span>

      <div class="otp-actions">
        <Button 
        class="flex-1" 
        variant="success" 
        size="lg" 
        @click="verifyOtp"
        :disabled="store.otpCode.length !== 6 || store.otpStatus === 'verifying' || store.otpStatus === 'verified'">
                  <span v-if="store.otpStatus === 'verifying'" class="spinner" />
           تأیید
        </Button>
        
        <Button class="flex-1" variant="secondary" @click="resendOtp" :disabled="!canResend">
          {{ isRunning ? `ارسال مجدد (${formattedTime})` : 'ارسال مجدد' }}
        </Button>
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
  @apply mb-1.5 text-[1.15rem] font-semibold text-gray-900;
}
.step-desc {
  @apply mb-6 text-[0.875rem] text-gray-500;
}
.form-group {
  @apply mb-4;
}
.form-group label {
  @apply mb-2 block text-[0.9rem] font-medium text-gray-700;
}
.form-group input {
  @apply w-full rounded-lg border-[1.5px] border-gray-300 bg-white p-3 text-base font-[inherit] transition-[border-color,box-shadow] duration-200 box-border;
}
.form-group input:focus {
  @apply border-blue-500 outline-none shadow-[0_0_0_3px_rgba(59,130,246,0.15)];
}
.form-group input:disabled {
  @apply bg-gray-50 text-gray-400 cursor-not-allowed;
}
.form-group input.has-error {
  @apply border-red-500;
}
.form-group input.has-error:focus {
  @apply shadow-[0_0_0_3px_rgba(239,68,68,0.15)];
}
.phone-input {
  letter-spacing: 0.5px;
}
.otp-input {
  @apply text-center text-[1.25rem] font-semibold;
  letter-spacing: 8px;
  font-family: 'Courier New', monospace;
}
.otp-input.is-verified {
  @apply border-green-500 bg-green-50 text-green-600;
}
.error {
  @apply mt-1.5 block text-[0.8rem] text-red-500;
}
.success {
  @apply mt-1.5 block text-[0.8rem] text-green-600;
}
.btn {
  @apply inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-base font-medium font-[inherit] cursor-pointer transition-[background-color,transform,opacity] duration-200 border-none;
}
.btn:active:not(:disabled) {
  @apply scale-[0.97];
}
.btn:focus-visible {
  @apply outline-2 outline-blue-500 outline-offset-2;
}
.btn:disabled {
  @apply cursor-not-allowed opacity-[0.55];
}
.btn-primary {
  @apply w-full bg-blue-500 text-white;
}
.btn-primary:hover:not(:disabled) {
  @apply bg-blue-600;
}
.btn-secondary {
  @apply bg-gray-100 text-gray-700;
}
.btn-secondary:hover:not(:disabled) {
  @apply bg-gray-200;
}
.spinner {
  @apply h-[14px] w-[14px] rounded-full border-2 border-white/40 border-t-white;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.otp-section {
  @apply mt-6 border-t border-gray-100 pt-6;
}
.otp-actions {
  @apply mt-4 flex gap-3;
}
@media (max-width: 480px) {
  .step-card { @apply p-5; }
  .otp-actions { @apply flex-col; }
}
</style>
