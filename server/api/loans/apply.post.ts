import { createApplication, toPublicApplication } from '~/server/utils/loanMockDb'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ') || !authHeader.slice(7).trim()) {
    throw createError({ statusCode: 401, data: { message: 'احراز هویت نامعتبر است' } })
  }

  const ownerToken = authHeader.slice(7).trim()
  const body = await readBody<{ productId: number; amount: number; durationMonths: number }>(event)
  const errors: Record<string, string[]> = {}

  if (!body?.productId) errors.productId = ['طرح وام الزامی است']
  if (!body?.amount || body.amount < 1_000_000) errors.amount = ['مبلغ نامعتبر است']
  if (!body?.durationMonths || body.durationMonths < 1) errors.durationMonths = ['مدت نامعتبر است']

  if (Object.keys(errors).length > 0) {
    throw createError({ statusCode: 422, data: { message: 'اطلاعات نامعتبر است', errors } })
  }

  const record = createApplication(body.productId, body.amount, body.durationMonths, ownerToken)
  return toPublicApplication(record)
})
