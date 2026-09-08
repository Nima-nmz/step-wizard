import { promises as fs } from 'node:fs'
import path from 'node:path'
import { findApplication, addDocument } from '~/server/utils/loanMockDb'
import { MESSAGES } from '~/lib/validations'

const UPLOAD_ROOT = path.join(process.cwd(), '.data', 'uploads')

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

  const parts = await readMultipartFormData(event)
  const file = parts?.find((p) => p.name === 'document')

  if (!file || !file.data) {
    throw createError({ statusCode: 422, data: { message: 'اطلاعات نامعتبر است', errors: { document: [MESSAGES.fileRequired] } } })
  }

  const doc = addDocument(application, file.filename || 'مدرک.jpg')
  const docUrl = `/api/loans/${id}/documents/${doc.id}`

  try {
    const dir = path.join(UPLOAD_ROOT, String(id))
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(path.join(dir, String(doc.id)), file.data)
    doc.url = docUrl
  } catch {
  }

  return doc
})
