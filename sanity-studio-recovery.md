# Sanity Studio Recovery Notes

**Date:** June 13, 2026  
**Project:** VOIDANCE website / Sanity Studio  
**Scope:** Restore Sanity Studio dependency install, build, and production deployment.

---

## Summary

The Sanity Studio deployment was failing because the Studio did not have its local dependencies installed, and its `package.json` requested React 19 packages that were incompatible with the pinned Sanity Studio version.

The fix was to align the Studio React packages with Sanity `3.30.0`, reinstall dependencies inside `studio/`, verify local builds, and redeploy the hosted Studio to Vercel.

---

## Symptoms

- `cd studio && npm run build` failed with:

```text
Error: CLI config cannot be loaded
```

- Directly loading `studio/sanity.cli.js` failed because the local `sanity` package was missing:

```text
Cannot find package 'sanity' imported from ...\studio\sanity.cli.js
```

- `npm ls sanity` inside `studio/` returned an empty dependency tree.
- `studio/node_modules/sanity` did not exist.
- `studio/node_modules/.bin/sanity.cmd` did not exist.
- The `sanity` command being used was the global CLI from the user npm directory, not a project-local Studio CLI.

---

## Root Causes

1. **Missing Studio-local dependencies**

   The Studio directory had a `package-lock.json`, but dependencies were not installed in `studio/node_modules`. The global Sanity CLI could start, but it could not resolve the project-local `sanity/cli` import used by `studio/sanity.cli.js`.

2. **React version mismatch**

   `studio/package.json` requested React 19:

```json
"react": "^19.2.2",
"react-dom": "^19.2.2",
"react-is": "^19.2.7"
```

   But the pinned Sanity packages were:

```json
"sanity": "3.30.0",
"@sanity/vision": "3.30.0"
```

   `@sanity/vision@3.30.0` requires React 18, so `npm install` failed with peer dependency resolution errors.

---

## Fixes Made

Updated `studio/package.json` to use React 18-compatible packages:

```json
"react": "^18.3.1",
"react-dom": "^18.3.1",
"react-is": "^18.3.1"
```

Then ran:

```bash
cd studio
npm install
```

This restored:

```text
studio/node_modules/sanity
studio/node_modules/.bin/sanity.cmd
```

The install also updated `studio/package-lock.json`.

---

## Verification

Confirmed local Studio dependency versions:

```text
@sanity/vision@3.30.0
react@18.3.1
react-dom@18.3.1
react-is@18.3.1
sanity@3.30.0
```

Confirmed Studio build passes:

```bash
cd studio
npm run build
```

Confirmed root site build still passes:

```bash
npm run build
```

Confirmed Studio deploy completed:

```bash
cd studio
npm run deploy
```

Deployment result:

```text
Aliased https://voidance-studio.vercel.app
```

Confirmed hosted Studio URL returns HTTP `200`.

Confirmed the built Studio bundle includes the new schemas:

- `Merch Product`
- `Origin Page`
- `Band Member`
- `Discography Release`

---

## Sanity Dataset State

Live Sanity dataset was reachable after the fix.

Existing document counts:

```text
galleryItem: 10
track: 3
tourDate: 5
```

New document counts:

```text
merchProduct: 0
originPage: 0
bandMember: 0
discographyRelease: 0
```

This was expected before content migration because content seeding was intentionally out of scope for the deployment recovery.

---

## Content Migration

After confirming the new Studio menus existed but were empty, the hardcoded fallback content was migrated into Sanity production using:

```bash
cd studio
npx sanity exec scripts/seed-fallback-content.mjs --with-user-token
```

The migration script creates or replaces stable document IDs, so rerunning it updates the same seed records instead of creating duplicates.

Migrated document counts:

```text
merchProduct: 11
originPage: 1
bandMember: 6
discographyRelease: 1
```

Spot checks after migration:

```text
First merch product: VOIDANCE TEE / apparel / PHP 650 / stock 12
Origin title: ORIGIN
First band member: Mort Brian Apostol / Vocals
Featured release: DEMO EP / 2026 / 3 tracks
```

The live React site should now receive Sanity content for these sections instead of using fallback data, while still retaining fallback behavior if Sanity becomes unavailable.

---

## Production Domain CORS Fix

After moving production traffic to the custom domain, Sanity content appeared missing and Merch Settings did not affect the live site. The Sanity dataset still contained the expected documents, including:

```text
merchSettings-main mode: coming-soon
merchProduct: 11
bandMember: 6
originPage: 1
discographyRelease: 1
```

Root cause: the Sanity CORS allowlist did not include the new production domains. It only included local development URLs, the hosted Studio URL, and the old Vercel app URL.

Fixed by adding both production domains without credentials:

```bash
cd studio
npx sanity cors add https://www.voidanze.com --no-credentials
npx sanity cors add https://voidanze.com --no-credentials
```

Verified with:

```bash
cd studio
npx sanity cors list
```

The allowlist now includes:

```text
https://voidanze.com
https://www.voidanze.com
https://voidance.vercel.app
https://voidance-studio.vercel.app
http://localhost:3333
http://localhost:5173
http://localhost:5174
```

Also verified that Sanity now returns browser CORS headers for both custom domains:

```text
Access-Control-Allow-Origin: https://www.voidanze.com
Access-Control-Allow-Origin: https://voidanze.com
```

No code deployment was required for this fix. A browser hard refresh may be needed if the old failed/fallback state is cached in the open tab.

---

## Remaining Follow-Up

- Open `https://voidance-studio.vercel.app`.
- Confirm the migrated records are visible in the Studio sidebar:
  - Merch Product
  - Origin Page
  - Band Member
  - Discography Release
- Edit/publish future changes directly in Studio.
- Re-query or refresh the live site to confirm CMS content displays as expected.

---

## Notes

- `README.md` is outdated and was not used as a source of truth.
- `npm install` reported audit warnings. No `npm audit fix --force` was run because it can introduce breaking dependency upgrades.
- Some Sanity build output showed:

```text
motion() is deprecated. Use motion.create() instead.
```

This warning comes from dependencies and did not block the Studio build or deploy.
