import { db } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const submissions = await db.formSubmission.findMany({ orderBy: { createdAt: 'desc' }, include: { form: { select: { name: true } } }, take: 100 })
    return NextResponse.json(submissions)
  } catch (error) {
    console.error('[v0] submissions could not be loaded', error)
    return NextResponse.json({ error: 'Submissions unavailable' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const form = await db.form.findUnique({ where: { slug: String(body.slug || '') } })
    if (!form || form.status !== 'PUBLISHED') return NextResponse.json({ error: 'This form is not available' }, { status: 404 })
    const fields = JSON.parse(form.fields) as Array<{ id: string; required?: boolean; type?: string }>
    const data = body.data && typeof body.data === 'object' ? body.data : {}
    if (fields.some((field) => field.required && !String(data[field.id] || '').trim())) return NextResponse.json({ error: 'Please complete all required fields and upload required documents' }, { status: 400 })
    for (const field of fields.filter((item) => item.type === 'file')) {
      const documentId = String(data[field.id] || '')
      if (documentId) {
        const document = await db.uploadedDocument.findUnique({ where: { id: documentId }, select: { id: true } })
        if (!document) return NextResponse.json({ error: 'An uploaded document could not be found. Please upload it again.' }, { status: 400 })
      }
    }
    const submission = await db.formSubmission.create({ data: { formId: form.id, data: JSON.stringify(data) } })
    return NextResponse.json({ id: submission.id })
  } catch (error) {
    console.error('[v0] submission could not be saved', error)
    return NextResponse.json({ error: 'Submission could not be saved' }, { status: 500 })
  }
}
