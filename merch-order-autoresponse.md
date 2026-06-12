# Merch Order Auto-Response

## Overview

Merch orders are now handled by a Vercel API endpoint:

```text
/api/merch-order
```

The endpoint:

- sends the internal merch order email to VOIDANCE through Resend
- sends the customer auto-response through Resend
- forwards a backup copy to the existing Formspree merch form
- accepts the order if Formspree succeeds even when Resend is not configured yet

General contact messages still submit directly to Formspree.

## Required Vercel Environment Variables

Add these to the Vercel project for the main website:

```text
RESEND_API_KEY=
MERCH_ORDER_TO_EMAIL=
MERCH_ORDER_FROM_EMAIL=
```

Without these Resend variables, merch orders can still be captured through the Formspree backup, but customer auto-response emails will be skipped.

Optional:

```text
FORMSPREE_MERCH_ENDPOINT=https://formspree.io/f/xykanyew
```

If `FORMSPREE_MERCH_ENDPOINT` is not set, the API uses the current merch Formspree endpoint as the backup target.

## Customer Auto-Response

The customer receives:

```text
Thanks for your VOIDANCE merch order.

We received your order request and delivery details. We will review item availability and shipping fee, then contact you with the final total and payment instructions.

Stock is reserved only after payment confirmation.
```

## Inventory Rule

The API does not deduct stock. Stock should still be deducted manually in Sanity only after payment is confirmed or the merch is prepared for shipment.

## Local Testing

`npm run dev` starts Vite only and does not run Vercel API functions. Use Vercel local development when testing the endpoint:

```bash
vercel dev
```
