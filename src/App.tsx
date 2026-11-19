import { MotionConfig } from 'motion/react'
import { Navbar } from './components/Navbar'
import { InquiryDialog, Toasts, useInitialHash } from './components/Overlays'
import { CartPanel, FavoritesPanel } from './components/Panels'
import { QuickView } from './components/QuickView'
import { Catalog } from './sections/Catalog'
import { Collections } from './sections/Collections'
import { Footer } from './sections/Footer'
import { Hero } from './sections/Hero'
import { Lookbook } from './sections/Lookbook'
import { Manifesto } from './sections/Manifesto'
import { NewCollection } from './sections/NewCollection'
import { Newsletter } from './sections/Newsletter'
import { Service } from './sections/Service'
import { CatalogProvider } from './store/catalog'
import { ShopProvider } from './store/shop'
import { UiProvider } from './store/ui'

function Page() {
  useInitialHash()
  return (
    <>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <Navbar />
      <main id="conteudo">
        <Hero />
        <Collections />
        <Catalog />
        <NewCollection />
        <Lookbook />
        <Manifesto />
        <Service />
        <Newsletter />
      </main>
      <Footer />
      <QuickView />
      <CartPanel />
      <FavoritesPanel />
      <InquiryDialog />
      <Toasts />
    </>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ShopProvider>
        <UiProvider>
          <CatalogProvider>
            <Page />
          </CatalogProvider>
        </UiProvider>
      </ShopProvider>
    </MotionConfig>
  )
}
