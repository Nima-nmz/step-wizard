export default defineEventHandler(async (event) => {
const authHeader = getHeader(event, 'authorization')
if (!authHeader?.startsWith('Bearer ') || !authHeader.slice(7).trim()) {
  throw createError({
    statusCode: 401,
    data: { message: 'احراز هویت نامعتبر است' },
  })
}
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

  if (!/^09\d{9}$/.test(fields.phone_number || '')) {
    errors.phone_number = ['شماره موبایل معتبر نیست']
  }

  if (!fields.first_name?.trim()) {
    errors.first_name = ['نام الزامی است']
  }

  if (!fields.last_name?.trim()) {
    errors.last_name = ['نام خانوادگی الزامی است']
  }

  if (!/^\d{10}$/.test(fields.national_id || '')) {
    errors.national_id = ['کد ملی باید ۱۰ رقم باشد']
  }

  if (!fields.birth_date?.trim()) {
    errors.birth_date = ['تاریخ تولد الزامی است']
  }

  if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = ['ایمیل معتبر نیست']
  }

  if (!idCardImage) {
    errors.national_id_image = ['تصویر کارت ملی الزامی است']
  } else {
    const maxSizeBytes = 5 * 1024 * 1024
    if (idCardImage.data.length > maxSizeBytes) {
      errors.national_id_image = ['حجم تصویر نباید بیشتر از ۵ مگابایت باشد']
    } else if (idCardImage.type && !idCardImage.type.startsWith('image/')) {
      errors.national_id_image = ['فایل ارسالی باید تصویر باشد']
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