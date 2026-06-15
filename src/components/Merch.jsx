import { useMemo, useState } from 'react'
import { MERCH_FILTERS, MERCH_PRODUCTS } from '../data/merchData'
import { useSanityQuery, QUERIES } from '../hooks/useSanity'
import { urlFor } from '../lib/sanity'
import { trackEvent } from '../utils/analytics'

const MERCH_MODE_OVERRIDE = import.meta.env.VITE_MERCH_MODE_OVERRIDE
const VALID_MERCH_MODES = ['live', 'coming-soon']
const merchModeOverride = VALID_MERCH_MODES.includes(MERCH_MODE_OVERRIDE)
  ? MERCH_MODE_OVERRIDE
  : null

function MerchArt({ type }) {
  return (
    <svg viewBox="0 0 80 80" className={`merch-art merch-art--${type}`} aria-hidden="true">
      <rect width="80" height="80" fill="#0a1320" />
      {(type === 'tee' || type === 'longsleeve') && (
        <>
          <path d="M16 26 26 18 36 22h8l10-4 10 8-6 12-6-3v25H28V35l-6 3-6-12Z" fill="#0d1f30" stroke="#00d4ff" strokeWidth="0.8" />
          <circle cx="40" cy="40" r="9" fill="none" stroke={type === 'longsleeve' ? '#333' : '#00d4ff'} strokeWidth="1.2" />
          {type === 'longsleeve' && <text x="40" y="54" textAnchor="middle" fontSize="6" fill="#333" fontFamily="monospace">SOLD OUT</text>}
        </>
      )}
      {type === 'hoodie' && (
        <>
          <path d="M13 29 21 18l11 4 8-2 8 2 11-4 8 11-4 31H17L13 29Z" fill="#0d1f30" stroke="#007a99" strokeWidth="0.8" />
          <path d="M32 22q3 8 8 6 5 2 8-6" fill="none" stroke="#00d4ff" strokeWidth="0.8" />
          <circle cx="40" cy="43" r="7" fill="none" stroke="#c0182a" strokeWidth="1.2" />
        </>
      )}
      {type === 'cap' && (
        <>
          <path d="M14 45q0-17 26-19 26 2 26 19l3 4H11l3-4Z" fill="#0d1f30" stroke="#00d4ff" strokeWidth="0.8" />
          <path d="M14 50h52l-3 5H17l-3-5Z" fill="#060c14" stroke="#007a99" strokeWidth="0.6" />
          <circle cx="40" cy="37" r="5" fill="none" stroke="#c0182a" strokeWidth="1" />
        </>
      )}
      {type === 'pins' && (
        <>
          <circle cx="28" cy="35" r="10" fill="#0d1f30" stroke="#00d4ff" strokeWidth="0.9" />
          <polygon points="52,25 58,35 52,45 46,45 40,35 46,25" fill="#0d1f30" stroke="#c0182a" strokeWidth="0.9" />
          <circle cx="60" cy="52" r="8" fill="#0d1f30" stroke="#007a99" strokeWidth="0.8" />
        </>
      )}
      {type === 'wristband' && (
        <>
          <ellipse cx="40" cy="34" rx="22" ry="8" fill="none" stroke="#00d4ff" strokeWidth="3" />
          <ellipse cx="40" cy="52" rx="22" ry="8" fill="none" stroke="#c0182a" strokeWidth="3" />
        </>
      )}
      {(type === 'stickers' || type === 'eclipse' || type === 'crest') && (
        <>
          <circle cx="27" cy="30" r="13" fill="#0d1f30" stroke="#00d4ff" strokeWidth="1" />
          <circle cx="32" cy="27" r="10" fill="#020408" />
          <path d="M50 20 60 26v14l-10 6-10-6V26l10-6Z" fill="#0d1f30" stroke="#c0182a" strokeWidth="0.9" />
          <circle cx="52" cy="54" r="9" fill="#0d1f30" stroke="#007a99" strokeWidth="0.8" />
        </>
      )}
      {type === 'cd' && (
        <>
          <circle cx="40" cy="40" r="23" fill="#0d1f30" stroke="#00d4ff" strokeWidth="0.9" />
          <circle cx="40" cy="40" r="14" fill="#060c14" stroke="#007a99" strokeWidth="0.6" />
          <circle cx="40" cy="40" r="4" fill="#0a1320" stroke="#00d4ff" strokeWidth="0.7" />
          <path d="M40 17a23 23 0 0 1 23 23" stroke="#c0182a" strokeWidth="1.5" fill="none" />
        </>
      )}
      {type === 'poster' && (
        <>
          <rect x="18" y="10" width="44" height="60" rx="1" fill="#0d1f30" stroke="#007a99" strokeWidth="0.7" />
          <circle cx="40" cy="37" r="14" fill="#020408" />
          <circle cx="46" cy="34" r="12" fill="none" stroke="#00d4ff" strokeWidth="0.6" strokeDasharray="1.5 2" />
        </>
      )}
    </svg>
  )
}

