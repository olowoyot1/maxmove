import { NextResponse } from 'next/server'
import { db } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const required = ['fullName', 'phone', 'email', 'serviceType', 'pickupLocation', 'deliveryLocation', 'movement', 'readyDate', 'cargoDescription']
    if (required.some((key) => typeof body[key] !== 'string' || !body[key].trim())) {
      return NextResponse.json({ error: 'Please complete all required fields.' }, { status: 400 })
    }

    const quoteRequest = await db.quoteRequest.create({
      data: {
        fullName: body.fullName.trim(),
        phone: body.phone.trim(),
        email: body.email.trim().toLowerCase(),
        serviceType: body.serviceType,
        pickupLocation: body.pickupLocation.trim(),
        deliveryLocation: body.deliveryLocation.trim(),
        movement: body.movement,
        readyDate: new Date(body.readyDate),
        cargoDescription: body.cargoDescription.trim(),
      },
    })

    return NextResponse.json({ id: quoteRequest.id }, { status: 201 })
  } catch (error) {
    console.error('[v0] quote request creation failed', error)
    return NextResponse.json({ error: 'Unable to save your request right now.' }, { status: 500 })
  }
}

export async function GET() {
  const requests = await db.quoteRequest.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(requests)
}
