import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Check, Copy, Info, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { useDialog } from '../hooks/useDialog'
import { useUi } from '../store/ui'
import { EASE } from './motion'

/** Alternativa demonstrativa ao WhatsApp quando não há número configurado. */
export function InquiryDialog() {
  const { inquiry, closeInquiry } = useUi()
  return <AnimatePresence>{inquiry && <InquiryInner key={inquiry.message} title={inquiry.title} message={inquiry.message} onClose={closeInquiry} />}</AnimatePresence>
}

function InquiryInner({ title, message, onClose }: { title: string; message: string; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const reduce = useReducedMotion()
  const [copied, setCopied] = useState<'ok' | 'fail' | null>(null)
  const textRef = useRef<HTMLTextAreaElement>(null)
  useDialog(true, ref, onClose)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message)
      setCopied('ok')
    } catch {
      textRef.current?.select()
      setCopied('fail')
    }
  }

  return (
    <div className="layer layer--center layer--top">
      <motion.div className="layer__scrim" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-hidden="true" />
      <motion.div
        ref={ref}
        className="inq"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div className="inq__head">
          <h2 id={titleId} className="inq__title">
            {title}
          </h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Fechar">
            <X size={20} strokeWidth={1.6} />
          </button>
        </div>
        <p className="inq__notice">
          <Info size={16} aria-hidden="true" />
          <span>
            Modo demonstrativo: nenhum número de WhatsApp foi configurado, então nada foi enviado. Esta é a mensagem que a cliente
            enviaria à boutique.
          </span>
        </p>
        <label className="sr-only" htmlFor={`${titleId}-msg`}>
          Mensagem gerada
        </label>
        <textarea id={`${titleId}-msg`} ref={textRef} className="inq__text" readOnly value={message} rows={Math.min(14, message.split('\n').length + 1)} />
        <div className="inq__actions">
          <button type="button" className="btn" onClick={copy}>
            {copied === 'ok' ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
            {copied === 'ok' ? 'Mensagem copiada' : 'Copiar mensagem'}
          </button>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Fechar
          </button>
        </div>
        <p className="caption" role="status" aria-live="polite">
          {copied === 'fail' ? 'Não foi possível copiar automaticamente. O texto foi selecionado: use Ctrl+C ou Cmd+C.' : ''}
          {copied !== 'fail' && 'Para ativar o envio real, defina o número em src/config/brand.ts ou na variável VITE_WHATSAPP_NUMBER.'}
        </p>
      </motion.div>
    </div>
  )
}

export function Toasts() {
  const { toasts, dismissToast } = useUi()
  const reduce = useReducedMotion()
  return (
    <div className="toasts" role="status" aria-live="polite">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout={!reduce}
            className={`toast toast--${t.tone}`}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, transition: { duration: 0.2 } }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <span className="toast__icon" aria-hidden="true">
              {t.tone === 'success' ? <Check size={15} /> : <Info size={15} />}
            </span>
            <span className="toast__msg">{t.message}</span>
            <button type="button" className="toast__close" onClick={() => dismissToast(t.id)} aria-label="Dispensar aviso">
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

/** Garante que o hash inicial (#catalogo etc.) role corretamente após a montagem. */
export function useInitialHash() {
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (!id) return
    const t = window.setTimeout(() => document.getElementById(id)?.scrollIntoView(), 120)
    return () => window.clearTimeout(t)
  }, [])
}
