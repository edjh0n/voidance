# VOIDANCE Next Major Update Plan

**Version 2.0 - Merch Feature + Site Enhancements**

A step-by-step implementation guide for the VOIDANCE website.

**Project:** voidance-react  
**Stack:** React + Vite + Sanity CMS + Vercel  
**Prepared:** June 2026  
**Phase:** Phase 1 - Manual Orders (Phase 2: PayMongo later)

---

# What This Document Is

A step-by-step guide for the next major update to the VOIDANCE website.

It covers what needs to be built, where each file lives, and exactly what to do so anyone on the team can follow along.

---

# Overview of Changes

| # | What | Where It Shows | Status |
| - | ---- | -------------- | ------ |
| 1 | Merch Page | `#merch` tab/page | Implemented |
| 2 | Merch Sanity Schema | Sanity Studio | Implemented as `merchProduct` |
| 3 | Order Flow | Merch checkout -> Contact form | Implemented |
| 4 | Origin Timeline | Origin page | Implemented |
| 5 | Member Quotes | Members page | Implemented |
| 6 | Band Stats Bar | Home page | Implemented |
| 7 | Contact Form | Contact page | Implemented with Formspree |
| 8 | Navigation Update | Navigation bar | Implemented as page tabs |

---

# Part 1 - Merch Feature

The merch feature is a manual-order storefront.

## Current Order Flow

Customer browses -> adds to cart -> clicks checkout -> Contact page opens with order details prefilled -> customer submits to Formspree -> band follows up through email/Messenger -> customer pays through GCash or bank transfer -> band ships -> band updates stock in Sanity Studio.

---

## Step 1 - Merch Schema in Sanity

**File:**

```text
studio/schemas/merchProduct.js
```

**Document type:** `merchProduct`

| Field | Type | Description |
| ----- | ---- | ----------- |
| name | string | Product name |
| sub | string | Short variant/material line |
| description | text | Short product description |
| category | string | apparel / accessories / stickers / physical |
| price | string | Display price, e.g. `PHP 650` |
| sizes | array | S, M, L, XL, 2XL |
| stock | number | Available units |
| badge | string | new / limited |
| active | boolean | Show / hide product |
| image | image | Product photo |
| art | string | Local fallback art key |
| sortOrder | number | Display order |

**Registered in:**

```text
studio/schemas/index.js
```

```js
import merchProduct from './merchProduct'

export const schemaTypes = [galleryItem, mediaVideo, track, tourDate, merchProduct]
```

---

## Step 2 - Merch GROQ Query

**File:**

```text
src/lib/sanity.js
```

```js
merchProducts: `*[_type == "merchProduct" && active == true] | order(sortOrder asc, _createdAt desc) {
  _id, name, sub, description, category, price, sizes, badge, stock, art, sortOrder,
  "imageUrl": image.asset->url
}`
```

If Sanity has no active products or cannot be reached, the site falls back to local merch data.

---

## Step 3 - Merch Component

**File:**

```text
src/components/Merch.jsx
```

Features:

- Product grid
- Filter tabs
- Shopping cart state
- Stock badges
- Checkout handoff to Contact page
- Sanity products with local fallback data

Categories:

- All
- Apparel
- Accessories
- Stickers
- Physical Media

Stock logic:

| Stock | Badge | Button |
| ----- | ----- | ------ |
| 6+ | None / New | Enabled |
| 1-5 | Limited | Enabled |
| 0 | Sold Out | Disabled |

---

## Step 4 - Register Merch in App

**File:**

```text
src/App.jsx
```

The site now uses page tabs, not one long scrolling page. `Merch` is one of the active pages.

```jsx
merch: <Merch onCheckout={startCheckout} />
```

---

## Step 5 - Navigation

**File:**

```text
src/components/Nav.jsx
```

Navigation is tab-based:

- Home
- Gallery
- Origin
- Members
- Discography
- Tour
- Merch
- Contact

---

## Step 6 - Formspree

**File:**

```text
src/lib/formspree.js
```

Current endpoints:

```text
Merch Orders: https://formspree.io/f/xykanyew
Contact:      https://formspree.io/f/xpqeyzpo
```

Merch checkout uses the Contact form UI, but submits to the separate Merch Orders endpoint when the subject/order state indicates a merch order.

---

## Step 7 - Merch CSS

**File:**

