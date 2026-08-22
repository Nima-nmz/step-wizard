export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ') || !authHeader.slice(7).trim()) {
    throw createError({
      statusCode: 401,
      data: { message: 'احراز هویت نامعتبر است' },
    })
  }

  const query = getQuery(event)
  const page = Number(query.page) || 1
  const perPage = Number(query.perPage) || 10

  const allItems = [
    {
      id: 1,
      productId: 1,
      amount: 50_000_000,
      durationMonths: 12,
      status: 'under_review',
      documents: [{ id: 1, name: 'فیش حقوقی.jpg', url: '#', uploadedAt: '2026-08-10T09:00:00.000Z' }],
      guarantor: { fullName: 'علی محمدی', nationalId: '1234567890', phoneNumber: '09121234567', relationship: 'همکار' },
      createdAt: '2026-08-10T09:00:00.000Z',
      updatedAt: '2026-08-12T10:00:00.000Z',
    },
    {
      id: 2,
      productId: 2,
      amount: 20_000_000,
      durationMonths: 6,
      status: 'approved',
      documents: [],
      guarantor: null,
      createdAt: '2026-07-01T09:00:00.000Z',
      updatedAt: '2026-07-05T09:00:00.000Z',
    },
    {
      id: 3,
      productId: 1,
      amount: 80_000_000,
      durationMonths: 24,
      status: 'rejected',
      documents: [],
      guarantor: null,
      createdAt: '2026-06-15T09:00:00.000Z',
      updatedAt: '2026-06-18T09:00:00.000Z',
    },
  ]

  await new Promise((resolve) => setTimeout(resolve, 400))

  return {
    items: allItems.slice((page - 1) * perPage, page * perPage),
    meta: { page, perPage, total: allItems.length },
  }
})