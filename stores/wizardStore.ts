import { defineStore } from 'pinia'
import type { WizardState, PersonalInfo } from '~/types/wizard'

const defaultState = (): WizardState => ({
  phoneNumber: '',
  password: '',
  otpCode: '',
  otpTimer: 120,
  otpStatus: 'idle',
  authToken: null,
  isAuthenticated: false,

  personalInfo: {
    firstName: '',
    lastName: '',
    birthDate: '',
    nationalId: '',
    email: '',
  },
  idCardFile: null,
  idCardPreview: null,
  isCompressing: false,

  currentStep: 1,
  validationErrors: {},
  isSubmitting: false,
  submitSuccess: false,
})

export const useWizardStore = defineStore('wizard', {
  state: defaultState,

  getters: {
    isStep1Valid: (s) => s.otpStatus === 'verified',

    isStep1PasswordValid: (s) =>
      s.password.length >= 6 && s.isAuthenticated,

    isStep2Valid: (s) =>
      !!s.personalInfo.firstName &&
      !!s.personalInfo.lastName &&
      !!s.personalInfo.nationalId &&
      !!s.personalInfo.birthDate &&
      s.idCardFile !== null,

    getFieldError: (s) => {
      return (field: string) => s.validationErrors[field] || ''
    },
  },

  actions: {
    setPhoneNumber(value: string) {
      this.phoneNumber = value
      this.clearFieldError('phone_number')
    },
    setOtpCode(value: string) {
      this.otpCode = value
      this.clearFieldError('code')
    },
    setOtpStatus(status: WizardState['otpStatus']) {
      this.otpStatus = status
    },
    setOtpTimer(value: number) {
      this.otpTimer = value
    },

    setPassword(value: string) {
      this.password = value
      this.clearFieldError('password')
    },
    setAuthenticated(value: boolean) {
      this.isAuthenticated = value
    },
    setAuthToken(token: string | null) {
  this.authToken = token
  this.isAuthenticated = token !== null
    },

    updatePersonalInfo(field: keyof PersonalInfo, value: string) {
      this.personalInfo[field] = value
      this.clearFieldError(field)
    },
    setIdCardFile(file: File | null) {
      this.idCardFile = file
      if (file) {
        this.idCardPreview = URL.createObjectURL(file)
      } else {
        this.idCardPreview = null
      }
      this.clearFieldError('national_id_image')
    },
    setCompressing(value: boolean) {
      this.isCompressing = value
    },

    setStep(step: 1 | 2 | 3) {
      this.currentStep = step
    },

    setValidationErrors(errors: Record<string, string>) {
      this.validationErrors = errors
    },
    clearFieldError(field: string) {
      if (this.validationErrors[field]) {
        const newErrors = { ...this.validationErrors }
        delete newErrors[field]
        this.validationErrors = newErrors
      }
    },

    setSubmitting(value: boolean) {
      this.isSubmitting = value
    },
    setSubmitSuccess(value: boolean) {
      this.submitSuccess = value
    },

    clearStore() {
      Object.assign(this, defaultState())
    },
  },
})
