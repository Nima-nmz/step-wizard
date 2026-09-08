import {
  REGEX as _REGEX,
  MESSAGES as _MESSAGES,
  PRODUCTS as _PRODUCTS,
  phoneSchema,
  persianNameSchema,
  nationalIdSchema,
  emailOptionalSchema,
  emailRequiredSchema,
  ibanSchema,
  otpCodeSchema,
  passwordSchema,
  requiredSchema,
  imageFileSchema,
  documentFileSchema,
  amountSchema,
  durationSchema,
  registerPayloadSchema,
  updateProfileSchema,
  updateBankSchema,
  loanApplySchema,
  loanCalculateSchema,
  guarantorSchema,
  rejectLoanSchema,
  firstIssue,
  parseObject,
} from './schemas'
import type { ValidationResult as _ValidationResult } from './schemas'

/* ─────────────────────────────────────────────────────────────
 * سازگاری با کدهای موجود: همین توابع/ثابت‌ها export می‌شوند،
 * ولی پیاده‌سازی داخلی روی zod schemas در lib/schemas.ts است.
 * برای کد جدید مستقیم از lib/schemas.ts + toTypedSchema استفاده کنید.
 * ───────────────────────────────────────────────────────────── */

export const REGEX = _REGEX
export const MESSAGES = _MESSAGES
export const PRODUCTS = _PRODUCTS
export type ValidationResult = _ValidationResult

export function validatePhone(value: string): string | true {
  return firstIssue(phoneSchema, value)
}

export function validatePersianName(value: string, fieldName: string): string | true {
  return firstIssue(persianNameSchema(fieldName), value)
}

export function validateNationalId(value: string): string | true {
  return firstIssue(nationalIdSchema, value)
}

export function validateEmail(value: string | null | undefined): string | true {
  return firstIssue(emailOptionalSchema, value)
}

export function validateEmailRequired(value: string): string | true {
  return firstIssue(emailRequiredSchema, value)
}

export function validateIban(value: string): string | true {
  return firstIssue(ibanSchema, value)
}

export function validateOtpCode(value: string): string | true {
  return firstIssue(otpCodeSchema, value)
}

export function validatePassword(value: string): string | true {
  return firstIssue(passwordSchema, value)
}

export function validateRequired(value: string, fieldName: string): string | true {
  return firstIssue(requiredSchema(fieldName), value)
}

export function validateImageFile(
  file: File | null,
  opts?: { maxSizeMB?: number; required?: boolean },
): string | true {
  return firstIssue(imageFileSchema(opts), file)
}

export function validateDocumentFile(file: File | null): string | true {
  return firstIssue(documentFileSchema, file)
}

export function validateAmount(value: number, min: number, max?: number): string | true {
  return firstIssue(amountSchema(min, max), value)
}

export function validateDuration(value: number, min: number, max: number): string | true {
  return firstIssue(durationSchema(min, max), value)
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
  return parseObject(registerPayloadSchema, data)
}

export function validateUpdateProfile(data: {
  first_name?: string
  last_name?: string
  email?: string | null
}): ValidationResult {
  return parseObject(updateProfileSchema, data)
}

export function validateUpdateBank(data: {
  iban: string
  bank_name?: string
  account_number?: string
}): ValidationResult {
  return parseObject(updateBankSchema, data)
}

export function validateLoanApply(data: {
  productId: number
  amount: number
  durationMonths: number
}): ValidationResult {
  return parseObject(loanApplySchema, data)
}

export function validateLoanCalculate(data: {
  productId: number
  amount: number
  durationMonths: number
}): ValidationResult {
  return parseObject(loanCalculateSchema, data)
}

export function validateGuarantor(data: {
  fullName: string
  nationalId: string
  phoneNumber: string
  relationship: string
}): ValidationResult {
  return parseObject(guarantorSchema, data)
}

export function validateRejectLoan(data: { rejectionReason?: string }): ValidationResult {
  return parseObject(rejectLoanSchema, data)
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
