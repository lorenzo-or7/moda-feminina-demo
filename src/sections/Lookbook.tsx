import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { Plus, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { Img } from '../components/Img'
import { EASE, MaskText, Parallax, RevealImage } from '../components/motion'
import { looks, type Hotspot, type Look } from '../data/editorial'
import { productById } from '../data/products'
import { formatPrice } from '../lib/format'
import { useCatalog } from '../store/catalog'
import { useUi } from '../store/ui'

export function Lookbook() {
  const [active, setActive] = useState(0)
  return (
    <section id="lookbook" className="section lookbook" aria-labelledby="lookbook-title">
      <div className="wrap lookbook__layout">
        <div className="lookbook__rail">
          <div className="lookbook__sticky">
            <p className="kicker">Lookbook da estação</p>
            <h2 id="lookbook-title" className="h-section lookbook__title">
              <MaskText lines={['An expression', 'of individuality.']} />
            </h2>
            <p className="lede">Quatro looks fotografados em luz natural. Toque nos pontos sobre as fotos para conhecer cada peça.</p>
            <ol className="lookbook__index" aria-label="Looks">
              {looks.map((l, i) => (
                <li key={l.id} aria-current={i === active ? 'step' : undefined}>
                  <a href={`#${l.id}`}>
                    <span className="lookbook__numeral">{l.numeral}</span>
                    <span>{l.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="lookbook__stream">
          {looks.map((l, i) => (
            <LookRow key={l.id} look={l} index={i} onActive={() => setActive(i)} />
          ))}
        </div>
      </div>
    </section>
  )
}

function LookRow({ look, index, onActive }: { look: Look; index: number; onActive: () => void }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' })
  const reduce = useReducedMotion()
  const variant = ['a', 'b', 'c', 'd'][index % 4]

  useEffect(() => {
    if (inView) onActive()
  }, [inView, onActive])

  return (
    <article id={look.id} ref={ref} className={`look look--${variant}`} aria-labelledby={`${look.id}-t`}>
      <div className="look__media">
        <RevealImage className="look__reveal" direction={index % 2 ? 'left' : 'up'}>
          <div className="look__photo photo">
            <Parallax amount={50}>
              <Img id={look.image.id} alt={look.image.alt} ratio={1.3} position={look.image.position} sizes="(min-width: 1000px) 50vw, 94vw" />
            </Parallax>
          </div>
        </RevealImage>
        {look.hotspots.map((h) => (
          <HotspotButton key={h.productId} spot={h} />
        ))}
      </div>
      <motion.div
        className="look__text"
        initial={reduce ? false : { opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -15% 0px' }}
        transition={{ duration: 1, ease: EASE, delay: 0.2 }}
      >
        <p className="look__numeral" aria-hidden="true">
          {look.numeral}
        </p>
        <h3 id={`${look.id}-t`} className="look__title">
          <span className="sr-only">Look {look.numeral}: </span>
          {look.title}
        </h3>
        <p className="look__body">{look.text}</p>
      </motion.div>
    </article>
  )
}

function HotspotButton({ spot }: { spot: Hotspot }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const popId = useId()
  const reduce = useReducedMotion()
  const { openQuickView } = useUi()
  const { showInCatalog } = useCatalog()
  const product = productById(spot.productId)

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        btnRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!product) return null
  const align = spot.x > 65 ? 'hotspot__pop--left' : spot.x >= 35 ? 'hotspot__pop--center' : ''

  return (
    <div ref={wrapRef} className="hotspot" style={{ left: `${spot.x}%`, top: `${spot.y}%` }} data-open={open || undefined}>
      <button
        ref={btnRef}
        type="button"
        className="hotspot__btn"
        aria-expanded={open}
        aria-controls={popId}
        aria-label={`${open ? 'Fechar' : 'Ver'} peça: ${spot.label}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="hotspot__ring" aria-hidden="true" />
        <motion.span className="hotspot__core" animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.3 }} aria-hidden="true">
          <Plus size={14} strokeWidth={2} />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={popId}
            role="group"
            aria-label={product.name}
            className={`hotspot__pop ${align}`}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, transition: { duration: 0.15 } }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <button type="button" className="hotspot__x" onClick={() => setOpen(false)} aria-label="Fechar">
              <X size={14} />
            </button>
            <p className="hotspot__name">{product.name}</p>
            <p className="caption">{formatPrice(product.price)}</p>
            <div className="hotspot__actions">
              <button
                type="button"
                className="btn hotspot__cta"
                onClick={() => {
                  setOpen(false)
                  openQuickView(product.id)
                }}
              >
                Ver detalhes
              </button>
              <button
                type="button"
                className="text-link"
                onClick={() => {
                  setOpen(false)
                  showInCatalog({ categories: [product.category] })
                }}
              >
                Ver no catálogo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
