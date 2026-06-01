import { useState, useEffect } from 'react'
import { client, QUERIES } from '../lib/sanity'

/**
 * Fetches a Sanity query and returns { data, loading, error }.
 * Falls back to `fallback` if Sanity returns an empty array.
 */
export function useSanityQuery(query, fallback = []) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    client.fetch(query)
      .then(result => {
        if (cancelled) return
        setData(result?.length ? result : fallback)
        setLoading(false)
      })
      .catch(err => {
        if (cancelled) return
        console.warn('[Sanity] fetch error — using fallback:', err.message)
        setData(fallback)
        setLoading(false)
        setError(err)
      })
    return () => { cancelled = true }
  }, [query]) // eslint-disable-line react-hooks/exhaustive-deps

  return { data: data ?? fallback, loading, error }
}

export { QUERIES }
