import { NextResponse } from 'next/server'

export async function POST() {
  // Keep responses generic so account existence is never disclosed. Email delivery can be connected without changing this contract.
  return NextResponse.json({ ok: true })
}
