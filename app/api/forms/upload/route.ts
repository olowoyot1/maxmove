import { NextResponse } from 'next/server'

const MAX_FILE_SIZE = 4 * 1024 * 1024
const ALLOWED_TYPES = new Set(['application/pdf', 'image/jpeg', 'image/png'])

export async function POST(request: Request) {
  try {
    const url = process.env.SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'customer-documents'
    if (!url || !serviceKey) {
      return NextResponse.json({ error: 'Document storage is not configured. Please contact MaxMove.' }, { status: 503 })
    }

    const formData = await request.formData()
    const file = formData.get('file')
    if (!(file instanceof File)) return NextResponse.json({ error: 'Choose a file to upload' }, { status: 400 })
    if (!ALLOWED_TYPES.has(file.type)) return NextResponse.json({ error: 'Only PDF, JPG and PNG files are allowed' }, { status: 400 })
    if (file.size <= 0 || file.size > MAX_FILE_SIZE) return NextResponse.json({ error: 'File must be smaller than 4 MB' }, { status: 400 })

    const bytes = Buffer.from(await file.arrayBuffer())
    const signatureOk = file.type === 'application/pdf'
      ? bytes.subarray(0, 5).toString('ascii') === '%PDF-'
      : file.type === 'image/jpeg'
        ? bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
        : bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    if (!signatureOk) return NextResponse.json({ error: 'The file content does not match its file type' }, { status: 400 })

    const extension = file.type === 'application/pdf' ? 'pdf' : file.type === 'image/jpeg' ? 'jpg' : 'png'
    const path = `customer-ids/${crypto.randomUUID()}.${extension}`
    const uploadUrl = `${url.replace(/\\/$/, '')}/storage/v1/object/${encodeURIComponent(bucket)}/${path.split('/').map(encodeURIComponent).join('/')}`
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey, 'Content-Type': file.type, 'x-upsert': 'false' },
      body: bytes,
      cache: 'no-store',
    })
    if (!response.ok) {
      console.error('[forms/upload] private storage rejected upload', response.status, await response.text())
      return NextResponse.json({ error: 'Document upload failed. Please try again.' }, { status: 502 })
    }
    return NextResponse.json({ path })
  } catch (error) {
    console.error('[forms/upload] upload failed', error)
    return NextResponse.json({ error: 'Document upload failed' }, { status: 500 })
  }
}
