import { motion, useReducedMotion } from 'motion/react'
import type { MouseEvent } from 'react'
import { Img } from '../components/Img'
import { EASE, MaskText, Parallax, RevealImage } from '../components/motion'
import { collections } from '../data/editorial'
import { products } from '../data/products'
import { useCatalog } from '../store/catalog'

const layout = [
  { cls: 'col-a', ratio: 1.25, dir: 'up' as const },
  { cls: 'col-b', ratio: 1.34, dir: 'up' as const },
  { cls: 'col-c', ratio: 0.8, dir: 'left' as const },
  { cls: 'col-d', ratio: 1.34, dir: 'up' as const },
]

export function Collections() {
  const { showInCatalog } = useCatalog()
  const reduce = useReducedMotion()

  const go = (e: MouseEvent, id: (typeof collections)[number]['id']) => {
    e.preventDefault()
    showInCatalog({ collection: id })
  }

  return (
    <section id="colecoes" className="section collections" aria-labelledby="colecoes-title">
      <div className="wrap">
        <header className="collections__head">
          <h2 id="colecoes-title" className="h-section">
            <MaskText lines={['Quatro coleções,', 'um mesmo cuidado.']} />
          </h2>
          <p className="lede">
            Do linho de todos os dias ao cetim das noites longas. Cada coleção reúne poucas peças, pensadas para combinar entre si.
          </p>
        </header>

        <ul className="collections__grid">
          {collections.map((c, i) => {
            const l = layout[i]
            const count = products.filter((p) => p.collection === c.id).length
            return (
              <li key={c.id} className={`coll ${l.cls}`}>
                <a href="#catalogo" className="coll__link" onClick={(e) => go(e, c.id)} aria-label={`${c.name}: ver ${count} peças no catálogo`}>
                  <RevealImage className="coll__media" direction={l.dir} delay={i % 2 ? 0.15 : 0}>
                    <div className="coll__photo" style={{ aspectRatio: `1 / ${l.ratio}` }}>
                      <Parallax amount={36}>
                        <Img id={c.image.id} alt={c.image.alt} ratio={l.ratio} position={c.image.position} sizes="(min-width: 900px) 45vw, 92vw" />
                      </Parallax>
                    </div>
                  </RevealImage>
                  <motion.div
                    className="coll__text"
                    initial={reduce ? false : { opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                    transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
                  >
                    <h3 className="coll__name">{c.name}</h3>
                    <p className="coll__line">{c.line}</p>
                    <span className="coll__cta">
                      <span className="coll__cta-label">Ver {count} peças</span>
                      <span className="coll__cta-rule" aria-hidden="true" />
                    </span>
                  </motion.div>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
