import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Img } from '../components/Img'
import { EASE, EASE_IN_OUT, Magnetic, MaskText } from '../components/motion'
import { brand } from '../config/brand'
import { heroSlides } from '../data/editorial'
import { srcSet } from '../lib/image'

const INTERVAL = 6500

export function Hero() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(!!reduce)
  const [visible, setVisible] = useState(true)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '14%'])
  const photoScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 1.08])
  const titleY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '-22%'])

  // Pausa a rotação quando a hero sai da tela ou a aba fica oculta.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (paused || !visible) return
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % heroSlides.length), INTERVAL)
    return () => window.clearTimeout(t)
  }, [index, paused, visible])

  // Pré-carrega o próximo slide para a transição não revelar uma moldura vazia.
  useEffect(() => {
    const next = heroSlides[(index + 1) % heroSlides.length]
    const im = new Image()
    im.sizes = window.innerWidth >= 900 ? '52vw' : '100vw'
    im.srcset = srcSet(next.id, 1.3, [480, 720, 960, 1280, 1600])
  }, [index])

  const slide = heroSlides[index]

  return (
    <section id="inicio" ref={ref} className="hero" aria-label="Campanha">
      <div className="hero__grid wrap">
        <motion.div
          className="hero__meta"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <p className="caption">{brand.campaign}</p>
          <p className="caption">Capítulo I, a própria história</p>
        </motion.div>

        <motion.div
          className="hero__frame"
          initial={reduce ? false : { clipPath: 'inset(100% 0% 0% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          transition={{ duration: 1.5, ease: EASE_IN_OUT, delay: 0.1 }}
        >
          <motion.div className="hero__photo" style={{ y: photoY, scale: photoScale }}>
            <AnimatePresence initial={false}>
              <motion.div
                key={slide.id}
                className="hero__slide"
                initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0% 0% 0% 100%)', scale: 1.12 }}
                animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }}
                exit={{ opacity: 1 }}
                transition={{ duration: 1.4, ease: EASE_IN_OUT }}
              >
                <motion.div
                  style={{ ['--m-pos' as string]: slide.mobilePosition }}
                  className="hero__kenburns"
                  initial={reduce ? false : { scale: index === 0 ? 1.25 : 1 }}
                  animate={reduce ? undefined : { scale: 1.06 }}
                  transition={{ duration: index === 0 ? 2.2 : INTERVAL / 1000 + 1.5, ease: index === 0 ? EASE : 'linear' }}
                >
                  <Img
                    id={slide.id}
                    alt={slide.alt}
                    ratio={1.3}
                    sizes="(min-width: 900px) 52vw, 100vw"
                    priority={index === 0}
                    position={slide.position}
                    className="hero__img"
                    widths={[480, 720, 960, 1280, 1600]}
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>

        <div className="hero__slidebar">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={slide.caption}
              className="caption hero__caption"
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4 }}
            >
              {slide.caption}
            </motion.p>
          </AnimatePresence>
          <div className="hero__dots" role="group" aria-label="Imagens da campanha">
            {heroSlides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className="hero__dot"
                aria-label={`Mostrar imagem ${i + 1} de ${heroSlides.length}`}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => setIndex(i)}
              >
                <span className="hero__dot-track">
                  {i === index && (
                    <span
                      key={`${index}-${paused || !visible}`}
                      className="hero__dot-fill"
                      data-running={!paused && visible ? '' : undefined}
                      style={{ animationDuration: `${INTERVAL}ms` }}
                    />
                  )}
                </span>
              </button>
            ))}
            <button
              type="button"
              className="icon-btn hero__pause"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? 'Retomar troca automática de imagens' : 'Pausar troca automática de imagens'}
            >
              {paused ? <Play size={15} strokeWidth={1.8} /> : <Pause size={15} strokeWidth={1.8} />}
            </button>
          </div>
        </div>

        <div className="hero__copy">
          <motion.h1 className="display hero__title" style={{ y: titleY }}>
            <MaskText lines={['Vista sua', 'própria', 'história.']} animateNow delay={0.55} stagger={0.12} />
          </motion.h1>
          <motion.div
            className="hero__body"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 1.25 }}
          >
            <p className="lede">
              Peças escolhidas uma a uma, com tecidos naturais e cortes que acompanham você em vez de ditar quem você deve ser.
            </p>
            <div className="hero__ctas">
              <Magnetic>
                <a href="#catalogo" className="btn">
                  Explorar coleção
                </a>
              </Magnetic>
              <a href="#lookbook" className="btn btn--ghost">
                Ver lookbook
              </a>
            </div>
          </motion.div>
        </div>

        <motion.a
          href="#colecoes"
          className="hero__scroll"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          <span className="hero__scroll-line" aria-hidden="true" />
          <span>Role para descobrir</span>
        </motion.a>
      </div>
    </section>
  )
}
