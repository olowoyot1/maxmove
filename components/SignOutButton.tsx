'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function SignOutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function signOut() {
    if (loading) return
    setLoading(true)
    try {
      await fetch('/api/logout', { method: 'POST', cache: 'no-store' })
    } finally {
      router.replace('/login')
      router.refresh()
      setLoading(false)
    }
  }

  return (
    <button type="button" className="signout-button" onClick={signOut} disabled={loading}>
      <LogOut size={15} aria-hidden="true" />
      {loading ? 'Signing out…' : 'Sign out'}
    </button>
  )
}
