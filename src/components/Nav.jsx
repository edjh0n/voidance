import { useState, useEffect } from 'react'

const LINKS = [
  { page: 'hero', label: 'Home' },
  { page: 'gallery', label: 'Gallery' },
  { page: 'about', label: 'Origin' },
  { page: 'members', label: 'Members' },
  { page: 'discography', label: 'Discography' },
  { page: 'tour', label: 'Tour' },
  { page: 'merch', label: 'Merch' },
  { page: 'contact', label: 'Contact' },
]

export default function Nav({ activePage, onNavigate }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 600) setOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleNavigate = page => {
    onNavigate(page)
    setOpen(false)
  }

  return (
    <>
      <nav className={scrolled ? 'nav--scrolled' : ''}>
        <button type="button" className="nav-logo" onClick={() => handleNavigate('hero')} aria-label="Go to Home">
          <img src="/brand/voidance-logo.svg" alt="VOIDANCE" className="nav-logo-img" />
        </button>

        <ul className="nav-links">
          {LINKS.map(link => (
            <li key={link.page}>
              <button
                type="button"
                className={activePage === link.page ? 'active' : ''}
                onClick={() => handleNavigate(link.page)}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <button
          className={`nav-hamburger${open ? ' nav-hamburger--open' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
          type="button"
        >
          <span /><span /><span />
        </button>
      </nav>

      <div className={`nav-mobile-drawer${open ? ' nav-mobile-drawer--open' : ''}`}>
        {LINKS.map(link => (
          <button
            type="button"
            key={link.page}
            className={activePage === link.page ? 'active' : ''}
            onClick={() => handleNavigate(link.page)}
          >
            {link.label}
          </button>
        ))}
      </div>
    </>
  )
}
