import { useState } from 'react'
import { FORMSPREE_ENDPOINTS } from '../lib/formspree'
import { trackEvent } from '../utils/analytics'

export default function NewsletterSignup() {
  const [form, setForm] = useState({ name: '', email: '' })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const updateField = event => {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }))
    setStatus('idle')
    setError('')
  }

  const submit = async event => {
    event.preventDefault()
    setStatus('loading')
    setError('')

    try {
      const response = await fetch(FORMSPREE_ENDPOINTS.newsletter, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formType: 'Newsletter Signup',
          name: form.name,
          email: form.email,
        }),
      })

      if (!response.ok) {
        throw new Error('Unable to subscribe. Please try again.')
      }

      trackEvent('newsletter_signup_submitted', { source: 'contact' })
      setStatus('success')
      setForm({ name: '', email: '' })
    } catch (err) {
      trackEvent('newsletter_signup_failed', { source: 'contact' })
      setError(err.message || 'Unable to subscribe. Please try again.')
      setStatus('error')
    }
  }

  return (
    <form className="newsletter-signup" onSubmit={submit}>
      <div className="newsletter-title">// UPDATES</div>
      <label>
        <span>Name</span>
        <input name="name" type="text" value={form.name} onChange={updateField} placeholder="Optional" />
      </label>
      <label>
        <span>Email</span>
        <input name="email" type="email" value={form.email} onChange={updateField} placeholder="your@email.com" required />
      </label>
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed' : 'Get Updates'}
      </button>
      <p className="newsletter-status" aria-live="polite">
        {status === 'success' && 'You are on the list.'}
        {status === 'error' && error}
      </p>
    </form>
  )
}
