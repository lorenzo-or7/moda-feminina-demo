import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
import { useRef, type ElementType, type PointerEvent, type ReactNode } from 'react'

export const EASE = [0.22, 1, 0.36, 1] as const
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const

/**
 * Text Mask: cada linha sobe de dentro de uma máscara.
 * `lines` permite controlar a quebra editorial manualmente.
 */
export function MaskText({
  lines,
  as: Tag = 'span',
  className,
  delay = 0,
  stagger = 0.09,
  inView = true,
  animateNow = false,
}: {
  lines: ReactNode[]
  as?: ElementType
  className?: string
  delay?: number
  stagger?: number
  inView?: boolean
  animateNow?: boolean
}) {
  const reduce = useReducedMotion()
  const trigger = animateNow
    ? { animate: 'shown' as const }
    : inView
      ? { whileInView: 'shown' as const, viewport: { once: true, margin: '0px 0px -12% 0px' } }
      : { animate: 'shown' as const }
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className="mask-line">
          <motion.span
            className="mask-line__inner"
            initial={reduce ? false : 'hidden'}
            {...trigger}
            variants={{
              hidden: { y: '108%' },
              shown: { y: '0%', transition: { duration: 1.05, ease: EASE, delay: delay + i * stagger } },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

/** Editorial Image Reveal: a fotografia é revelada por uma máscara e assenta com leve escala. */
export function RevealImage({
  children,
  className,
  direction = 'up',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  direction?: 'up' | 'left' | 'right'
  delay?: number
}) {
  const reduce = useReducedMotion()
  const from = {
    up: 'inset(100% 0% 0% 0%)',
    left: 'inset(0% 100% 0% 0%)',
    right: 'inset(0% 0% 0% 100%)',
  }[direction]
  return (
    <motion.div
      className={className}
      style={{ overflow: 'hidden' }}
      initial={reduce ? false : { clipPath: from }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.25, ease: EASE_IN_OUT, delay }}
    >
      <motion.div
        className="reveal-inner"
        initial={reduce ? false : { scale: 1.18 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 1.6, ease: EASE, delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

/** Parallax sutil: desloca o conteúdo em relação à rolagem do contêiner. */
export function Parallax({ children, amount = 60, className }: { children: ReactNode; amount?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-amount, amount])
  return (
    <div ref={ref} className={className} style={{ overflow: 'hidden', height: '100%' }}>
      <motion.div style={{ y, height: `calc(100% + ${amount * 2}px)`, marginTop: -amount }}>{children}</motion.div>
    </div>
  )
}

/** Entrada suave de bloco (usada com parcimônia). */
export function FadeUp({ children, delay = 0, className, as = 'div' }: { children: ReactNode; delay?: number; className?: string; as?: 'div' | 'p' | 'li' }) {
  const reduce = useReducedMotion()
  const Comp = motion[as]
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </Comp>
  )
}

/** Magnetic Button moderado: segue o ponteiro em até ~10px (somente ponteiros finos). */
export function Magnetic({ children, strength = 0.22, className }: { children: ReactNode; strength?: number; className?: string }) {
  const reduce = useReducedMotion()
  const x = useSpring(0, { stiffness: 220, damping: 18, mass: 0.4 })
  const y = useSpring(0, { stiffness: 220, damping: 18, mass: 0.4 })
  const onMove = (e: PointerEvent<HTMLSpanElement>) => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    x.set(Math.max(-10, Math.min(10, (e.clientX - (r.left + r.width / 2)) * strength)))
    y.set(Math.max(-10, Math.min(10, (e.clientY - (r.top + r.height / 2)) * strength)))
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }
  return (
    <motion.span className={`magnetic ${className ?? ''}`} style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </motion.span>
  )
}

/** Palavras que acendem conforme a rolagem (manifesto). */
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] })
  const words = text.split(' ')
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} still={!!reduce}>
          {w}
        </Word>
      ))}
    </p>
  )
}

function Word({ children, progress, range, still }: { children: string; progress: MotionValue<number>; range: [number, number]; still: boolean }) {
  const opacity = useTransform(progress, range, still ? [1, 1] : [0.18, 1])
  return (
    <>
      <motion.span style={{ opacity }}>{children}</motion.span>{' '}
    </>
  )
}
