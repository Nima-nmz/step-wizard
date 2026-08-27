<script setup lang="ts">
import { ref } from 'vue'
import type { LoanGuarantor } from '~/types/loan'
import FormField from '~/components/ui/FormField.vue'
import LoadingButton from '~/components/ui/LoadingButton.vue'

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
    <FormField label="نام و نام‌خانوادگی ضامن" :error="errors.fullName">
      <input v-model="fullName" type="text" :class="{ 'has-error': errors.fullName }" />
    </FormField>

    <FormField label="کد ملی ضامن" :error="errors.nationalId">
      <input v-model="nationalId" type="text" maxlength="10" :class="{ 'has-error': errors.nationalId }" />
    </FormField>

    <FormField label="شماره موبایل ضامن" :error="errors.phoneNumber">
      <input v-model="phoneNumber" type="tel" maxlength="11" :class="{ 'has-error': errors.phoneNumber }" />
    </FormField>

    <FormField label="نسبت با متقاضی" :error="errors.relationship">
      <input v-model="relationship" type="text" placeholder="مثلاً همکار، اقوام" :class="{ 'has-error': errors.relationship }" />
    </FormField>

    <LoadingButton variant="neutral" :loading="submitting" @click="submit">
      {{ submitting ? 'در حال ثبت...' : 'ثبت اطلاعات ضامن' }}
    </LoadingButton>
  </div>
</template>

<style scoped>
</style>

