const PRODUCTS: Record<number, { minAmount: number; maxAmount: number; minDurationMonths: number; maxDurationMonths: number; interestRate: number }> = {
  1: { minAmount: 5_000_000, maxAmount: 50_000_000, minDurationMonths: 3, maxDurationMonths: 12, interestRate: 18 },
  2: { minAmount: 20_000_000, maxAmount: 150_000_000, minDurationMonths: 6, maxDurationMonths: 24, interestRate: 20 },
  3: { minAmount: 50_000_000, maxAmount: 300_000_000, minDurationMonths: 12, maxDurationMonths: 48, interestRate: 23 },
}

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ') || !authHeader.slice(7).trim()) {
    throw createError({ statusCode: 401, data: { message: 'احراز هویت نامعتبر است' } })
  }

  const body = await readBody<{ productId: number; amount: number; durationMonths: number }>(event)
  const product = PRODUCTS[body?.productId]
  const errors: Record<string, string[]> = {}

if (!product) {
  throw createError({ statusCode: 422, data: { message: 'طرح وام معتبر نیست' } })
}


if (!body.amount || body.amount < product.minAmount || body.amount > product.maxAmount) {
  errors.amount = [`مبلغ باید بین ${product.minAmount.toLocaleString('fa-IR')} تا ${product.maxAmount.toLocaleString('fa-IR')} تومان باشد`]
}

if (!body.durationMonths || body.durationMonths < product.minDurationMonths || body.durationMonths > product.maxDurationMonths) {
  errors.durationMonths = [`مدت باید بین ${product.minDurationMonths} تا ${product.maxDurationMonths} ماه باشد`]
}

if (Object.keys(errors).length > 0) {
  throw createError({ statusCode: 422, data: { message: 'اطلاعات نامعتبر است', errors } })
}

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