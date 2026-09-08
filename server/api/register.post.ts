import { getOrCreateUser } from '~/server/utils/userMockDb'
import { REGEX, MESSAGES } from '~/lib/validations'

export default defineEventHandler(async (event) => {
const authHeader = getHeader(event, 'authorization')
if (!authHeader?.startsWith('Bearer ') || !authHeader.slice(7).trim()) {
  throw createError({
    statusCode: 401,
    data: { message: MESSAGES.authRequired },
  })
}
const token = authHeader.slice(7).trim()
  const parts = await readMultipartFormData(event)

  if (!parts?.length) {
    throw createError({
      statusCode: 422,
      data: {
        message: 'اطلاعات ارسالی نامعتبر است',
        errors: { general: ['بدنه درخواست خالی است'] },
      },
    })
  }

  const fields: Record<string, string> = {}
  let idCardImage: (typeof parts)[number] | null = null

  for (const part of parts) {
    if (!part.name) continue

    if (part.name === 'national_id_image') {
      idCardImage = part
      continue
    }

    fields[part.name] = part.data.toString('utf-8')
  }

  const errors: Record<string, string[]> = {}

  if (!REGEX.phone.test(fields.phone_number || '')) {
    errors.phone_number = [MESSAGES.phone]
  }

  if (!fields.first_name?.trim()) {
    errors.first_name = [MESSAGES.required('نام')]
  } else if (!REGEX.persianName.test(fields.first_name)) {
    errors.first_name = [MESSAGES.persianName('نام')]
  }

  if (!fields.last_name?.trim()) {
    errors.last_name = [MESSAGES.required('نام خانوادگی')]
  } else if (!REGEX.persianName.test(fields.last_name)) {
    errors.last_name = [MESSAGES.persianName('نام خانوادگی')]
  }

  if (!REGEX.nationalId.test(fields.national_id || '')) {
    errors.national_id = [MESSAGES.nationalId]
  } else {
    const digits = fields.national_id.split('').map(Number)
    const checkDigit = digits[9]
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += digits[i] * (10 - i)
    }
    const remainder = sum % 11
    const expected = remainder < 2 ? remainder : 11 - remainder
    if (expected !== checkDigit) {
      errors.national_id = [MESSAGES.nationalIdInvalid]
    }
  }

  if (!fields.birth_date?.trim()) {
    errors.birth_date = [MESSAGES.required('تاریخ تولد')]
  }

  if (fields.email && !REGEX.email.test(fields.email)) {
    errors.email = [MESSAGES.email]
  }

  if (!idCardImage) {
    errors.national_id_image = [MESSAGES.imageRequired]
  } else {
    const maxSizeBytes = 5 * 1024 * 1024
    if (idCardImage.data.length > maxSizeBytes) {
      errors.national_id_image = [MESSAGES.imageSize]
    } else if (idCardImage.type && !idCardImage.type.startsWith('image/')) {
      errors.national_id_image = [MESSAGES.imageType]
    }
  }

  if (Object.keys(errors).length > 0) {
    throw createError({
      statusCode: 422,
      data: {
        message: 'اطلاعات وارد شده معتبر نیست',
        errors,
      },
    })
  }

  // شبیه‌سازی تأخیر شبکه/پردازش سرور
  await new Promise((resolve) => setTimeout(resolve, 800))

  const userData: Record<string, any> = {
    phoneNumber: fields.phone_number,
    firstName: fields.first_name,
    lastName: fields.last_name,
    nationalId: fields.national_id,
    birthDate: fields.birth_date,
    email: fields.email || null,
  }

  if (idCardImage) {
    userData.idCardUrl = `data:${idCardImage.type || 'image/png'};base64,${idCardImage.data.toString('base64')}`
  }

  getOrCreateUser(token, userData)

  return {
    success: true,
    message: 'ثبت‌نام با موفقیت انجام شد',
    user: {
      id: Math.floor(Math.random() * 100000),
      number: fields.phone_number,
      first_name: fields.first_name,
      last_name: fields.last_name,
      national_id:fields.national_id,
      email:fields.email,
      created_at: new Date().toISOString(),
    },
  }
})