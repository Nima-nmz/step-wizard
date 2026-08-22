export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ') || !authHeader.slice(7).trim()) {
    throw createError({ statusCode: 401, data: { message: 'احراز هویت نامعتبر است' } })
  }

  await new Promise((resolve) => setTimeout(resolve, 300))

  return [
    {
      id: 1,
      title: 'وام کوتاه‌مدت',
      description: 'مناسب برای نیازهای فوری با بازپرداخت سریع',
      interestRate: 18,
      minAmount: 5_000_000,
      maxAmount: 50_000_000,
      minDurationMonths: 3,
      maxDurationMonths: 12,
    },
    {
      id: 2,
      title: 'وام میان‌مدت',
      description: 'تعادل بین مبلغ وام و مدت بازپرداخت',
      interestRate: 20,
      minAmount: 20_000_000,
      maxAmount: 150_000_000,
      minDurationMonths: 6,
      maxDurationMonths: 24,
    },
    {
      id: 3,
      title: 'وام بلندمدت',
      description: 'برای مبالغ بالاتر با اقساط سبک‌تر',
      interestRate: 23,
      minAmount: 50_000_000,
      maxAmount: 300_000_000,
      minDurationMonths: 12,
      maxDurationMonths: 48,
    },
  ]
})