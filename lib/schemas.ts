import { z } from 'zod'

/* ─────────────────────────────────────────────────────────────
 * Single source of truth برای اعتبارسنجی‌ها (zod + vee-validate)
 *
 * این فایل regexها، پیام‌ها و همه اسکیماها را نگه می‌دارد.
 * lib/validations.ts فقط همین‌ها را re-export و wrap می‌کند تا
 * کدهای موجود نشکنند.
 *
 * اتصال به vee-validate (در کامپوننت‌ها):
 *   import { toTypedSchema } from '@vee-validate/zod'
 *   const schema = toTypedSchema(registerPayloadSchema)
 * ───────────────────────────────────────────────────────────── */

export const REGEX = {
  phone: /^09\d{9}$/,
  nationalId: /^\d{10}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  iban: /^IR\d{24}$/,
  otpCode: /^\d{6}$/,
  password: /^.{6,}$/,
  persianName: /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s]+$/,
} as const

export const MESSAGES = {
  required: (field: string) => `${field} الزامی است`,
  phone: 'شماره موبایل معتبر نیست',
  nationalId: 'کد ملی باید ۱۰ رقم باشد',
  nationalIdInvalid: 'کد ملی وارد شده معتبر نیست',
  persianName: (field: string) => `${field} باید فقط شامل حروف فارسی باشد`,
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

export interface ValidationResult {
  valid: boolean
  errors: Record<string, string>
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

/* ── helpers ────────────────────────────────────────────────── */

/** رشته با پیام required فارسی برای undefined/null/نوع اشتباه */
const str = (requiredMsg: string) =>
  z.string({ required_error: requiredMsg, invalid_type_error: requiredMsg })

/** الگوریتم رقم کنترل کد ملی ایران */
export function isNationalIdChecksumValid(value: string): boolean {
  const digits = value.split('').map(Number)
  if (digits.length !== 10 || digits.some(Number.isNaN)) return false
  const checkDigit = digits[9]
  let sum = 0
  for (let i = 0; i < 9; i++) sum += digits[i] * (10 - i)
  const remainder = sum % 11
  return (remainder < 2 ? remainder : 11 - remainder) === checkDigit
}

/** اعتبارسنجی تک‌فیلد → پیام خطا یا true (اولین issue) */
export function firstIssue(schema: z.ZodTypeAny, value: unknown): string | true {
  const result = schema.safeParse(value)
  if (result.success) return true
  return result.error.issues[0]?.message || 'مقدار نامعتبر است'
}

/** اعتبارسنجی آبجکت → { valid, errors } با شکل قبلی پروژه */
export function parseObject(schema: z.ZodTypeAny, data: unknown): ValidationResult {
  const result = schema.safeParse(data)
  if (result.success) return { valid: true, errors: {} }
  const errors: Record<string, string> = {}
  for (const [field, messages] of Object.entries(result.error.flatten().fieldErrors)) {
    if (messages?.[0]) errors[field] = messages[0]
  }
  return { valid: false, errors }
}

/* ── field schemas ──────────────────────────────────────────── */

export const phoneSchema = str(MESSAGES.required('شماره موبایل'))
  .trim()
  .min(1, MESSAGES.required('شماره موبایل'))
  .regex(REGEX.phone, MESSAGES.phone)
  .superRefine((value, ctx) => {
    // رد شماره‌های تکراری مثل 09000000000 یا 09999999999
    const digitsOnly = value.replace(/^09/, '')
    if (/^(\d)\1+$/.test(digitsOnly)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: MESSAGES.phone })
    }
  })

export const persianNameSchema = (fieldName: string) =>
  str(MESSAGES.required(fieldName))
    .trim()
    .min(1, MESSAGES.required(fieldName))
    .regex(REGEX.persianName, MESSAGES.persianName(fieldName))

export const nationalIdSchema = str(MESSAGES.required('کد ملی'))
  .trim()
  .min(1, MESSAGES.required('کد ملی'))
  .regex(REGEX.nationalId, MESSAGES.nationalId)
  .superRefine((value, ctx) => {
    if (!isNationalIdChecksumValid(value)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: MESSAGES.nationalIdInvalid })
    }
  })

export const requiredSchema = (fieldName: string) =>
  str(MESSAGES.required(fieldName)).trim().min(1, MESSAGES.required(fieldName))

export const emailOptionalSchema = z
  .string({ invalid_type_error: MESSAGES.email })
  .optional()
  .nullable()
  .superRefine((value, ctx) => {
    if (value == null || !value.trim()) return
    if (!REGEX.email.test(value)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: MESSAGES.email })
    }
  })

export const emailRequiredSchema = str(MESSAGES.required('ایمیل'))
  .trim()
  .min(1, MESSAGES.required('ایمیل'))
  .regex(REGEX.email, MESSAGES.email)

export const ibanSchema = str(MESSAGES.ibanRequired)
  .trim()
  .min(1, MESSAGES.ibanRequired)
  .superRefine((value, ctx) => {
    const cleaned = value.replace(/[\s\-]/g, '').toUpperCase()
    if (!/^IR\d{24}$/.test(cleaned)) {
      if (/^\d+$/.test(cleaned.replace(/^IR/, ''))) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'شماره شبا باید تشکیل شده از IR + 24 رقم عددی باشد' })
      } else {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: MESSAGES.iban })
      }
    }
  })