function merchImageUrl(product, width) {
  if (!product.image) return product.imageUrl || ''
  try {
    return urlFor(product.image).width(width).format('webp').quality(82).url()
  } catch {
    return product.imageUrl || ''
  }
}

function getBadge(product) {
  if (product.stock === 0) return 'sold-out'
  if (product.stock <= 5 && product.badge === 'limited') return 'limited'
  return product.badge
}

function MerchCard({ product, onAdd }) {
  const badge = getBadge(product)
  const soldOut = product.stock === 0
  const hasSizes = product.sizes?.length > 0
  const [selectedSize, setSelectedSize] = useState(hasSizes ? '' : null)
  const imageSrc = merchImageUrl(product, 640)
  const imageSrcSet = product.image
    ? [320, 480, 640]
      .map(width => `${merchImageUrl(product, width)} ${width}w`)
      .join(', ')
    : ''

  return (
    <article className={`merch-card${soldOut ? ' merch-card--sold-out' : ''}`}>
      <div className="merch-img">
        {imageSrc ? (
          <img
            src={imageSrc}
            srcSet={imageSrcSet || undefined}
            sizes="(max-width: 700px) 100vw, (max-width: 1000px) 33vw, 260px"
            alt={product.name}
            loading="lazy"
          />
        ) : (
          <MerchArt type={product.art || 'eclipse'} />
        )}
        {badge && <span className={`merch-badge merch-badge--${badge}`}>{badge === 'sold-out' ? 'Sold Out' : badge}</span>}
      </div>
      <div className="merch-info">
        <h3>{product.name}</h3>
        <p>{product.sub}</p>
        {product.description && <p className="merch-desc">{product.description}</p>}
        {hasSizes && (
          <div className="merch-sizes" aria-label={`Available sizes for ${product.name}`}>
            {product.sizes.map(size => (
              <button
                type="button"
                key={size}
                className={selectedSize === size ? 'active' : ''}
                onClick={() => setSelectedSize(size)}
                disabled={soldOut}
              >
                {size}
              </button>
            ))}
          </div>
        )}
        <div className="merch-row">
          <span>{product.price}</span>
          <button type="button" onClick={() => onAdd(product, selectedSize)} disabled={soldOut || (hasSizes && !selectedSize)}>
            {soldOut ? 'Sold Out' : hasSizes && !selectedSize ? 'Pick Size' : '+ Add'}
          </button>
        </div>
      </div>
    </article>
  )
}

