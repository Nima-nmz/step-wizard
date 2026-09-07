export const REGEX = {
  phone: /^09\d{9}$/,
  nationalId: /^\d{10}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  iban: /^IR\d{24}$/,
  otpCode: /^\d{6}$/,
  password: /^.{6,}$/,
} as const

export const MESSAGES = {
  required: (field: string) => `${field} الزامی است`,
  phone: 'شماره موبایل معتبر نیست',
  nationalId: 'کد ملی باید ۱۰ رقم باشد',
  email: 'ایمیل معتبر نیست',
  iban: 'شماره شبا معتبر نیست (IR + 24 رقم)',
  ibanRequired: 'شماره شبا الزامی است',
  otpCode: 'کد تأیید صحیح نیست',
  passwordMin: 'رمز عبور باید حداقل ۶ کاراکتر باشد',
  imageRequired: 'تصویر الزامی است',
  imageSize: 'حجم تصویر نباید بیشتر از ۵ مگابایت باشد',
  imageType: 'فایل ارسالی باید تصویر باشد',
  fileRequired: 'فایل الزامی است',
  amountMin: (min: number) => `مبلغ باید حداقل ${min.toLocaleString('fa-IR')} تومان باشد`,
  amountRange: (min: number, max: number) =>
    `مبلغ باید بین ${min.toLocaleString('fa-IR')} تا ${max.toLocaleString('fa-IR')} تومان باشد`,
  durationRange: (min: number, max: number) =>
    `مدت باید بین ${min} تا ${max} ماه باشد`,
  draftOnly: 'فقط درخواست‌های پیش‌نویس قابل ویرایش هستند',
  authRequired: 'احراز هویت نامعتبر است',
  notFound: 'درخواست یافت نشد',
  sessionExpired: 'نشست شما منقضی شده است، لطفاً دوباره شماره موبایل را تأیید کنید.',
} as const

export function validatePhone(value: string): string | true {
  if (!value?.trim()) return MESSAGES.required('شماره موبایل')
  if (!REGEX.phone.test(value)) return MESSAGES.phone
  return true
}

export function validateNationalId(value: string): string | true {
  if (!value?.trim()) return MESSAGES.required('کد ملی')
  if (!REGEX.nationalId.test(value)) return MESSAGES.nationalId
  return true
}

export function validateEmail(value: string | null | undefined): string | true {
  if (!value || !value.trim()) return true // optional
  if (!REGEX.email.test(value)) return MESSAGES.email
  return true
}

export function validateEmailRequired(value: string): string | true {
  if (!value?.trim()) return MESSAGES.required('ایمیل')
  if (!REGEX.email.test(value)) return MESSAGES.email
  return true
}

export function validateIban(value: string): string | true {
  if (!value?.trim()) return MESSAGES.ibanRequired
  const cleaned = value.replace(/[\s\-]/g, '').toUpperCase()
  if (!REGEX.iban.test(cleaned)) return MESSAGES.iban
  return true
}

export function validateOtpCode(value: string): string | true {
  if (!value?.trim()) return MESSAGES.required('کد تأیید')
  if (!REGEX.otpCode.test(value)) return MESSAGES.otpCode
  return true
}

export function validatePassword(value: string): string | true {
  if (!value) return MESSAGES.required('رمز عبور')
  if (!REGEX.password.test(value)) return MESSAGES.passwordMin
  return true
}

export function validateRequired(value: string, fieldName: string): string | true {
  if (!value?.trim()) return MESSAGES.required(fieldName)
  return true
}

export function validateImageFile(
  file: File | null,
  opts?: { maxSizeMB?: number; required?: boolean }
): string | true {
  const { maxSizeMB = 5, required = true } = opts ?? {}

  if (!file) {
    if (required) return MESSAGES.imageRequired
    return true
  }

  if (!file.type.startsWith('image/')) return MESSAGES.imageType
  if (file.size > maxSizeMB * 1024 * 1024) return MESSAGES.imageSize
  return true
}

export function validateDocumentFile(file: File | null): string | true {
  if (!file) return MESSAGES.fileRequired
  return true
}

export function validateAmount(
  value: number,
  min: number,
  max?: number
): string | true {
  if (!value || value < min) {
    return max ? MESSAGES.amountRange(min, max) : MESSAGES.amountMin(min)
  }
  if (max && value > max) return MESSAGES.amountRange(min, max)
  return true
}

export function validateDuration(
  value: number,
  min: number,
  max: number
): string | true {
  if (!value || value < min || value > max) return MESSAGES.durationRange(min, max)
  return true
}

export interface ValidationResult {
  valid: boolean
  errors: Record<string, string>
}

