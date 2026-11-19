import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Heart, Moon, ShoppingBag, Sun } from 'lucide-react'
import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { brand } from '../config/brand'
import { useActiveSection } from '../hooks/useActiveSection'
import { useDialog } from '../hooks/useDialog'
import { useTheme } from '../hooks/useTheme'
import { useShop } from '../store/shop'
import { useUi } from '../store/ui'
import { EASE } from './motion'

export const navLinks = [
  { id: 'inicio', label: 'Início' },
  { id: 'colecoes', label: 'Coleções' },
  { id: 'novidades', label: 'Novidades' },
  { id: 'lookbook', label: 'Lookbook' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'contato', label: 'Contato' },
]
const sectionIds = navLinks.map((l) => l.id)

function Count({ value, label }: { value: number; label: string }) {
  const reduce = useReducedMotion()
  if (!value) return null
  return (
    <motion.span
      key={value}
      className="nav__count"
      aria-hidden="true"
      initial={reduce ? false : { scale: 0.4, y: -6 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 520, damping: 18 }}
      title={label}
    >
      {value}
    </motion.span>
  )
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const active = useActiveSection(sectionIds)
  const { theme, toggle } = useTheme()
  const { cartCount, favorites } = useShop()
  const { openPanel } = useUi()
  const reduce = useReducedMotion()
  const bagRef = useRef<HTMLButtonElement>(null)
  const [bump, setBump] = useState(0)
  const prevCount = useRef(cartCount)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (cartCount > prevCount.current) setBump((b) => b + 1)
    prevCount.current = cartCount
  }, [cartCount])

  const onTheme = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
  }

  const themeLabel = theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'

  return (
    <>
      <motion.header
        className="nav"
        data-scrolled={scrolled || undefined}
        initial={reduce ? false : { y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}
      >
        <div className="nav__bar">
          <a href="#inicio" className="nav__logo" aria-label={`${brand.name}, voltar ao início`}>
            {brand.wordmark}
          </a>

          <nav className="nav__links" aria-label="Principal">
            <ul>
              {navLinks.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} aria-current={active === l.id ? 'true' : undefined} className="nav__link">
                    {l.label}
                    {active === l.id && (
                      <motion.span layoutId="nav-active" className="nav__indicator" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="nav__actions">
            <button type="button" className="icon-btn nav__theme" onClick={onTheme} aria-label={themeLabel} title={themeLabel}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={reduce ? false : { rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: 'grid' }}
                >
                  {theme === 'dark' ? <Sun size={19} strokeWidth={1.6} /> : <Moon size={19} strokeWidth={1.6} />}
                </motion.span>
              </AnimatePresence>
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={() => openPanel('favorites')}
              aria-label={`Favoritos, ${favorites.length} ${favorites.length === 1 ? 'peça' : 'peças'}`}
            >
              <Heart size={19} strokeWidth={1.6} />
              <Count value={favorites.length} label="favoritos" />
            </button>
            <motion.button
              ref={bagRef}
              type="button"
              className="icon-btn"
              onClick={() => openPanel('cart')}
              aria-label={`Sacola de seleção, ${cartCount} ${cartCount === 1 ? 'item' : 'itens'}`}
              key={bump}
              animate={reduce || !bump ? undefined : { rotate: [0, -12, 10, -6, 0] }}
              transition={{ duration: 0.6 }}
            >
              <ShoppingBag size={19} strokeWidth={1.6} />
              <Count value={cartCount} label="itens" />
            </motion.button>
            <button
              type="button"
              className="nav__burger"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              onClick={() => setMenuOpen((o) => !o)}
              data-open={menuOpen || undefined}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} active={active} />
    </>
  )
}

function MobileMenu({ open, onClose, active }: { open: boolean; onClose: () => void; active: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  useDialog(open, ref, onClose)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => mq.matches && onClose()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          id="mobile-menu"
          className="mmenu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0% 0% 100% 0%)' }}
          animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={reduce ? { opacity: 0 } : { clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
        >
          <div className="mmenu__top">
            <span className="nav__logo">{brand.wordmark}</span>
            <button type="button" className="nav__burger" data-open aria-label="Fechar menu" onClick={onClose}>
              <span />
              <span />
            </button>
          </div>
          <nav aria-label="Menu móvel">
            <ul className="mmenu__list">
              {navLinks.map((l, i) => (
                <li key={l.id} className="mask-line">
                  <motion.a
                    href={`#${l.id}`}
                    onClick={onClose}
                    aria-current={active === l.id ? 'true' : undefined}
                    className="mmenu__link"
                    initial={reduce ? false : { y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.25 + i * 0.06 }}
                  >
                    {l.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </nav>
          <motion.div
            className="mmenu__foot"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <a href="#catalogo" className="btn btn--block" onClick={onClose}>
              Ver catálogo
            </a>
            <p className="caption">{brand.campaign}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
