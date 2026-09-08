<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { LoanGuarantor } from '~/types/loan'
import { validatePersianName, validateNationalId, validatePhone, validateRequired } from '~/lib/validations'
import FormField from '~/components/ui/FormField.vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

defineProps<{ submitting: boolean }>()
const emit = defineEmits<{ submit: [payload: LoanGuarantor] }>()

const fullName = ref('')
const nationalId = ref('')
const phoneNumber = ref('')
const relationship = ref('')

const fieldErrors = reactive<Record<string, string>>({
  fullName: '',
  nationalId: '',
  phoneNumber: '',
  relationship: '',
})

function validateField(field: string) {
  let result: string | true = true
  switch (field) {
    case 'fullName':
      result = validatePersianName(fullName.value, 'نام ضامن')
      fieldErrors.fullName = result === true ? '' : result
      break
    case 'nationalId':
      result = validateNationalId(nationalId.value)
      fieldErrors.nationalId = result === true ? '' : result
      break
    case 'phoneNumber':
      result = validatePhone(phoneNumber.value)
      fieldErrors.phoneNumber = result === true ? '' : result
      break
    case 'relationship':
      result = validateRequired(relationship.value, 'نسبت ضامن')
      fieldErrors.relationship = result === true ? '' : result
      break
  }
}

function clearFieldError(field: string) {
  fieldErrors[field] = ''
}

function submit() {
  validateField('fullName')
  validateField('nationalId')
  validateField('phoneNumber')
  validateField('relationship')

  const hasErrors = Object.values(fieldErrors).some(e => e)
  if (hasErrors) return

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
    <FormField label="نام و نام‌خانوادگی ضامن" :error="fieldErrors.fullName">
      <Input v-model="fullName" type="text"
        :class="{ 'has-error': fieldErrors.fullName }"
        @input="clearFieldError('fullName')"
        @blur="validateField('fullName')" />
    </FormField>

    <FormField label="کد ملی ضامن" :error="fieldErrors.nationalId">
      <Input v-model="nationalId" type="text" maxlength="10"
        :class="{ 'has-error': fieldErrors.nationalId }"
        @input="clearFieldError('nationalId')"
        @blur="validateField('nationalId')" />
    </FormField>

    <FormField label="شماره موبایل ضامن" :error="fieldErrors.phoneNumber">
      <Input v-model="phoneNumber" type="tel" maxlength="11"
        :class="{ 'has-error': fieldErrors.phoneNumber }"
        @input="clearFieldError('phoneNumber')"
        @blur="validateField('phoneNumber')" />
    </FormField>

    <FormField label="نسبت با متقاضی" :error="fieldErrors.relationship">
      <Input v-model="relationship" type="text" placeholder="مثلاً همکار، اقوام"
        :class="{ 'has-error': fieldErrors.relationship }"
        @input="clearFieldError('relationship')"
        @blur="validateField('relationship')" />
    </FormField>

    <Button variant="secondary" :loading="submitting" @click="submit">
      {{ submitting ? 'در حال ثبت...' : 'ثبت اطلاعات ضامن' }}
    </Button>
  </div>
</template>

<style scoped>
</style>
