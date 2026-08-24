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
@reference "~/assets/css/main.css";

.register-page { @apply min-h-screen bg-gray-100 px-4 py-8; }
.wizard-header { @apply mb-8 text-center; }
.wizard-header h1 { @apply mb-2 text-[1.75rem]; }
.wizard-header p { @apply text-gray-500; }
</style>
