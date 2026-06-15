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

# Enhancement Log

Every enhancement moving forward must be added to this log with date, purpose,
files/schemas affected, deployment requirement, and test notes.

## June 16, 2026 - Announcement Banner Scheduling

**Purpose:** Implement CMS-managed announcement scheduling for upcoming gigs
while keeping merch drops, singles, albums, and general notices manually
published.

### Direction

- Add a close button so users can dismiss the banner until the page is reloaded
  without permanently hiding important gig announcements.
- Upcoming gigs support automatic display 7 days before the confirmed event
  date by default.
- If no eligible manual announcement exists, the banner automatically uses the
  nearest qualifying Tour Date within 7 days.
- On the event date itself, the automatic Tour Date banner switches from
  `UPCOMING GIG` to `LIVE NOW` with a stronger attention animation.
- Manual publishing must remain available so a gig can be announced earlier
  when needed.
- Merch drops, singles, and album announcements should stay manual because their
  timing depends on release links, marketing plans, and readiness.

### Future Scheduling Fields

The announcement schema keeps the existing fields:

```text
active
announcementType
title
message
tone
ctaType
ctaPage
ctaUrl
```

It now includes scheduling fields:

```text
eventDate
autoShowDaysBefore   default: 7
expiresAt
```

### Display Rules

- `Active = true` shows the announcement immediately unless `expiresAt` is
  already past.
- If `Active = false`, `announcementType = gig`, and `eventDate` is within the
  auto-display window, show the announcement automatically.
- If no manual announcement qualifies, show the next Tour Date within 7 days as
  an automatic `UPCOMING GIG` banner.
- If the automatic Tour Date is today, show `LIVE NOW` and apply the live banner
  animation.
- If `expiresAt` is past, hide the announcement even when `Active = true`.
- If a user closes a banner, hide that specific announcement until the page is
  reloaded. Reloading the page or opening a new tab shows it again.
- Merch drops, singles, albums, and general announcements do not auto-display;
  they require `Active = true`.
- Tour Dates marked `done` or `cancelled` are not announced automatically.
- The first eligible announcement by `sortOrder` is shown.

### Files / Schemas Affected

```text
studio/schemas/siteAnnouncement.js
src/components/AnnouncementBanner.jsx
src/lib/sanity.js
src/styles/index.css
src/utils/tourDates.js
README.md
```

### Deployment Requirement

- Manual announcement content changes: publish in Sanity Studio only.
- This scheduling implementation changes both site code and Studio schema:
  deploy the main site and redeploy Sanity Studio.

### Test Notes

- Create an active announcement in Studio and confirm it appears below the nav.
- Create a gig announcement with `Active = false`, an `eventDate` within 7 days,
  and confirm it appears automatically.
- Create a gig announcement with an `eventDate` more than 7 days away and
  confirm it stays hidden unless `Active = true`.
- Remove or deactivate manual announcements, create a Tour Date within 7 days,
  and confirm the automatic `UPCOMING GIG` banner appears.
- Set a qualifying Tour Date to today's date and confirm the banner says
  `LIVE NOW` with the live animation.
- Close the banner and confirm it stays hidden while navigating site tabs, then
  reload and confirm it appears again.
- Set `expiresAt` in the past and confirm the banner hides.
- Confirm page CTA navigates internally and URL CTA opens externally.

---

## June 16, 2026 - Tour Date Display Ordering

**Purpose:** Ensure Tour Dates display by actual event date instead of Sanity
document upload or edit order.

### Direction

- Parse the existing Tour Date `date` and `year` fields.
- Sort the Tour page list by event date descending, newest/latest date first.
- Keep the automatic announcement logic using nearest qualifying upcoming date.

### Files / Schemas Affected

```text
src/components/Tour.jsx
src/utils/tourDates.js
README.md
```

### Deployment Requirement

- Main site deploy only.
- No Sanity Studio schema deploy is required for this sorting change.

### Test Notes

