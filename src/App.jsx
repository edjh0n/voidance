import Nav            from './components/Nav'
import Hero           from './components/Hero'
import About          from './components/About'
import Members        from './components/Members'
import Discography    from './components/Discography'
import Tour           from './components/Tour'
import Gallery        from './components/Gallery'
// import Media        from './components/Media'
import Contact        from './components/Contact'
import Footer         from './components/Footer'
import MusicPlayer    from './components/MusicPlayer'
import Starfield      from './components/Starfield'
import { Analytics }  from "@vercel/analytics/react"

export default function App() {
  return (
    <>
      <Starfield />
      <Nav />
      <main>
        <Hero />
        <Gallery />
        <About />
        <Members />
        <Discography />
        <Tour />
        {/* <Media /> */}
        <Contact />
      </main>
      <Footer />
      <MusicPlayer />
      <Analytics />
    </>
  )
}