export function validateRegisterPayload(data: {
  phone_number: string
  first_name: string
  last_name: string
  national_id: string
  birth_date: string
  email?: string
  national_id_image: File | null
}): ValidationResult {
  const errors: Record<string, string> = {}

  const phone = validatePhone(data.phone_number)
  if (phone !== true) errors.phone_number = phone

  const firstName = validateRequired(data.first_name, 'نام')
  if (firstName !== true) errors.first_name = firstName

  const lastName = validateRequired(data.last_name, 'نام خانوادگی')
  if (lastName !== true) errors.last_name = lastName

  const nationalId = validateNationalId(data.national_id)
  if (nationalId !== true) errors.national_id = nationalId

  const birthDate = validateRequired(data.birth_date, 'تاریخ تولد')
  if (birthDate !== true) errors.birth_date = birthDate

  const email = validateEmail(data.email)
  if (email !== true) errors.email = email

  const image = validateImageFile(data.national_id_image)
  if (image !== true) errors.national_id_image = image

  return { valid: Object.keys(errors).length === 0, errors }
}

export function validateUpdateProfile(data: {
  first_name?: string
  last_name?: string
  email?: string | null
}): ValidationResult {
  const errors: Record<string, string> = {}

  if (data.first_name !== undefined) {
    const v = validateRequired(data.first_name, 'نام')
    if (v !== true) errors.first_name = v
  }

  if (data.last_name !== undefined) {
    const v = validateRequired(data.last_name, 'نام خانوادگی')
    if (v !== true) errors.last_name = v
  }

  if (data.email !== undefined && data.email !== null) {
    const v = validateEmail(data.email)
    if (v !== true) errors.email = v
  }

  return { valid: Object.keys(errors).length === 0, errors }
}

export function validateUpdateBank(data: {
  iban: string
  bank_name?: string
  account_number?: string
}): ValidationResult {
  const errors: Record<string, string> = {}

  const iban = validateIban(data.iban)
  if (iban !== true) errors.iban = iban

  return { valid: Object.keys(errors).length === 0, errors }
}

export function validateLoanApply(data: {
  productId: number
  amount: number
  durationMonths: number
}): ValidationResult {
  const errors: Record<string, string> = {}

  if (!data.productId) errors.productId = MESSAGES.required('طرح وام')

  const amount = validateAmount(data.amount, 1_000_000)
  if (amount !== true) errors.amount = amount

  const duration = validateDuration(data.durationMonths, 1, 999)
  if (duration !== true) errors.durationMonths = duration

  return { valid: Object.keys(errors).length === 0, errors }
}

export function validateLoanCalculate(data: {
  productId: number
  amount: number
  durationMonths: number
}): ValidationResult {
  const errors: Record<string, string> = {}

  if (!data.productId || !PRODUCTS[data.productId]) {
    return { valid: false, errors: { productId: 'طرح وام معتبر نیست' } }
  }

  const product = PRODUCTS[data.productId]

  const amount = validateAmount(data.amount, product.minAmount, product.maxAmount)
  if (amount !== true) errors.amount = amount

  const duration = validateDuration(
    data.durationMonths,
    product.minDurationMonths,
    product.maxDurationMonths
  )
  if (duration !== true) errors.durationMonths = duration

  return { valid: Object.keys(errors).length === 0, errors }
}

export function validateGuarantor(data: {
  fullName: string
  nationalId: string
  phoneNumber: string
  relationship: string
}): ValidationResult {
  const errors: Record<string, string> = {}

  const fullName = validateRequired(data.fullName, 'نام ضامن')
  if (fullName !== true) errors.fullName = fullName

  const nationalId = validateNationalId(data.nationalId)
  if (nationalId !== true) errors.nationalId = nationalId

  const phone = validatePhone(data.phoneNumber)
  if (phone !== true) errors.phoneNumber = phone

  const relationship = validateRequired(data.relationship, 'نسبت ضامن')
  if (relationship !== true) errors.relationship = relationship

  return { valid: Object.keys(errors).length === 0, errors }
}

export function validateRejectLoan(data: {
  rejectionReason?: string
}): ValidationResult {
  const errors: Record<string, string> = {}

  const reason = validateRequired(data.rejectionReason ?? '', 'دلیل رد')
  if (reason !== true) errors.rejectionReason = reason

  return { valid: Object.keys(errors).length === 0, errors }
}

export const PRODUCTS: Record<
  number,
  {
    minAmount: number
    maxAmount: number
    minDurationMonths: number
    maxDurationMonths: number
    interestRate: number
  }
> = {
  1: {
    minAmount: 5_000_000,
    maxAmount: 50_000_000,
    minDurationMonths: 3,
    maxDurationMonths: 12,
    interestRate: 18,
  },
  2: {
    minAmount: 20_000_000,
    maxAmount: 150_000_000,
    minDurationMonths: 6,
    maxDurationMonths: 24,
    interestRate: 20,
  },
  3: {
    minAmount: 50_000_000,
    maxAmount: 300_000_000,
    minDurationMonths: 12,
    maxDurationMonths: 48,
    interestRate: 23,
  },
}

export function isStep1Valid(otpStatus: string): boolean {
  return otpStatus === 'verified'
}

export function isStep1PasswordValid(password: string, isAuthenticated: boolean): boolean {
  return password.length >= 6 && isAuthenticated
}

export function isStep2Valid(data: {
  firstName: string
  lastName: string
  nationalId: string
  birthDate: string
  idCardFile: File | null
}): boolean {
  return (
    !!data.firstName &&
    !!data.lastName &&
    !!data.nationalId &&
    !!data.birthDate &&
    data.idCardFile !== null
  )
}
