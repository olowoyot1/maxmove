import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/prisma'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const username = typeof body?.username === 'string' ? body.username.trim() : ''
  const password = typeof body?.password === 'string' ? body.password : ''
  const email = username.includes('@') ? username : `${username}@maxmove.com`
  let adminId: string | null = null

  try {
    const user = await db.user.findUnique({ where: { email } })
    if (user?.passwordHash && user.role === 'ADMIN' && await bcrypt.compare(password, user.passwordHash)) {
      adminId = user.id
    }
  } catch (error) {
    console.error('[v0] Admin login database lookup failed:', error)
  }

  // Keep the prototype usable before the connected database has been seeded.
  const fallbackUsername = process.env.MAXMOVE_ADMIN_USERNAME ?? 'admin'
  const fallbackPassword = process.env.MAXMOVE_ADMIN_PASSWORD ?? 'Maxmove2025!'
  if (!adminId && username === fallbackUsername && password === fallbackPassword) {
    adminId = 'prototype-admin'
  }

  if (!adminId) {
    return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set('maxmove_admin', adminId, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 8 })
  return response
}
