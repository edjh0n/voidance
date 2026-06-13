import { useEffect, useState } from 'react'
import Nav                from './components/Nav'
import Hero               from './components/Hero'
import About              from './components/About'
import Members            from './components/Members'
import Discography        from './components/Discography'
import Tour               from './components/Tour'
import Gallery            from './components/Gallery'
import Merch              from './components/Merch'
// import Media        from './components/Media'
import Contact            from './components/Contact'
import OrderConfirmed     from './components/OrderConfirmed'
import Footer             from './components/Footer'
import MusicPlayer        from './components/MusicPlayer'
import Starfield          from './components/Starfield'
import { Analytics }      from "@vercel/analytics/react"
import { SpeedInsights }  from "@vercel/speed-insights/react"

const PAGE_IDS = ['hero', 'gallery', 'about', 'members', 'discography', 'tour', 'merch', 'contact', 'order-confirmed']

function getPageFromHash() {
  const page = window.location.hash.replace('#', '') || 'hero'
  return PAGE_IDS.includes(page) ? page : 'hero'
}

export default function App() {
  const [activePage, setActivePage] = useState(getPageFromHash)
  const [checkoutSummary, setCheckoutSummary] = useState('')
  const [orderConfirmation, setOrderConfirmation] = useState(null)

  useEffect(() => {
    const onHashChange = () => setActivePage(getPageFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [activePage])

  const navigate = page => {
    if (!PAGE_IDS.includes(page)) return
    if (window.location.hash === `#${page}`) {
      setActivePage(page)
      window.scrollTo({ top: 0, behavior: 'auto' })
      return
    }
    window.location.hash = page
  }

  const startCheckout = summary => {
    setCheckoutSummary(summary)
    navigate('contact')
  }

  const completeOrder = confirmation => {
    setOrderConfirmation(confirmation)
    setCheckoutSummary('')
    navigate('order-confirmed')
  }

  const pages = {
    hero: <Hero onNavigate={navigate} />,
    gallery: <Gallery />,
    about: <About />,
    members: <Members />,
    discography: <Discography />,
    tour: <Tour />,
    merch: <Merch onCheckout={startCheckout} />,
    contact: <Contact checkoutSummary={checkoutSummary} onOrderSuccess={completeOrder} />,
    'order-confirmed': <OrderConfirmed confirmation={orderConfirmation} onNavigate={navigate} />,
  }

  return (
    <>
      <Starfield />
      <Nav activePage={activePage} onNavigate={navigate} />
      <main className="page-shell">
        <div className="page-view" key={activePage}>
          {pages[activePage]}
        </div>
      </main>
      <Footer />
      <MusicPlayer />
      <Analytics />
      <SpeedInsights/>
    </>
  )
}
