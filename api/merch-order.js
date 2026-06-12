const RESEND_ENDPOINT = 'https://api.resend.com/emails'
const DEFAULT_FORMSPREE_MERCH_ENDPOINT = 'https://formspree.io/f/xykanyew'

function json(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

function clean(value) {
  return String(value || '').trim()
}

async function sendResendEmail({ apiKey, from, to, replyTo, subject, text }) {
  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: replyTo,
      subject,
      text,
    }),
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`Resend rejected email: ${detail}`)
  }

  return response.json()
}

function getEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.MERCH_ORDER_FROM_EMAIL
  const to = process.env.MERCH_ORDER_TO_EMAIL
  return apiKey && from && to ? { apiKey, from, to } : null
}

async function forwardToFormspree(payload) {
  const endpoint = process.env.FORMSPREE_MERCH_ENDPOINT || DEFAULT_FORMSPREE_MERCH_ENDPOINT
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Formspree backup failed with status ${response.status}`)
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return json(res, 405, { error: 'Method not allowed' })
  }

  const body = req.body || {}
  const order = {
    name: clean(body.name),
    email: clean(body.email),
    mobile: clean(body.mobile || body.mobileNumber),
    address: clean(body.address || body.deliveryAddress),
    subject: clean(body.subject) || 'Merch Order',
    message: clean(body.message),
    orderSummary: clean(body.orderSummary),
  }

  const missing = []
  if (!order.name) missing.push('name')
  if (!order.email) missing.push('email')
  if (!order.mobile) missing.push('mobile')
  if (!order.address) missing.push('address')
  if (!order.orderSummary) missing.push('orderSummary')

  if (missing.length) {
    return json(res, 400, { error: `Missing required fields: ${missing.join(', ')}` })
  }

  const internalText = [
    'New VOIDANCE merch order',
    '',
    'Customer:',
    `Full Name: ${order.name}`,
    `Email: ${order.email}`,
    `Mobile Number: ${order.mobile}`,
    `Delivery Address: ${order.address}`,
    '',
    'Order:',
    order.orderSummary,
    '',
    'Message:',
    order.message || '-',
    '',
    'Inventory note:',
    'Do not deduct stock until payment is confirmed or the merch is prepared for shipment.',
  ].join('\n')

  const customerText = [
    'Thanks for your VOIDANCE merch order.',
    '',
    'We received your order request and delivery details. We will review item availability and shipping fee, then contact you with the final total and payment instructions.',
    '',
    'Stock is reserved only after payment confirmation.',
    '',
    'Order received:',
    order.orderSummary,
  ].join('\n')

  let formspreeForwarded = false
  let autoresponseSent = false
  let internalEmailSent = false

  try {
    await forwardToFormspree({
      ...body,
      formType: 'Merch Order',
      message: internalText,
      mobileNumber: order.mobile,
      deliveryAddress: order.address,
    })
    formspreeForwarded = true
  } catch (err) {
    console.warn('[Merch Order] Formspree backup failed:', err.message)
  }

  const emailConfig = getEmailConfig()
  if (emailConfig) {
    const { apiKey, from, to } = emailConfig
    try {
      await sendResendEmail({
        apiKey,
        from,
        to,
        replyTo: order.email,
        subject: `New VOIDANCE merch order - ${order.name}`,
        text: internalText,
      })
      internalEmailSent = true
    } catch (err) {
      console.warn('[Merch Order] internal email failed:', err.message)
    }

    try {
      await sendResendEmail({
        apiKey,
        from,
        to: order.email,
        replyTo: to,
        subject: 'VOIDANCE merch order received',
        text: customerText,
      })
      autoresponseSent = true
    } catch (err) {
      console.warn('[Merch Order] customer autoresponse failed:', err.message)
    }
  } else {
    console.warn('[Merch Order] Resend env vars not configured; skipped autoresponse emails.')
  }

  if (!formspreeForwarded && !internalEmailSent) {
    return json(res, 500, { error: 'Unable to send merch order. Please try again.' })
  }

  return json(res, 200, { ok: true, formspreeForwarded, internalEmailSent, autoresponseSent })
}
