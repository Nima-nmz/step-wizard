import { validateLoanCalculate, PRODUCTS } from '~/lib/validations'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ') || !authHeader.slice(7).trim()) {
    throw createError({ statusCode: 401, data: { message: 'احراز هویت نامعتبر است' } })
  }

  const body = await readBody<{ productId: number; amount: number; durationMonths: number }>(event)

  const { valid, errors: validationErrors } = validateLoanCalculate(body)

  if (!valid) {
    const errors: Record<string, string[]> = {}
    for (const [field, msg] of Object.entries(validationErrors)) {
      errors[field] = [msg]
    }
    throw createError({ statusCode: 422, data: { message: 'اطلاعات نامعتبر است', errors } })
  }

  const product = PRODUCTS[body.productId]
  const monthlyRate = product.interestRate / 100 / 12
  const n = body.durationMonths
  const monthlyInstallment = Math.round(
    (body.amount * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1),
  )
  const totalPayment = monthlyInstallment * n
  const totalInterest = totalPayment - body.amount

  await new Promise((resolve) => setTimeout(resolve, 300))

  return { monthlyInstallment, totalPayment, totalInterest }
})