export default function Merch({ onCheckout }) {
  const [filter, setFilter] = useState('all')
  const [cart, setCart] = useState([])
  const { data: sanityProducts, loading } = useSanityQuery(QUERIES.merchProducts, [])
  const { data: merchSettings, loading: settingsLoading } = useSanityQuery(QUERIES.merchSettings, {
    mode: 'live',
    comingSoonTitle: 'Merch Coming Soon',
    comingSoonMessage: 'Official VOIDANCE merch is being prepared. Check back soon for drops, sizes, and ordering details.',
  }, { fresh: true })

  const catalog = !loading && sanityProducts.length > 0 ? sanityProducts : MERCH_PRODUCTS
  const effectiveMerchSettings = {
    ...merchSettings,
    mode: merchModeOverride || merchSettings?.mode,
  }
  const waitingForMerchSettings = settingsLoading && !merchModeOverride
  const comingSoon = effectiveMerchSettings?.mode === 'coming-soon'

  const products = useMemo(
    () => filter === 'all' ? catalog : catalog.filter(p => p.category === filter),
    [filter, catalog]
  )

  const total = cart.reduce((sum, item) => sum + item.qty, 0)
  const formatCartItem = item => `${item.name}${item.size ? ` (${item.size})` : ''}${item.qty > 1 ? ` x${item.qty}` : ''}`
  const cartText = cart.length
    ? cart.map(formatCartItem).join(' / ')
    : '- cart empty -'

  const addToCart = (product, size = null) => {
    const cartKey = `${product._id || product.id}-${size || 'default'}`
    const stock = Number.isFinite(product.stock) ? product.stock : 99
    trackEvent('merch_add_to_cart', {
      productId: product._id || product.id,
      productName: product.name,
      category: product.category,
      size: size || 'default',
    })
    setCart(items => {
      const existing = items.find(item => item.key === cartKey)
      if (existing) {
        return items.map(item => {
          if (item.key !== cartKey) return item
          const maxQty = item.stock ?? stock
          return item.qty >= maxQty ? item : { ...item, qty: item.qty + 1 }
        })
      }
      return [...items, { key: cartKey, id: product._id || product.id, name: product.name, size, qty: 1, stock }]
    })
  }

  const incrementCartItem = key => {
    const item = cart.find(entry => entry.key === key)
    if (item) {
      trackEvent('merch_cart_increment', {
        productId: item.id,
        productName: item.name,
        size: item.size || 'default',
      })
    }
    setCart(items => items.map(item => {
      if (item.key !== key) return item
      const maxQty = item.stock ?? 99
      return item.qty >= maxQty ? item : { ...item, qty: item.qty + 1 }
    }))
  }

  const decrementCartItem = key => {
    const item = cart.find(entry => entry.key === key)
    if (item) {
      trackEvent('merch_cart_decrement', {
        productId: item.id,
        productName: item.name,
        size: item.size || 'default',
      })
    }
    setCart(items => items.flatMap(item => {
      if (item.key !== key) return [item]
      return item.qty > 1 ? [{ ...item, qty: item.qty - 1 }] : []
    }))
  }

  const removeCartItem = key => {
    const item = cart.find(entry => entry.key === key)
    if (item) {
      trackEvent('merch_cart_remove', {
        productId: item.id,
        productName: item.name,
        size: item.size || 'default',
      })
    }
    setCart(items => items.filter(item => item.key !== key))
  }

  const checkout = () => {
    if (!cart.length) return
    const summary = cart.map(formatCartItem).join(' / ')
    trackEvent('merch_checkout_started', {
      itemCount: total,
      uniqueItems: cart.length,
    })
    onCheckout(summary)
  }

  return (
    <section id="merch">
      <div className="container">
        <div className="section-header">
          <span className="section-num">06 //</span>
          <h2 className="section-title">MERCH</h2>
          <div className="section-line" />
        </div>

        {waitingForMerchSettings ? (
          <div className="merch-loading" aria-live="polite">
            <span>// SYNC</span>
            <p>Loading merch status...</p>
          </div>
        ) : comingSoon ? (
          <div className="merch-coming-soon">
            <span>// DROP</span>
            <h3>{effectiveMerchSettings.comingSoonTitle || 'Merch Coming Soon'}</h3>
            <p>{effectiveMerchSettings.comingSoonMessage || 'Official VOIDANCE merch is being prepared. Check back soon for drops, sizes, and ordering details.'}</p>
          </div>
        ) : (
          <>
            <div className="merch-cart-bar">
              <div className="cart-content">
                <div className="cart-info">
                  {total > 0 && <strong>{total} item{total > 1 ? 's' : ''}</strong>}
                  <span>{total > 0 ? ` in cart / ${cartText}` : cartText}</span>
                </div>
                {cart.length > 0 && (
                  <div className="cart-items">
                    {cart.map(item => (
                      <div className="cart-item" key={item.key}>
                        <span>{formatCartItem(item)}</span>
                        <div className="cart-item-actions">
                          <button type="button" onClick={() => decrementCartItem(item.key)} aria-label={`Decrease quantity for ${item.name}`}>
                            -
                          </button>
                          <span className="cart-item-qty" aria-label={`Quantity ${item.qty}`}>{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => incrementCartItem(item.key)}
                            disabled={item.qty >= (item.stock ?? 99)}
                            aria-label={`Increase quantity for ${item.name}`}
                          >
                            +
                          </button>
                          <button type="button" onClick={() => removeCartItem(item.key)}>
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button type="button" className="cart-checkout-btn" hidden={total === 0} onClick={checkout}>
                Checkout
              </button>
            </div>

            <div className="merch-filter-row" aria-label="Merch filters">
              {MERCH_FILTERS.map(item => (
                <button
                  type="button"
                  key={item.key}
                  className={`merch-filter${filter === item.key ? ' merch-filter--active' : ''}`}
                  onClick={() => {
                    setFilter(item.key)
                    trackEvent('merch_filter_changed', { filter: item.key })
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="merch-grid">
              {products.map(product => (
                <MerchCard key={product._id || product.id} product={product} onAdd={addToCart} />
              ))}
            </div>

            <div className="merch-note">
              <span>// ORDER</span>
              <p><strong>How to order:</strong> Add items to your cart, then send the order details through our contact form or Facebook Messenger. We will confirm payment and shipping manually.</p>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
