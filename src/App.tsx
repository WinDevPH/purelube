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
    const wasProduct = prevHash.current.startsWith('#product/')
    const isProduct = hash.startsWith('#product/')
    prevHash.current = hash
    if (isProduct || wasProduct) scrollToTop()
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
    if (!next.section) return
    const section = next.section
    const t = window.setTimeout(() => {
      if (section === 'home') scrollToTop()
      else scrollToSection(`#${section}`, true)
    }, 40)
    return () => window.clearTimeout(t)
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
