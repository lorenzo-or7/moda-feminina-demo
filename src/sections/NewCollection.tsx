import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Img } from '../components/Img'
import { Magnetic } from '../components/motion'
import { newCollection } from '../data/editorial'
import { products } from '../data/products'
import { formatPrice } from '../lib/format'
import { useCatalog } from '../store/catalog'
import { useUi } from '../store/ui'

/**
 * Transição diferenciada: a fotografia abre como uma cortina dividida ao centro
 * conforme a rolagem, enquanto o título desliza em sentido contrário.
 */
export function NewCollection() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { showInCatalog } = useCatalog()
  const { openQuickView } = useUi()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const clip = useTransform(scrollYProgress, [0, 1], reduce ? ['inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'] : ['inset(18% 38% 18% 38%)', 'inset(0% 0% 0% 0%)'])
  const imgScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.35, 1])
  const titleX = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['18%', '0%'])
  const detailY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['40%', '0%'])

  const picks = products.filter((p) => p.collection === 'new-season' && p.isNew).slice(0, 3)

  return (
    <section id="novidades" ref={ref} className="section newcol" aria-labelledby="newcol-title">
      <div className="wrap newcol__grid">
        <div className="newcol__media">
          <motion.div className="newcol__photo photo" style={{ clipPath: clip }}>
            <motion.div style={{ scale: imgScale, height: '100%' }}>
              <Img id={newCollection.image.id} alt={newCollection.image.alt} ratio={1.25} position={newCollection.image.position} sizes="(min-width: 900px) 55vw, 100vw" />
            </motion.div>
          </motion.div>
          <motion.div className="newcol__detail photo" style={{ y: detailY }}>
            <Img id={newCollection.detail.id} alt={newCollection.detail.alt} ratio={1.33} position={newCollection.detail.position} sizes="220px" widths={[240, 400, 520]} />
          </motion.div>
        </div>

        <div className="newcol__content">
          <p className="kicker">Coleção {newCollection.name}</p>
          <motion.h2 id="newcol-title" className="display newcol__title" style={{ x: titleX }}>
            {newCollection.headline}
          </motion.h2>
          <p className="lede">{newCollection.text}</p>

          <ul className="newcol__picks">
            {picks.map((p) => (
              <li key={p.id}>
                <button type="button" className="newcol__pick" onClick={() => openQuickView(p.id)}>
                  <span className="newcol__pick-name">{p.name}</span>
                  <span className="newcol__pick-price">{formatPrice(p.price)}</span>
                </button>
              </li>
            ))}
          </ul>

          <Magnetic>
            <a
              href="#catalogo"
              className="btn"
              onClick={(e) => {
                e.preventDefault()
                showInCatalog({ collection: 'new-season' })
              }}
            >
              Explorar a coleção
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  )
}
