import { useEffect, useState } from 'react'
import { SOCIALS } from '../data/bandData'
import { FORMSPREE_ENDPOINTS } from '../lib/formspree'

export default function Contact({ checkoutSummary = '' }) {
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    subject: '',
    message: '',
  })
  const isMerchOrder = Boolean(checkoutSummary) || form.subject.trim().toLowerCase() === 'merch order'

  useEffect(() => {
    if (!checkoutSummary) return
    setForm(current => ({
      ...current,
      subject: 'Merch Order',
      message: `I would like to order: ${checkoutSummary}`,
    }))
    setStatus('idle')
    setError('')
  }, [checkoutSummary])

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('loading')
    setError('')

    const endpoint = isMerchOrder ? '/api/merch-order' : FORMSPREE_ENDPOINTS.contact
    const merchFallbackMessage = `${form.message}\n\nContact details:\nName: ${form.name}\nEmail: ${form.email}\nMobile Number: ${form.mobile}\nAddress: ${form.address}`
    const payload = {
      ...form,
      formType: isMerchOrder ? 'Merch Order' : 'Contact',
      orderSummary: checkoutSummary,
      mobileNumber: form.mobile,
      deliveryAddress: form.address,
    }

    try {
      const submit = body => fetch(endpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      let response = await submit(payload)

      if (!response.ok && isMerchOrder) {
        response = await fetch(FORMSPREE_ENDPOINTS.merchOrders, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...payload, message: merchFallbackMessage }),
        })
      }

      if (!response.ok) {
        let detail = ''
        try {
          const result = await response.json()
          detail = result.error || result.message || ''
        } catch {
          detail = ''
        }
        throw new Error(detail || 'Unable to send message. Please try again.')
      }

      setStatus('success')
    } catch (err) {
      setError(err.message || 'Unable to send message. Please try again.')
      setStatus('error')
    }
  }

  const updateField = e => {
    setForm(current => ({ ...current, [e.target.name]: e.target.value }))
    setStatus('idle')
    setError('')
  }

  return (
    <section id="contact">
      <div className="container">
        <div className="section-header">
          <span className="section-num">07 //</span>
          <h2 className="section-title">CONTACT</h2>
          <div className="section-line" />
        </div>
        <div className="contact-layout">
          <div className="contact-left">
            <p>
              For bookings, press inquiries, or if you&apos;ve been swallowed by
              the void and need to reach someone on the other side.
            </p>
            <div className="social-grid">
              {SOCIALS.filter(s => s.label !== 'Bandcamp').map(s => (
                s.active ? (
                  <a key={s.label} href={s.url} className="social-item" target="_blank" rel="noopener noreferrer">
                    <span className="social-name">{s.label}</span>
                    <span className="social-status live">Live</span>
                  </a>
                ) : (
                  <div key={s.label} className="social-item inactive" aria-disabled="true">
                    <span className="social-name">{s.label}</span>
                    <span className="social-status">Coming soon</span>
                  </div>
                )
              ))}
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-title">// SEND A MESSAGE</div>
            <label className="form-group">
              <span>Full Name</span>
              <input name="name" placeholder="Your full name" type="text" value={form.name} onChange={updateField} required />
            </label>
            <label className="form-group">
              <span>Email</span>
              <input name="email" placeholder="your@email.com" type="email" value={form.email} onChange={updateField} required />
            </label>
            {isMerchOrder && (
              <>
                <label className="form-group">
                  <span>Mobile Number</span>
                  <input name="mobile" placeholder="09XX XXX XXXX" type="tel" value={form.mobile} onChange={updateField} required />
                </label>
                <label className="form-group">
                  <span>Delivery Address</span>
                  <textarea name="address" placeholder="Complete delivery address..." value={form.address} onChange={updateField} required />
                </label>
              </>
            )}
            <label className="form-group">
              <span>Subject</span>
              <input name="subject" placeholder="Booking / Press / General" type="text" value={form.subject} onChange={updateField} required />
            </label>
            <label className="form-group">
              <span>Message</span>
              <textarea name="message" placeholder="Your message..." value={form.message} onChange={updateField} required />
            </label>
            <button type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Sending...' : status === 'success' ? 'Message Sent' : 'Send Message'}
            </button>
            {status === 'success' && (
              <p className="form-note">
                {checkoutSummary ? 'Order sent. We will follow up through your contact details.' : 'Message sent. We will get back to you soon.'}
              </p>
            )}
            {status === 'error' && <p className="form-note form-note--error">{error}</p>}
          </form>
        </div>
      </div>
    </section>
  )
}
