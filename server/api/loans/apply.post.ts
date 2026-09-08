import { createApplication, toPublicApplication } from '~/server/utils/loanMockDb'
import { validateLoanApply } from '~/lib/validations'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ') || !authHeader.slice(7).trim()) {
    throw createError({ statusCode: 401, data: { message: 'احراز هویت نامعتبر است' } })
  }

  const ownerToken = authHeader.slice(7).trim()
  const body = await readBody<{ productId: number; amount: number; durationMonths: number }>(event)

  const { valid, errors: validationErrors } = validateLoanApply(body)

  if (!valid) {
    const errors: Record<string, string[]> = {}
    for (const [field, msg] of Object.entries(validationErrors)) {
      errors[field] = [msg]
    }
    throw createError({ statusCode: 422, data: { message: 'اطلاعات نامعتبر است', errors } })
  }

  const record = createApplication(body.productId, body.amount, body.durationMonths, ownerToken)
  return toPublicApplication(record)
})
