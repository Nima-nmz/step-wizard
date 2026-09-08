import { MESSAGES } from '~/lib/validations'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body?.number) {
    throw createError({
      statusCode: 422,
      data: { errors: { phone_number: [MESSAGES.required('شماره موبایل')] } },
    })
  }
  await new Promise((r) => setTimeout(r, 500))
  return { success: true, message: 'کد ارسال شد', remind_valid_time: 120 }
})
