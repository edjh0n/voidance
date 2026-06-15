import { track } from '@vercel/analytics'

export function trackEvent(name, properties = {}) {
  try {
    track(name, properties)
  } catch (err) {
    if (import.meta.env.DEV) {
      console.debug('[Analytics] skipped event:', name, err.message)
    }
  }
}
