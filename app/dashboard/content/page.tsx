'use client'

import { useEffect, useState } from 'react'
import DashboardShell from '@/components/DashboardShell'

export default function ContentPage() {
  const [content, setContent] = useState({ heroTitle: '', heroDescription: '', primaryCta: '', secondaryCta: '' })
  const [message, setMessage] = useState('')
  useEffect(() => { fetch('/api/content').then((response) => response.json()).then(setContent) }, [])
  async function save(event: React.FormEvent) { event.preventDefault(); setMessage('Saving…'); const response = await fetch('/api/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(content) }); setMessage(response.ok ? 'Published to the customer website.' : 'Could not save content.') }
  return <DashboardShell title="Website content"><main className="content-editor"><div className="page-head"><div><span className="badge green">PUBLIC WEBSITE</span><h2>Control customer-facing content</h2><p className="muted">Edit the copy customers see without changing the operations workspace.</p></div></div><form className="card" onSubmit={save}><div className="field"><label htmlFor="heroTitle">Homepage headline</label><textarea id="heroTitle" rows={3} value={content.heroTitle} onChange={(event) => setContent({ ...content, heroTitle: event.target.value })} /></div><div className="field"><label htmlFor="heroDescription">Homepage introduction</label><textarea id="heroDescription" rows={4} value={content.heroDescription} onChange={(event) => setContent({ ...content, heroDescription: event.target.value })} /></div><div className="content-grid"><div className="field"><label htmlFor="primaryCta">Primary button</label><input id="primaryCta" value={content.primaryCta} onChange={(event) => setContent({ ...content, primaryCta: event.target.value })} /></div><div className="field"><label htmlFor="secondaryCta">Secondary button</label><input id="secondaryCta" value={content.secondaryCta} onChange={(event) => setContent({ ...content, secondaryCta: event.target.value })} /></div></div><div className="builder-footer"><span className="save-message">{message}</span><button className="button primary" type="submit">Save and publish</button></div></form></main></DashboardShell>
}
