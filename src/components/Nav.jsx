import { useState, useEffect } from 'react'

const LINKS = [
  { href: '#about',        label: 'Origin'      },
  { href: '#members',      label: 'Members'     },
  { href: '#discography',  label: 'Discography' },
  { href: '#tour',         label: 'Tour'        },
  { href: '#media',        label: 'Media'       },
  { href: '#contact',      label: 'Contact'     },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 600) setOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleLink = () => setOpen(false)

  return (
    <nav>
      <a href="#hero" className="nav-logo">VOIDANCE</a>

      {/* Desktop links */}
      <ul className="nav-links">
        {LINKS.map(l => (
          <li key={l.href}><a href={l.href}>{l.label}</a></li>
        ))}
      </ul>

      {/* Mobile hamburger */}
      <button
        className={`nav-hamburger${open ? ' nav-hamburger--open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle menu"
      >
        <span /><span /><span />
      </button>

      {/* Mobile drawer */}
      <div className={`nav-mobile-drawer${open ? ' nav-mobile-drawer--open' : ''}`}>
        {LINKS.map(l => (
          <a key={l.href} href={l.href} onClick={handleLink}>{l.label}</a>
        ))}
      </div>
    </nav>
  )
}
