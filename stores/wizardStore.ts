import { defineStore } from 'pinia'
import type { WizardState, PersonalInfo } from '~/types/wizard'
import { isStep1Valid as checkStep1, isStep1PasswordValid as checkPassword, isStep2Valid as checkStep2 } from '~/lib/validations'

export const AUTH_TOKEN_STORAGE_KEY = 'wizard_auth_token'
export const AUTH_ROLE_STORAGE_KEY = 'wizard_auth_role'

const defaultState = (): WizardState => ({
  phoneNumber: '',
  password: '',
  otpCode: '',
  otpTimer: 120,
  otpStatus: 'idle',
  authToken: null,
  isAuthenticated: false,
  role: null,

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
    isStep1Valid: (s) => checkStep1(s.otpStatus),

    isStep1PasswordValid: (s) => checkPassword(s.password, s.isAuthenticated),

    isAdmin: (s) => s.role === 'admin',

    isStep2Valid: (s) => checkStep2({
      firstName: s.personalInfo.firstName,
      lastName: s.personalInfo.lastName,
      nationalId: s.personalInfo.nationalId,
      birthDate: s.personalInfo.birthDate,
      idCardFile: s.idCardFile,
    }),

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
  if (import.meta.client) {
        if (token) {
          sessionStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token)
        } else {
          sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
        }
    }
  },

  setRole(role: WizardState['role']) {
      this.role = role
      if (import.meta.client) {
        if (role) {
          sessionStorage.setItem(AUTH_ROLE_STORAGE_KEY, role)
        } else {
          sessionStorage.removeItem(AUTH_ROLE_STORAGE_KEY)
        }
      }
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
      if (import.meta.client) {
        sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
        sessionStorage.removeItem(AUTH_ROLE_STORAGE_KEY)
      }
      Object.assign(this, defaultState())
    },
  },
})
