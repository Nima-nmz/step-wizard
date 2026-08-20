import type { RegisterSuccessResponse, RegisterPayload } from '~/types/wizard'
import { useWizardStore } from '~/stores/wizardStore'
import { REGISTER_URLS } from './api.config'
import { useFetchApi } from './useFetchApi'

export async function registerApi(payload: RegisterPayload): Promise<RegisterSuccessResponse> {
  const store = useWizardStore()
  store.setSubmitting(true)
  store.setValidationErrors({})

  const formData = new FormData()
  formData.append('phone_number', payload.phone_number)
  formData.append('first_name', payload.first_name)
  formData.append('last_name', payload.last_name)
  formData.append('national_id', payload.national_id)
  formData.append('birth_date', payload.birth_date)
  if (payload.email) formData.append('email', payload.email)
  formData.append('national_id_image', payload.national_id_image)

  if (!store.authToken) {
  store.setSubmitting(false)
  store.setValidationErrors({ general: 'نشست شما منقضی شده است، لطفاً دوباره شماره موبایل را تأیید کنید.' })
  throw new Error('missing_auth_token')
}

  const fetchData = useFetchApi<RegisterSuccessResponse>()

  try {
    const data = await fetchData(REGISTER_URLS.register.url, {
      method: 'POST',
      body: formData,
    })
    store.setSubmitSuccess(true)
    return data
  } catch (error: any) {
    if (error?.status === 422 && error?.data?.errors) {
      const fieldErrors: Record<string, string> = {}
      Object.entries(error.data.errors).forEach(([field, msgs]) => {
        fieldErrors[field] = Array.isArray(msgs) ? msgs[0] : String(msgs)
      })
      store.setValidationErrors(fieldErrors)
    } else {
      store.setValidationErrors({
        general: error?.data?.message || 'خطایی در ارتباط با سرور رخ داده است.',
      })
    }
    throw error
  } finally {
    store.setSubmitting(false)
  }
}
