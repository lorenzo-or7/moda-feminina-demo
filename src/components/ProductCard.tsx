import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Heart } from 'lucide-react'
import { forwardRef } from 'react'
import { availabilityLabel, categoryLabel } from '../data/catalog-meta'
import type { Product } from '../data/types'
import { formatPrice } from '../lib/format'
import { useShop } from '../store/shop'
import { useUi } from '../store/ui'
import { Img } from './Img'
import { EASE } from './motion'

export function FavoriteButton({ product, className = '' }: { product: Product; className?: string }) {
  const { isFavorite, toggleFavorite } = useShop()
  const { toast } = useUi()
  const reduce = useReducedMotion()
  const active = isFavorite(product.id)
  return (
    <button
      type="button"
      className={`fav-btn ${className}`}
      aria-pressed={active}
      aria-label={active ? `Remover ${product.name} dos favoritos` : `Adicionar ${product.name} aos favoritos`}
      onClick={(e) => {
        e.stopPropagation()
        const added = toggleFavorite(product.id)
        toast(added ? `${product.name} foi para os favoritos.` : `${product.name} saiu dos favoritos.`, added ? 'success' : 'info')
      }}
    >
      <motion.span
        key={String(active)}
        initial={reduce || !active ? false : { scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 600, damping: 14 }}
        style={{ display: 'grid' }}
      >
        <Heart size={18} strokeWidth={1.6} fill={active ? 'currentColor' : 'none'} />
      </motion.span>
      <AnimatePresence>
        {active && !reduce && (
          <motion.span
            className="fav-btn__ring"
            initial={{ scale: 0.6, opacity: 0.7 }}
            animate={{ scale: 1.8, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </button>
  )
}

interface Props {
  product: Product
  index: number
}

export const ProductCard = forwardRef<HTMLLIElement, Props>(function ProductCard({ product, index }, ref) {
  const { openQuickView } = useUi()
  const reduce = useReducedMotion()
  const [first, second] = product.images
  const colorNames = product.colors.map((c) => c.name).join(', ')

  return (
    <motion.li
      ref={ref}
      layout={!reduce}
      className="pcard"
      initial={reduce ? false : { opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
      transition={{ duration: 0.75, ease: EASE, delay: Math.min(index, 8) * 0.06, layout: { duration: 0.6, ease: EASE } }}
    >
      <article className="pcard__inner" aria-labelledby={`p-${product.id}`}>
        <div className="pcard__media">
          <button
            type="button"
            className="pcard__open"
            onClick={() => openQuickView(product.id)}
            aria-label={`Ver detalhes de ${product.name}`}
            data-has-second={second ? '' : undefined}
          >
            <span className="pcard__img pcard__img--a">
              <Img id={first.id} alt={first.alt} ratio={4 / 3} position={first.position} sizes="(min-width: 1200px) 24vw, (min-width: 700px) 33vw, 50vw" widths={[320, 480, 640, 800]} />
            </span>
            {second && (
              <span className="pcard__img pcard__img--b" aria-hidden="true">
                <Img id={second.id} alt="" ratio={4 / 3} position={second.position} sizes="(min-width: 1200px) 24vw, (min-width: 700px) 33vw, 50vw" widths={[320, 480, 640, 800]} />
              </span>
            )}
            <span className="pcard__quick" aria-hidden="true">
              Ver detalhes
            </span>
          </button>
          <div className="pcard__tags" aria-hidden="true">
            {product.isNew && <span className="tag">Novo</span>}
            {product.availability !== 'disponivel' && <span className="tag tag--muted">{availabilityLabel[product.availability]}</span>}
          </div>
          <FavoriteButton product={product} className="pcard__fav" />
        </div>
        <div className="pcard__info">
          <div className="pcard__row">
            <h3 id={`p-${product.id}`} className="pcard__name">
              {product.name}
            </h3>
            <p className="pcard__price">{formatPrice(product.price)}</p>
          </div>
          <div className="pcard__row pcard__row--meta">
            <p className="pcard__cat">
              {categoryLabel(product.category)}
              {product.availability !== 'disponivel' && <span className="sr-only">, {availabilityLabel[product.availability]}</span>}
            </p>
            <ul className="pcard__colors" aria-label={`Cores: ${colorNames}`}>
              {product.colors.map((c) => (
                <li key={c.id} className="swatch swatch--sm" style={{ background: c.hex }} title={c.name} />
              ))}
            </ul>
          </div>
        </div>
      </article>
    </motion.li>
  )
})
