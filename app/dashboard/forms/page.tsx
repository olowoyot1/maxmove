'use client'

import { useEffect, useState } from 'react'
import DashboardShell from '@/components/DashboardShell'

type Field = { id: string; label: string; type: 'text' | 'email' | 'tel' | 'date' | 'textarea' | 'select'; required: boolean; options?: string[] }
type FormRecord = { id: string; name: string; slug: string; description: string | null; fields: string; status: string; _count: { submissions: number } }

const starterFields: Field[] = [
  { id: 'full-name', label: 'Full name', type: 'text', required: true },
  { id: 'email', label: 'Email address', type: 'email', required: true },
  { id: 'phone', label: 'Phone number', type: 'tel', required: true },
  { id: 'pickup', label: 'Pickup location', type: 'text', required: true },
  { id: 'delivery', label: 'Delivery location', type: 'text', required: true },
  { id: 'cargo', label: 'Cargo description', type: 'textarea', required: true },
]

export default function FormsPage() {
  const [forms, setForms] = useState<FormRecord[]>([])
  const [submissions, setSubmissions] = useState<Array<{ id: string; data: string; createdAt: string; form: { name: string } }>>([])
  const [name, setName] = useState('Shipment request')
  const [description, setDescription] = useState('Tell us what you need moved and our operations team will respond with a quote.')
  const [fields, setFields] = useState<Field[]>(starterFields)
  const [message, setMessage] = useState('')

  async function load() {
    const [formResponse, submissionResponse] = await Promise.all([fetch('/api/forms'), fetch('/api/forms/submissions')])
    if (formResponse.ok) setForms(await formResponse.json())
    if (submissionResponse.ok) setSubmissions(await submissionResponse.json())
  }
  useEffect(() => { load() }, [])

  function addField(type: Field['type']) {
    setFields((current) => [...current, { id: `field-${Date.now()}`, label: type === 'textarea' ? 'Additional details' : 'New question', type, required: false }])
  }
  function updateField(id: string, patch: Partial<Field>) { setFields((current) => current.map((field) => field.id === id ? { ...field, ...patch } : field)) }
  async function save(status: 'DRAFT' | 'PUBLISHED') {
    setMessage('Saving…')
    const response = await fetch('/api/forms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, description, fields, status }) })
    setMessage(response.ok ? status === 'PUBLISHED' ? 'Published. Customers can now use /request.' : 'Draft saved.' : 'Could not save form.')
    await load()
  }
  async function publish(id: string, status: string) {
    await fetch('/api/forms', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
    await load()
  }

  return <DashboardShell title="Form Builder"><div className="page-head"><div><span className="badge green">CUSTOMER INTAKE</span><h2>Design a customer form</h2><p className="muted">Build, publish, and review forms without editing code.</p></div><a className="button primary" href="/request" target="_blank">Preview public form</a></div>
    <div className="grid-2" style={{ alignItems: 'start' }}><section className="card"><div className="table-heading"><div><h3>Form designer</h3><p className="muted">Published forms appear automatically on the public request page.</p></div></div><label className="field-label">Form name<input className="text-input" value={name} onChange={(event) => setName(event.target.value)} /></label><label className="field-label">Description<textarea className="text-input" value={description} onChange={(event) => setDescription(event.target.value)} rows={3} /></label><div className="form-fields">{fields.map((field, index) => <div className="builder-field" key={field.id}><div className="field-row"><strong>{index + 1}. Field</strong><button className="text-button" onClick={() => setFields(fields.filter((item) => item.id !== field.id))}>Remove</button></div><input className="text-input" value={field.label} onChange={(event) => updateField(field.id, { label: event.target.value })} aria-label="Field label" /><div className="field-row"><select className="text-input" value={field.type} onChange={(event) => updateField(field.id, { type: event.target.value as Field['type'] })}><option value="text">Short answer</option><option value="textarea">Long answer</option><option value="email">Email</option><option value="tel">Phone</option><option value="date">Date</option><option value="select">Dropdown</option></select><label className="checkbox-label"><input type="checkbox" checked={field.required} onChange={(event) => updateField(field.id, { required: event.target.checked })} /> Required</label></div></div>)}</div><div className="field-row" style={{ flexWrap: 'wrap' }}><button className="button secondary" onClick={() => addField('text')}>+ Short answer</button><button className="button secondary" onClick={() => addField('textarea')}>+ Long answer</button><button className="button secondary" onClick={() => addField('select')}>+ Dropdown</button></div><div className="field-row" style={{ marginTop: 20 }}><button className="button secondary" onClick={() => save('DRAFT')}>Save draft</button><button className="button primary" onClick={() => save('PUBLISHED')}>Save & publish</button></div>{message && <p className="muted" role="status">{message}</p>}</section>
    <section className="card"><div className="table-heading"><div><h3>Saved forms</h3><p className="muted">Manage what customers can access.</p></div></div>{forms.length ? forms.map((form) => <div className="list-row" key={form.id}><div><strong>{form.name}</strong><small>/{form.slug} · {form._count.submissions} submissions</small></div><button className="button secondary" onClick={() => publish(form.id, form.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED')}>{form.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}</button></div>) : <div className="empty-state"><h3>No saved forms yet</h3><p className="muted">Save your first form to make it available.</p></div>}<h3 style={{ marginTop: 28 }}>Recent submissions</h3>{submissions.length ? submissions.map((submission) => <div className="list-row" key={submission.id}><div><strong>{submission.form.name}</strong><small>{new Date(submission.createdAt).toLocaleString()}</small></div><span className="badge green">RECEIVED</span></div>) : <p className="muted">Customer submissions will appear here.</p>}</section></div>
  </DashboardShell>
}
