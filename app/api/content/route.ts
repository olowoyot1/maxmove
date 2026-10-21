import { db } from '@/lib/prisma'
import { NextResponse } from 'next/server'

const defaults = {
  heroTitle: 'International shipping. Interstate logistics. One MaxMove.',
  heroDescription: 'Reliable movement from Lagos to destinations across Nigeria and around the world, with shipment updates managed by our operations team.',
  primaryCta: 'Track a shipment',
  secondaryCta: 'Start a shipment request',
}

export async function GET() {
  try {
    const rows = await db.siteContent.findMany()
    return NextResponse.json({ ...defaults, ...Object.fromEntries(rows.map((row) => [row.key, row.value])) })
  } catch (error) {
    console.error('[v0] site content could not be loaded', error)
    return NextResponse.json(defaults)
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const entries = Object.entries(body).filter((entry): entry is [string, string] => typeof entry[0] === 'string' && typeof entry[1] === 'string')
    await db.$transaction(entries.map(([key, value]) => db.siteContent.upsert({ where: { key }, update: { value }, create: { key, value } })))
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[v0] site content could not be saved', error)
    return NextResponse.json({ error: 'Content could not be saved' }, { status: 500 })
  }
}