export const otpCodeSchema = str(MESSAGES.required('کد تأیید'))
  .trim()
  .min(1, MESSAGES.required('کد تأیید'))
  .regex(REGEX.otpCode, MESSAGES.otpCode)

export const passwordSchema = z
  .string({
    required_error: MESSAGES.required('رمز عبور'),
    invalid_type_error: MESSAGES.required('رمز عبور'),
  })
  .min(1, MESSAGES.required('رمز عبور'))
  .regex(REGEX.password, MESSAGES.passwordMin)

export const imageFileSchema = (opts?: { maxSizeMB?: number; required?: boolean }) => {
  const { maxSizeMB = 5, required = true } = opts ?? {}
  return z.unknown().superRefine((value, ctx) => {
    if (!value) {
      if (required) ctx.addIssue({ code: z.ZodIssueCode.custom, message: MESSAGES.imageRequired })
      return
    }
    const file = value as File
    if (typeof file.type === 'string' && !file.type.startsWith('image/')) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: MESSAGES.imageType })
      return
    }
    if (typeof file.size === 'number' && file.size > maxSizeMB * 1024 * 1024) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: MESSAGES.imageSize })
    }
  })
}

export const documentFileSchema = z.unknown().superRefine((value, ctx) => {
  if (!value) ctx.addIssue({ code: z.ZodIssueCode.custom, message: MESSAGES.fileRequired })
})

export const amountSchema = (min: number, max?: number) => {
  const msg = max ? MESSAGES.amountRange(min, max) : MESSAGES.amountMin(min)
  return z
    .number({ required_error: msg, invalid_type_error: msg })
    .superRefine((value, ctx) => {
      if (!value || value < min || (max !== undefined && value > max)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: msg })
      }
    })
}

export const durationSchema = (min: number, max: number) => {
  const msg = MESSAGES.durationRange(min, max)
  return z
    .number({ required_error: msg, invalid_type_error: msg })
    .superRefine((value, ctx) => {
      if (!value || value < min || value > max) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: msg })
      }
    })
}

/* ── object schemas ─────────────────────────────────────────── */

export const registerPayloadSchema = z.object({
  phone_number: phoneSchema,
  first_name: persianNameSchema('نام'),
  last_name: persianNameSchema('نام خانوادگی'),
  national_id: nationalIdSchema,
  birth_date: requiredSchema('تاریخ تولد'),
  email: emailOptionalSchema.optional(),
  national_id_image: imageFileSchema(),
})

export const updateProfileSchema = z.object({
  first_name: persianNameSchema('نام').optional(),
  last_name: persianNameSchema('نام خانوادگی').optional(),
  email: emailOptionalSchema.optional(),
})

export const updateBankSchema = z.object({
  iban: ibanSchema,
  bank_name: z.string().optional(),
  account_number: z.string().optional(),
})

export const loanApplySchema = z.object({
  productId: z
    .number({
      required_error: MESSAGES.required('طرح وام'),
      invalid_type_error: MESSAGES.required('طرح وام'),
    })
    .refine((v) => !!v, MESSAGES.required('طرح وام')),
  amount: amountSchema(1_000_000),
  durationMonths: durationSchema(1, 999),
})

export const loanCalculateSchema = z
  .object({
    productId: z.number({
      required_error: 'طرح وام معتبر نیست',
      invalid_type_error: 'طرح وام معتبر نیست',
    }),
    amount: z.number({
      required_error: 'طرح وام معتبر نیست',
      invalid_type_error: 'طرح وام معتبر نیست',
    }),
    durationMonths: z.number({
      required_error: 'طرح وام معتبر نیست',
      invalid_type_error: 'طرح وام معتبر نیست',
    }),
  })
  .superRefine((data, ctx) => {
    const product = PRODUCTS[data.productId]
    if (!product) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'طرح وام معتبر نیست',
        path: ['productId'],
      })
      return
    }
    if (!data.amount || data.amount < product.minAmount || data.amount > product.maxAmount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: MESSAGES.amountRange(product.minAmount, product.maxAmount),
        path: ['amount'],
      })
    }
    if (
      !data.durationMonths ||
      data.durationMonths < product.minDurationMonths ||
      data.durationMonths > product.maxDurationMonths
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: MESSAGES.durationRange(product.minDurationMonths, product.maxDurationMonths),
        path: ['durationMonths'],
      })
    }
  })

export const guarantorSchema = z.object({
  fullName: persianNameSchema('نام ضامن'),
  nationalId: nationalIdSchema,
  phoneNumber: phoneSchema,
  relationship: requiredSchema('نسبت ضامن'),
})

export const rejectLoanSchema = z.object({
  rejectionReason: requiredSchema('دلیل رد'),
})

/* ── inferred types (type-safe payloads) ────────────────────── */

export type RegisterPayloadInput = z.input<typeof registerPayloadSchema>
export type UpdateProfileInput = z.input<typeof updateProfileSchema>
export type UpdateBankInput = z.input<typeof updateBankSchema>
export type LoanApplyInput = z.input<typeof loanApplySchema>
export type LoanCalculateInput = z.input<typeof loanCalculateSchema>
export type GuarantorInput = z.input<typeof guarantorSchema>
