import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Profile from './components/Profile'
import Products from './components/Products'
import Film from './components/Film'
import Gallery from './components/Gallery'
import Technology from './components/Technology'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ProductDetail from './components/ProductDetail'
import useAssetProtection from './hooks/useAssetProtection'
import { scrollToSection, scrollToTop, useLenis } from './hooks/useLenis'
import { ScrollContext } from './context/ScrollContext'
import { PRODUCTS } from './data/content'

function parseHash(hash: string) {
  const raw = decodeURIComponent(hash.replace(/^#/, ''))
  const product = raw.match(/^product\/([^/?#]+)$/)
  if (product) return { kind: 'product' as const, id: product[1] }
  return { kind: 'home' as const, section: raw }
}

export default function App() {
  useAssetProtection()
  useLenis()
  const [hash, setHash] = useState(() => window.location.hash)
  const prevHash = useRef(hash)
  const route = parseHash(hash)

  useEffect(() => {
    const sync = () => setHash(window.location.hash)
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  useLayoutEffect(() => {
    const isProduct = hash.startsWith('#product/')
    prevHash.current = hash
    if (isProduct) scrollToTop()
  }, [hash])

  useEffect(() => {
    const next = parseHash(hash)
    if (next.kind === 'product') {
      const product = PRODUCTS.find((item) => item.id === next.id)
      document.title = product ? `${product.shortName} · PureLube` : 'Product · PureLube'
      scrollToTop()
      return
    }
    document.title = 'PureLube Lubricant GmbH'
    const section = (next.section || '').split(/[/?]/)[0]
    if (!section) return

    let cancelled = false
    let tries = 0
    let lastY = -1
    const settle = () => {
      if (cancelled) return
      if (section === 'home') {
        scrollToTop()
        return
      }
      const el = document.getElementById(section)
      if (!el) {
        if (tries < 50) {
          tries += 1
          requestAnimationFrame(settle)
        }
        return
      }
      const y = el.getBoundingClientRect().top + window.scrollY
      if (Math.abs(y - lastY) > 12 && tries < 50) {
        lastY = y
        tries += 1
        requestAnimationFrame(settle)
        return
      }
      scrollToSection(el, true)
    }
    const t = window.setTimeout(settle, 80)
    const retry = window.setTimeout(() => {
      const el = document.getElementById(section)
      if (!cancelled && el && section !== 'home') scrollToSection(el, true)
    }, 450)
    return () => {
      cancelled = true
      window.clearTimeout(t)
      window.clearTimeout(retry)
    }
  }, [hash])

  return (
    <ScrollContext.Provider value={{ current: null }}>
      <div className="min-h-screen w-full overflow-x-clip bg-white">
        <Navbar />
        <main>
          {route.kind === 'product' ? (
            <ProductDetail id={route.id} />
          ) : (
            <>
              <Hero />
              <Profile />
              <Products />
              <Film />
              <Gallery />
              <Technology />
              <Contact />
            </>
          )}
        </main>
        <Footer />
      </div>
    </ScrollContext.Provider>
  )
}
