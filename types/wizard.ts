export interface PersonalInfo {
  firstName: string
  lastName: string
  birthDate: string
  nationalId: string
  email?: string
}

export interface WizardState {
  phoneNumber: string
  password: string
  otpCode: string
  otpTimer: number
  otpStatus: 'idle' | 'sending' | 'sent' | 'verifying' | 'verified' | 'failed'
  authToken: string | null
  isAuthenticated: boolean

  personalInfo: PersonalInfo
  idCardFile: File | null
  idCardPreview: string | null
  isCompressing: boolean

  currentStep: 1 | 2 | 3
  validationErrors: Record<string, string>
  isSubmitting: boolean
  submitSuccess: boolean
}

export interface ValidationCode {
  token: string
  refresh_token: string
}

export interface ApiErrorResponse {
  message: string
  errors: Record<string, string[]>
}

export interface RegisterSuccessResponse {
  success: boolean
  message: string
  user?: {
    id: number
    number: string
    first_name: string
    last_name: string
    created_at: string
  }
}

export interface RegisterPayload {
  phone_number: string
  first_name: string
  last_name: string
  national_id: string
  birth_date: string
  email?: string
  national_id_image: Blob | File
}
