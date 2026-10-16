import { db } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
const MAX_FILE_SIZE = 4 * 1024 * 1024
const ALLOWED_TYPES = new Set(['application/pdf', 'image/jpeg', 'image/png'])

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    if (!(file instanceof File)) return NextResponse.json({ error: 'Choose a file to upload' }, { status: 400 })
    if (!ALLOWED_TYPES.has(file.type)) return NextResponse.json({ error: 'Only PDF, JPG and PNG files are allowed' }, { status: 400 })
    if (file.size <= 0 || file.size > MAX_FILE_SIZE) return NextResponse.json({ error: 'File must be 4 MB or smaller' }, { status: 400 })

    const bytes = Buffer.from(await file.arrayBuffer())
    const signatureOk = file.type === 'application/pdf'
      ? bytes.subarray(0, 5).toString('ascii') === '%PDF-'
      : file.type === 'image/jpeg'
        ? bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
        : bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    if (!signatureOk) return NextResponse.json({ error: 'The file content does not match its file type' }, { status: 400 })

    const safeName = file.name.replace(/[\\/\\\\\u0000-\u001f]/g, '_').slice(0, 180) || 'customer-document'
    const document = await db.uploadedDocument.create({
      data: { fileName: safeName, mimeType: file.type, size: file.size, content: bytes },
      select: { id: true },
    })
    return NextResponse.json({ path: document.id })
  } catch (error) {
    console.error('[forms/upload] Neon document upload failed', error)
    return NextResponse.json({ error: 'Document upload failed. Please try again.' }, { status: 500 })
  }
}