- Create Tour Dates in Sanity out of upload order.
- Confirm the Tour page still lists them by event date, newest/latest first.
- Confirm `done` and `cancelled` statuses still render normally in date order.

---

## June 16, 2026 - Automatic Past Gig Status

**Purpose:** Display past non-cancelled Tour Dates as `Done` automatically once
their event date has passed.

### Direction

- Derive an effective Tour Date status in frontend code.
- Keep `cancelled` as `Cancelled` even after the event date.
- Keep today's gig as its current status so the announcement can still show
  `LIVE NOW`.
- Do not mutate Sanity documents from the public frontend.

### Files / Schemas Affected

```text
src/components/AnnouncementBanner.jsx
src/components/Tour.jsx
src/utils/tourDates.js
README.md
```

### Deployment Requirement

- Main site deploy only.
- No Sanity Studio schema deploy is required for this status behavior.

### Test Notes

- Set a Tour Date to yesterday with status `upcoming`, `free-entry`,
  `available`, `limited`, or `sold-out`.
- Confirm the Tour page displays `Done`.
- Set a past Tour Date to `cancelled` and confirm it remains `Cancelled`.
- Set a Tour Date to today's date and confirm it does not auto-change to `Done`.

---

## June 16, 2026 - Scheduled Release Priority Rules

**Purpose:** Define how scheduled single, album, and merch release announcements
coexist with automatic gig announcements.

### Direction

- Keep one announcement banner visible at a time to avoid crowding the page,
  especially on mobile.
- Compute all eligible announcements first, then render the highest-priority
  result.
- If a scheduled release is showing first and an upcoming gig later enters its
  auto-display window, the gig temporarily takes over the banner.
- After the gig passes, the release announcement can return if it is still
  inside its display window and has not expired.
- If a gig date and release date are the same day, show a combined banner rather
  than stacking two banners.

### Priority Rules

Recommended priority order:

```text
1. Live gig today
2. Live gig today + release today combined
3. Urgent manual announcement
4. Upcoming gig within 7 days
5. Release today
6. Scheduled release countdown
7. Normal manual announcement
```

`LIVE NOW` should not be overridden by release countdowns. If a release is also
today, combine it with the live gig banner:

```text
LIVE NOW / OUT NOW
VOIDANCE live tonight in Cebu City - new single available now
```

If a release needs to beat an upcoming gig before gig day, use a future manual
priority field. Recommended values:

```text
priority: normal | high | urgent
```

`urgent` may override an upcoming gig countdown, but should not override
`LIVE NOW`.

### Schema Fields

Scheduled release support uses these `siteAnnouncement` fields:

```text
releaseDate
autoShowDaysBefore   default: 14 for single/album/merch
priority             normal | high | urgent
```

Reuse existing fields:

```text
announcementType     single | album | merch | gig | general
active
title
message
ctaType
ctaPage
ctaUrl
tone
expiresAt
```

### Labels

Suggested automatic labels:

```text
single/album before release date: NEW SINGLE / NEW ALBUM
single/album on release date: OUT NOW
merch before release date: MERCH DROP
merch on release date: MERCH LIVE
gig before event date: UPCOMING GIG
gig on event date: LIVE NOW
```

### Files / Schemas Affected

```text
studio/schemas/siteAnnouncement.js
src/components/AnnouncementBanner.jsx
src/lib/sanity.js
src/styles/index.css
README.md
enhance-plan.md
```

### Deployment Requirement

- Main site deploy.
- Sanity Studio redeploy because `siteAnnouncement` schema fields changed.

### Test Notes

- Schedule a release 14 days out and confirm it appears during its window.
- Add an upcoming gig within 7 days and confirm the gig takes priority.
- Put a release and gig on the same date and confirm the combined banner.
- Set a release to `urgent` and confirm it can override upcoming gig countdowns
  but not `LIVE NOW`.
- Confirm expired releases hide after `expiresAt`.

---

**Last Updated:** June 2026  
**Stack:** React + Vite + Sanity CMS + Vercel  
**Project:** VOIDANCE Website v2.0
