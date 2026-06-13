import fs from 'node:fs'
import path from 'node:path'

const RESEND_ENDPOINT = 'https://api.resend.com/emails'
const DEFAULT_FORMSPREE_MERCH_ENDPOINT = 'https://formspree.io/f/xykanyew'
const LOCAL_ALLOWED_ORIGINS = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
])

function loadLocalEnv() {
  if (process.env.VERCEL === '1' || process.env.NODE_ENV === 'production') return

  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const eq = trimmed.indexOf('=')
    if (eq === -1) continue

    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (!key || process.env[key]) continue

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    process.env[key] = value
  }
}

loadLocalEnv()

function json(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

function setCors(req, res) {
  const origin = req.headers?.origin
  if (!LOCAL_ALLOWED_ORIGINS.has(origin)) return

  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept')
}

function clean(value) {
  return String(value || '').trim()
}

function getResendErrorMessage(detail) {
  try {
    const parsed = JSON.parse(detail)
    return parsed.message || parsed.error || detail
  } catch {
    return detail
  }
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
    throw new Error(getResendErrorMessage(detail))
  }

  return response.json()
}

function getEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.MERCH_ORDER_FROM_EMAIL
  const to = process.env.MERCH_ORDER_TO_EMAIL
  const missing = []
  if (!apiKey) missing.push('RESEND_API_KEY')
  if (!from) missing.push('MERCH_ORDER_FROM_EMAIL')
  if (!to) missing.push('MERCH_ORDER_TO_EMAIL')
  return {
    configured: missing.length === 0,
    missing,
    apiKey,
    from,
    to,
  }
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
  setCors(req, res)

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

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
  let emailWarning = ''

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
  if (emailConfig.configured) {
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
      emailWarning = `Internal order email failed: ${err.message}`
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
      emailWarning = `Customer auto-response failed: ${err.message}`
      console.warn('[Merch Order] customer autoresponse failed:', err.message)
    }
  } else {
    emailWarning = `Customer auto-response skipped. Missing env vars: ${emailConfig.missing.join(', ')}.`
    console.warn(`[Merch Order] ${emailWarning}`)
  }

  if (!formspreeForwarded && !internalEmailSent) {
    return json(res, 500, { error: 'Unable to send merch order. Please try again.' })
  }

  return json(res, 200, {
    ok: true,
    formspreeForwarded,
    internalEmailSent,
    autoresponseSent,
    emailConfigured: emailConfig.configured,
    emailWarning,
  })
}
