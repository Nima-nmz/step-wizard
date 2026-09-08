import { findApplication, setGuarantor, toPublicApplication } from '~/server/utils/loanMockDb'
import { validateGuarantor, MESSAGES } from '~/lib/validations'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ') || !authHeader.slice(7).trim()) {
    throw createError({ statusCode: 401, data: { message: MESSAGES.authRequired } })
  }

  const id = Number(getRouterParam(event, 'id'))
  const application = findApplication(id)

  if (!application) {
    throw createError({ statusCode: 404, data: { message: MESSAGES.notFound } })
  }

  if (application.status !== 'draft') {
    throw createError({ statusCode: 422, data: { message: MESSAGES.draftOnly } })
  }

  const body = await readBody<{ fullName: string; nationalId: string; phoneNumber: string; relationship: string }>(event)

  const { valid, errors: validationErrors } = validateGuarantor(body)

  if (!valid) {
    const errors: Record<string, string[]> = {}
    for (const [field, msg] of Object.entries(validationErrors)) {
      errors[field] = [msg]
    }
    throw createError({ statusCode: 422, data: { message: 'اطلاعات نامعتبر است', errors } })
  }

  setGuarantor(application, body)
  return toPublicApplication(application)
})
