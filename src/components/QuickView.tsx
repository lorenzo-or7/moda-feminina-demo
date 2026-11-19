import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { AlertCircle, Check, Minus, Plus, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { availabilityLabel, categoryLabel, maxQuantity } from '../data/catalog-meta'
import { collectionName } from '../data/editorial'
import { productById } from '../data/products'
import type { Product, Size } from '../data/types'
import { useDialog } from '../hooks/useDialog'
import { formatPrice } from '../lib/format'
import { buildProductMessage } from '../lib/whatsapp'
import { useShop } from '../store/shop'
import { useUi } from '../store/ui'
import { Img } from './Img'
import { EASE } from './motion'
import { FavoriteButton } from './ProductCard'

export function QuickView() {
  const { quickViewId, closeQuickView } = useUi()
  const product = quickViewId ? productById(quickViewId) : undefined
  return <AnimatePresence>{product && <QuickViewDialog key={product.id} product={product} onClose={closeQuickView} />}</AnimatePresence>
}

function QuickViewDialog({ product, onClose }: { product: Product; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const reduce = useReducedMotion()
  const { addToCart, cart } = useShop()
  const { toast, openPanel, sendInquiry } = useUi()

  const singleSize = product.sizes.length === 1 ? product.sizes[0] : null
  const [imageIndex, setImageIndex] = useState(0)
  const [colorId, setColorId] = useState(product.colors[0].id)
  const [size, setSize] = useState<Size | null>(singleSize)
  const [qty, setQty] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [added, setAdded] = useState(false)

  useDialog(true, ref, onClose, closeRef)

  const max = maxQuantity[product.availability]
  const color = product.colors.find((c) => c.id === colorId) ?? product.colors[0]
  const inCart = cart.filter((i) => i.productId === product.id).reduce((s, i) => s + i.quantity, 0)

  useEffect(() => {
    if (!added) return
    const t = window.setTimeout(() => setAdded(false), 2400)
    return () => window.clearTimeout(t)
  }, [added])

  const requireSize = () => {
    if (!size) {
      setError('Escolha um tamanho para continuar.')
      document.getElementById(`${titleId}-sizes`)?.querySelector<HTMLButtonElement>('button:not([disabled])')?.focus()
      return false
    }
    return true
  }

  const onAdd = () => {
    if (!requireSize() || !size) return
    const { limited } = addToCart({ productId: product.id, colorId, size, quantity: qty })
    setError(null)
    setAdded(true)
    if (limited) {
      toast(`Limite de ${max} unidades por peça nesta demonstração. Ajustamos a quantidade.`, 'info')
    } else {
      toast(`Adicionado à seleção: ${product.name} (${color.name}, ${size}).`)
    }
  }

  const onWhatsapp = () => {
    if (!requireSize() || !size) return
    setError(null)
    sendInquiry({
      title: 'Consulta sobre a peça',
      message: buildProductMessage({ name: product.name, color: color.name, size, unitPrice: product.price, quantity: qty }),
    })
  }

  const images = product.images
  const current = images[imageIndex]

  return (
    <div className="layer layer--center">
      <motion.div
        className="layer__scrim"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        aria-hidden="true"
      />
      <motion.div
        ref={ref}
        className="qv"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, clipPath: 'inset(8% 6% 8% 6% round 6px)' }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0% round 6px)' }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 30, transition: { duration: 0.3 } }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <button ref={closeRef} type="button" className="icon-btn qv__close" onClick={onClose} aria-label="Fechar detalhes">
          <X size={20} strokeWidth={1.6} />
        </button>

        <div className="qv__gallery">
          <div className="qv__stage photo">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={current.id}
                className="qv__stage-img"
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <Img id={current.id} alt={current.alt} ratio={4 / 3} position={current.position} sizes="(min-width: 900px) 40vw, 100vw" widths={[480, 720, 960, 1200]} priority />
              </motion.div>
            </AnimatePresence>
            {color.id !== product.colors[0].id && (
              <p className="qv__color-note">Fotografada na cor {product.colors[0].name}</p>
            )}
          </div>
          {images.length > 1 && (
            <div className="qv__thumbs" role="group" aria-label="Fotografias da peça">
              {images.map((im, i) => (
                <button
                  key={im.id}
                  type="button"
                  className="qv__thumb photo"
                  aria-label={`Fotografia ${i + 1} de ${images.length}`}
                  aria-current={i === imageIndex ? 'true' : undefined}
                  onClick={() => setImageIndex(i)}
                >
                  <Img id={im.id} alt="" ratio={4 / 3} position={im.position} sizes="96px" widths={[120, 200]} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="qv__body">
          <p className="caption">
            {categoryLabel(product.category)}, coleção {collectionName(product.collection)}
          </p>
          <h2 id={titleId} className="qv__title">
            {product.name}
          </h2>
          <div className="qv__price-row">
            <p className="qv__price">{formatPrice(product.price)}</p>
            <p className={`avail avail--${product.availability}`}>
              <span className="avail__dot" aria-hidden="true" />
              {availabilityLabel[product.availability]}
            </p>
          </div>
          <p className="qv__desc">{product.description}</p>
          <ul className="qv__details">
            {product.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>

          <fieldset className="qv__group">
            <legend className="qv__legend">
              Cor <span className="qv__legend-value">{color.name}</span>
            </legend>
            <div className="qv__colors">
              {product.colors.map((c) => (
                <label key={c.id} className="color-radio" title={c.name}>
                  <input type="radio" name={`${titleId}-color`} value={c.id} checked={c.id === colorId} onChange={() => setColorId(c.id)} />
                  <span className="swatch swatch--lg" style={{ background: c.hex }} aria-hidden="true" />
                  <span className="sr-only">{c.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="qv__group" aria-describedby={error ? `${titleId}-err` : undefined}>
            <legend className="qv__legend">
              Tamanho {size && <span className="qv__legend-value">{size}</span>}
            </legend>
            <div className="qv__sizes" id={`${titleId}-sizes`}>
              {product.sizes.map((s) => {
                const out = product.soldOut?.includes(s)
                return (
                  <button
                    key={s}
                    type="button"
                    className="size-btn size-btn--lg"
                    aria-pressed={size === s}
                    disabled={out}
                    aria-label={out ? `${s}, esgotado` : s}
                    onClick={() => {
                      setSize(s)
                      setError(null)
                    }}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
            {product.soldOut?.length ? <p className="caption">Tamanhos riscados estão esgotados nesta simulação.</p> : null}
          </fieldset>

          <div className="qv__group">
            <p className="qv__legend" id={`${titleId}-qty`}>
              Quantidade
            </p>
            <div className="qv__qty-row">
              <div className="stepper" role="group" aria-labelledby={`${titleId}-qty`}>
                <button type="button" className="stepper__btn" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Diminuir quantidade">
                  <Minus size={16} />
                </button>
                <output className="stepper__value" aria-live="polite">
                  {qty}
                </output>
                <button type="button" className="stepper__btn" onClick={() => setQty((q) => Math.min(max, q + 1))} disabled={qty >= max} aria-label="Aumentar quantidade">
                  <Plus size={16} />
                </button>
              </div>
              <p className="caption">Até {max} por peça{inCart ? `, ${inCart} já na seleção` : ''}</p>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                id={`${titleId}-err`}
                className="form-msg form-msg--error"
                role="alert"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <AlertCircle size={16} aria-hidden="true" />
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="qv__actions">
            <button type="button" className="btn qv__add" onClick={onAdd} data-added={added || undefined}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={added ? 'ok' : 'add'}
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="qv__add-label"
                >
                  {added ? (
                    <>
                      <Check size={16} aria-hidden="true" /> Na sua seleção
                    </>
                  ) : (
                    'Adicionar à seleção'
                  )}
                </motion.span>
              </AnimatePresence>
            </button>
            <FavoriteButton product={product} className="qv__fav" />
          </div>
          <button type="button" className="btn btn--ghost btn--block" onClick={onWhatsapp}>
            Consultar pelo WhatsApp
          </button>
          {added && (
            <button
              type="button"
              className="text-link qv__see-bag"
              onClick={() => {
                onClose()
                openPanel('cart')
              }}
            >
              Ver sacola de seleção
            </button>
          )}
          <p className="badge-demo qv__note">Valores e disponibilidade demonstrativos. Nenhum pagamento é realizado neste site.</p>
        </div>
      </motion.div>
    </div>
  )
}
