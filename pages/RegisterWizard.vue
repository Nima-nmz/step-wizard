<script setup lang="ts">
import { useWizardStore } from '~/stores/wizardStore'
import WizardLayout from '~/components/WizardLayout.vue'
import Step1PhoneAuth from '~/components/Step1PhoneAuth.vue'
import Step2PersonalInfo from '~/components/Step2PersonalInfo.vue'
import Step3Submit from '~/components/Step3Submit.vue'

const store = useWizardStore()
</script>

<template>
  <div class="register-page">
    <header class="wizard-header">
      <h1>ثبت‌نام کاربر جدید</h1>
      <p>لطفاً مراحل زیر را تکمیل کنید</p>
    </header>

    <WizardLayout>
      <template v-if="store.currentStep === 1">
        <Step1PhoneAuth />
      </template>

      <template v-if="store.currentStep === 2">
        <Step2PersonalInfo />
      </template>

      <template v-if="store.currentStep === 3">
        <Step3Submit />
      </template>
    </WizardLayout>
  </div>
</template>

<style scoped>
.register-page { min-height: 100vh; background: #f3f4f6; padding: 2rem 1rem; }
.wizard-header { text-align: center; margin-bottom: 2rem; }
.wizard-header h1 { margin: 0 0 0.5rem; font-size: 1.75rem; }
.wizard-header p { margin: 0; color: #6b7280; }
</style>
