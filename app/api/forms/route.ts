import { db } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const forms = await db.form.findMany({ orderBy: { updatedAt: 'desc' }, include: { _count: { select: { submissions: true } } } })
    return NextResponse.json(forms)
  } catch (error) {
    console.error('[v0] forms could not be loaded', error)
    return NextResponse.json({ error: 'Forms unavailable' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name = String(body.name || '').trim()
    const slug = String(body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')).trim()
    const fields = Array.isArray(body.fields) ? body.fields : []
    if (!name || !slug || !fields.length) return NextResponse.json({ error: 'Name and at least one field are required' }, { status: 400 })
    const form = await db.form.upsert({ where: { slug }, update: { name, description: body.description || null, fields: JSON.stringify(fields), status: body.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT' }, create: { name, slug, description: body.description || null, fields: JSON.stringify(fields), status: body.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT' } })
    return NextResponse.json(form)
  } catch (error) {
    console.error('[v0] form could not be saved', error)
    return NextResponse.json({ error: 'Form could not be saved' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json()
    if (!id || !['DRAFT', 'PUBLISHED'].includes(status)) return NextResponse.json({ error: 'Invalid form update' }, { status: 400 })
    return NextResponse.json(await db.form.update({ where: { id }, data: { status } }))
  } catch (error) {
    console.error('[v0] form status could not be updated', error)
    return NextResponse.json({ error: 'Form status could not be updated' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await db.form.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[v0] form could not be deleted', error)
    return NextResponse.json({ error: 'Form could not be deleted' }, { status: 500 })
  }
}

export async function OPTIONS() { return NextResponse.json({ ok: true }) }
