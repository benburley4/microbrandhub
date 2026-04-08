'use client'

import { useState } from 'react'

interface Props {
  dropId: string
  dropTitle: string
  brandName: string
}

type State = 'idle' | 'open' | 'submitting' | 'success' | 'error'

export default function NotifyMeButton({ dropId, dropTitle, brandName }: Props) {
  const [state, setState] = useState<State>('idle')
  const [email, setEmail] = useState('')

  const formId = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID ?? 'YOUR_FORM_ID'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('submitting')
    try {
      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email,
          _subject: `Drop alert: ${brandName} — ${dropTitle}`,
          drop_id: dropId,
          drop_title: dropTitle,
          brand: brandName,
        }),
      })
      setState(res.ok ? 'success' : 'error')
    } catch {
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className="flex items-center gap-2 font-mono text-xs text-lume mt-3">
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        We&apos;ll notify you when this drops.
      </div>
    )
  }

  if (state === 'open' || state === 'submitting' || state === 'error') {
    return (
      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 min-w-0 bg-midnight border border-storm rounded-sm px-3 py-1.5 text-xs text-archive placeholder-silver focus:outline-none focus:border-lume transition-colors"
        />
        <button
          type="submit"
          disabled={state === 'submitting'}
          className="btn-primary text-xs py-1.5 px-3 whitespace-nowrap disabled:opacity-50"
        >
          {state === 'submitting' ? '…' : 'Notify →'}
        </button>
        <button
          type="button"
          onClick={() => setState('idle')}
          className="text-silver hover:text-archive text-xs px-1 transition-colors"
          aria-label="Cancel"
        >
          ✕
        </button>
        {state === 'error' && (
          <p className="absolute font-mono text-xs text-copper mt-1">Error — try again.</p>
        )}
      </form>
    )
  }

  // idle
  return (
    <button
      onClick={() => setState('open')}
      className="mt-3 flex items-center gap-1.5 font-mono text-xs text-silver hover:text-lume transition-colors group"
    >
      <svg className="w-3.5 h-3.5 shrink-0 group-hover:text-lume" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      Notify me
    </button>
  )
}
