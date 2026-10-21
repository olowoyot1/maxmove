'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  async function submit(event: React.FormEvent) { event.preventDefault(); await fetch('/api/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) }); setSent(true) }
  return <main className="login"><div className="login-card"><img className="login-logo" src="/maxmove-logo.jpg" alt="MaxMove Logistics"/><span className="badge green">ACCOUNT RECOVERY</span><h1>Reset your password</h1>{sent ? <><p style={{ color: '#6b7a90', lineHeight: 1.6 }}>If an account matches that email, recovery instructions have been sent. Check your inbox or contact MaxMove administration.</p><Link href="/login" className="btn green" style={{ display: 'block', textAlign: 'center', marginTop: 20 }}>Back to sign in</Link></> : <form onSubmit={submit}><div className="field"><label htmlFor="email">Email address</label><input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></div><button className="btn green" style={{ width: '100%', marginTop: 8 }}>Send recovery instructions</button><p style={{ textAlign: 'center', marginTop: 16 }}><Link href="/login" style={{ color: '#0f766e', fontSize: 12 }}>Return to sign in</Link></p></form>}</div></main>
}
