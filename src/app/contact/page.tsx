'use client'

import { useState } from 'react'
import Link from 'next/link'

// Replace FORMSPREE_FORM_ID in .env.local with your actual Formspree form ID
// Get a free form at https://formspree.io (50 submissions/month free)
const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID
  ? `https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID}`
  : null

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactPage() {
  const [state, setState] = useState<FormState>('idle')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!FORMSPREE_ENDPOINT) {
      setState('error')
      return
    }
    setState('submitting')
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      })
      if (res.ok) {
        setState('success')
        setName(''); setEmail(''); setSubject(''); setMessage('')
      } else {
        setState('error')
      }
    } catch {
      setState('error')
    }
  }

  const inputClass = 'w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-brand-500 transition-colors'

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-4">Get in Touch</h1>
        <p className="text-stone-400">
          Questions, brand submissions, partnership enquiries, or just want to talk watches? We'd love to hear from you.
        </p>
      </div>

      {state === 'success' ? (
        <div className="bg-green-900/30 border border-green-800/50 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">✓</div>
          <h2 className="text-xl font-bold text-white mb-2">Message sent!</h2>
          <p className="text-stone-400 mb-6">We'll get back to you within 48 hours.</p>
          <Link href="/" className="btn-primary">Back to Home</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-stone-900 border border-stone-800 rounded-2xl p-8 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-stone-400 mb-1.5">Name</label>
              <input
                type="text"
                required
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm text-stone-400 mb-1.5">Email</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-stone-400 mb-1.5">Subject</label>
            <select
              value={subject}
              onChange={e => setSubject(e.target.value)}
              required
              className={inputClass}
            >
              <option value="">Select a subject...</option>
              <option value="Brand Submission">Brand Submission</option>
              <option value="Review Request">Review Request</option>
              <option value="Drop Listing">Drop Listing</option>
              <option value="Partnership / Advertising">Partnership / Advertising</option>
              <option value="General Enquiry">General Enquiry</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-stone-400 mb-1.5">Message</label>
            <textarea
              required
              rows={6}
              placeholder="Tell us what's on your mind..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>

          {state === 'error' && (
            <p className="text-red-400 text-sm">
              {!FORMSPREE_ENDPOINT
                ? 'Contact form not yet configured. Add NEXT_PUBLIC_FORMSPREE_FORM_ID to your .env.local file.'
                : 'Something went wrong. Please try again or email us directly.'}
            </p>
          )}

          <button
            type="submit"
            disabled={state === 'submitting'}
            className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state === 'submitting' ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}

      {/* Alternative contact info */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">
          <h3 className="font-semibold text-white mb-1">Brand Submissions</h3>
          <p className="text-sm text-stone-400">Want your brand listed? Use the form above with subject "Brand Submission" and include your website, price range, and home country.</p>
        </div>
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">
          <h3 className="font-semibold text-white mb-1">Response Time</h3>
          <p className="text-sm text-stone-400">We aim to respond to all enquiries within 48 hours. Drop listing requests are reviewed weekly.</p>
        </div>
      </div>
    </div>
  )
}
