import { useEffect, useState } from 'react'

const REDIRECT_SECONDS = 8

export default function OrderConfirmed({ confirmation, onNavigate }) {
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS)
  const orderSummary = confirmation?.orderSummary || 'Your merch order request'
  const email = confirmation?.email || ''
  const autoresponseSent = confirmation?.autoresponseSent
  const warning = confirmation?.warning || ''

  useEffect(() => {
    setSecondsLeft(REDIRECT_SECONDS)
    const timer = setInterval(() => {
      setSecondsLeft(current => {
        if (current <= 1) {
          clearInterval(timer)
          onNavigate('merch')
          return 0
        }
        return current - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onNavigate, confirmation])

  return (
    <section id="order-confirmed">
      <div className="container">
        <div className="order-confirmation">
          <span className="order-confirmation-kicker">// MERCH ORDER</span>
          <h2>Order request received</h2>
          <p>
            We received your merch order request. We will check item availability,
            shipping fee, and payment details, then contact you before anything is final.
          </p>

          <div className="order-confirmation-summary">
            <span>Order</span>
            <strong>{orderSummary}</strong>
          </div>

          {email && (
            <div className="order-confirmation-summary">
              <span>Email</span>
              <strong>{email}</strong>
            </div>
          )}

          {autoresponseSent === true && (
            <p className="order-confirmation-note">A confirmation email was sent to your inbox.</p>
          )}
          {autoresponseSent === false && warning && (
            <p className="order-confirmation-note order-confirmation-note--warning">{warning}</p>
          )}

          <div className="order-confirmation-actions">
            <button type="button" className="btn btn-primary" onClick={() => onNavigate('merch')}>
              Back to Merch
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => onNavigate('hero')}>
              Home
            </button>
          </div>

          <p className="order-confirmation-redirect">
            Returning to merch in {secondsLeft} second{secondsLeft === 1 ? '' : 's'}.
          </p>
        </div>
      </div>
    </section>
  )
}
