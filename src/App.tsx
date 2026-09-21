import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Profile from './components/Profile'
import Products from './components/Products'
import Film from './components/Film'
import Gallery from './components/Gallery'
import Technology from './components/Technology'
import Contact from './components/Contact'
import Footer from './components/Footer'
import useAssetProtection from './hooks/useAssetProtection'
import { useLenis } from './hooks/useLenis'
import { ScrollContext } from './context/ScrollContext'

export default function App() {
  useAssetProtection()
  useLenis()

  return (
    <ScrollContext.Provider value={{ current: null }}>
      <div className="min-h-screen w-full overflow-x-clip bg-white">
        <Navbar />
        <main>
          <Hero />
          <Profile />
          <Products />
          <Film />
          <Gallery />
          <Technology />
          <Contact />
        </main>
        <Footer />
      </div>
    </ScrollContext.Provider>
  )
}
