import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { X } from 'lucide-react'
import { useId, useRef, type ReactNode } from 'react'
import { useDialog } from '../hooks/useDialog'
import { EASE } from './motion'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  side?: 'right' | 'left'
  children: ReactNode
  footer?: ReactNode
  subtitle?: ReactNode
}

/** Painel lateral acessível (sacola, favoritos, filtros no mobile). */
export function Drawer({ open, onClose, title, side = 'right', children, footer, subtitle }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const reduce = useReducedMotion()
  useDialog(open, ref, onClose)
  const off = side === 'right' ? '100%' : '-100%'

  return (
    <AnimatePresence>
      {open && (
        <div className="layer">
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
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={`drawer drawer--${side}`}
            initial={reduce ? { opacity: 0 } : { x: off }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: off }}
            transition={{ duration: 0.6, ease: EASE }}
            tabIndex={-1}
          >
            <header className="drawer__head">
              <div>
                <h2 id={titleId} className="drawer__title">
                  {title}
                </h2>
                {subtitle && <p className="caption">{subtitle}</p>}
              </div>
              <button type="button" className="icon-btn" onClick={onClose} aria-label={`Fechar ${title.toLowerCase()}`}>
                <X size={20} strokeWidth={1.6} />
              </button>
            </header>
            <div className="drawer__body">{children}</div>
            {footer && <footer className="drawer__foot">{footer}</footer>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