```text
src/styles/index.css
```

Key styles:

```text
#merch
.merch-cart-bar
.merch-filter-row
.merch-filter
.merch-filter--active
.merch-grid
.merch-card
.merch-card--sold-out
.merch-img
.merch-badge
.merch-info
.merch-desc
.merch-sizes
.merch-row
.merch-note
```

---

# Part 2 - Site Enhancements

## Enhancement A - Origin Timeline

**Files:**

```text
src/components/About.jsx
src/data/bandData.js
src/styles/index.css
```

Timeline items:

- Early 2026 - Band forms
- March 2026 - CONTRITE recorded
- April 18, 2026 - Debut show at Roadhouse Rock & Dine
- May 16, 2026 - Second show at Quady's Bar
- Coming soon - Debut album and more shows

---

## Enhancement B - Member Quotes

**Files:**

```text
src/data/bandData.js
src/components/Members.jsx
```

Each member can include:

```js
{
  initials: 'MBA',
  role: 'Vocals',
  name: 'Mort Brian Apostol',
  instrument: 'Lead Vocals',
  quote: 'The voice that carries the void.',
  socials: {}
}
```

---

## Enhancement C - Hero Stats Bar

**Files:**

```text
src/components/Hero.jsx
src/data/bandData.js
src/styles/index.css
```

Stats:

- 6 Members
- 3 Tracks
- 2 Shows Played

Hero CTAs use the tab navigation system.

---

## Enhancement D - Contact Form

**Files:**

```text
src/components/Contact.jsx
src/lib/formspree.js
```

Layout:

- Left column: social links/statuses
- Right column: form fields

Fields:

- Name
- Email
- Subject
- Message

Behavior:

- General contact submits to the Contact Formspree endpoint.
- Merch checkout pre-fills subject/message and submits to the Merch Orders Formspree endpoint.
- Loading, success, and error states are shown in the UI.

---

# Part 3 - Order of Implementation

| # | Action | Status |
| - | ------ | ------ |
| 1 | Create `merchProduct` schema | Done |
| 2 | Register schema | Done |
| 3 | Add GROQ query | Done |
| 4 | Create Merch component | Done |
| 5 | Register Merch in App | Done |
| 6 | Update Navigation | Done |
| 7 | Add CSS | Done |
| 8 | Configure Formspree | Done |
| 9 | Add fallback products | Done |
| 10 | Add Timeline | Done |
| 11 | Add Member Quotes | Done |
| 12 | Add Hero Stats | Done |
| 13 | Add Contact Form | Done |
| 14 | Test Locally | Done for root app |
| 15 | Deploy to Vercel | Owner will do manually |

---

# Part 4 - Inventory Management

## Order Workflow

1. Receive Formspree notification.
2. Contact customer.
3. Confirm items, sizes, payment, and delivery.
4. Wait for payment.
5. Ship order.
6. Update stock in Sanity Studio.

## Updating Stock

1. Open Sanity Studio.
2. Open Merch Product.
3. Select product.
4. Reduce stock.
5. Publish.
6. Site updates automatically.

## Automatic Stock Rules

| Stock | Display | Button |
| ----- | ------- | ------ |
| 6+ | None / New | Enabled |
| 1-5 | Limited | Enabled |
| 0 | Sold Out | Disabled |

---

# Part 5 - Future Upgrade: PayMongo

PayMongo is a later phase. Do not add it until the manual Formspree order process is stable.

| Feature | Phase 1 | Phase 2 |
| ------- | ------- | ------- |
| Orders | Formspree | PayMongo |
| Payment | Manual | Automated |
| Confirmation | Manual follow-up | Auto email |
| Stock Update | Manual | Webhook |
| Component Changes | Contact/order submit flow | Payment checkout flow |

---

# Quick Reference

| Task | Location |
| ---- | -------- |
| Manage Merch | Sanity Studio -> Merch Product |
| Update Stock | Sanity Studio -> Merch Product |
| View Orders | Formspree |
| Add Tour Dates | Sanity Studio |
| Add Gallery | Sanity Studio |
| Manage Tracks | Sanity Studio |
| Update Band Info | `src/data/bandData.js` |
| Deploy | Owner pushes to production |

---

**Last Updated:** June 2026  
**Stack:** React + Vite + Sanity CMS + Vercel  
**Project:** VOIDANCE Website v2.0
