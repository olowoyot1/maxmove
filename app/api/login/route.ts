import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/prisma'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const username = typeof body?.username === 'string' ? body.username.trim() : ''
  const password = typeof body?.password === 'string' ? body.password : ''
  const email = username.includes('@') ? username : `${username}@maxmove.com`
  const user = await db.user.findUnique({ where: { email } })

  if (!user?.passwordHash || user.role !== 'ADMIN' || !(await bcrypt.compare(password, user.passwordHash))) {
    return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set('maxmove_admin', user.id, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 8 })
  return response
}
