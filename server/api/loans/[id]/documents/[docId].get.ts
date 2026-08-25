import { promises as fs } from 'node:fs'
import path from 'node:path'
import { findApplication } from '~/server/utils/loanMockDb'

const UPLOAD_ROOT = path.join(process.cwd(), '.data', 'uploads')

const MIME_MAP: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  bmp: 'image/bmp',
  pdf: 'application/pdf',
  txt: 'text/plain',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

function getMime(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  return MIME_MAP[ext] || 'application/octet-stream'
}

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const docId = Number(getRouterParam(event, 'docId'))

  const application = findApplication(id)
  if (!application) {
    throw createError({ statusCode: 404, data: { message: 'درخواست وام یافت نشد' } })
  }

  const doc = application.documents.find((d) => d.id === docId)
  if (!doc) {
    throw createError({ statusCode: 404, data: { message: 'مدرک یافت نشد' } })
  }

  const filePath = path.join(UPLOAD_ROOT, String(id), String(docId))

  try {
    const data = await fs.readFile(filePath)
    setResponseHeader(event, 'Content-Type', getMime(doc.name))
    setResponseHeader(event, 'Cache-Control', 'public, max-age=86400')
    return data
  } catch {
    throw createError({ statusCode: 404, data: { message: 'فایل یافت نشد' } })
  }
})
