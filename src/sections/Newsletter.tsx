import { AnimatePresence, motion } from 'motion/react'
import { AlertCircle, Check, Loader2 } from 'lucide-react'
import { useId, useRef, useState, type FormEvent } from 'react'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

type Status = 'idle' | 'error' | 'loading' | 'done'

/**
 * Newsletter demonstrativa: valida o e-mail, simula o envio e deixa claro que nada foi
 * registrado. O endereço não é salvo nem transmitido.
 */
export function Newsletter() {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const value = email.trim()
    if (!value) {
      setError('Informe um e-mail.')
      setStatus('error')
      inputRef.current?.focus()
      return
    }
    if (value.length > 254 || !EMAIL_RE.test(value)) {
      setError('Confira o e-mail: use o formato nome@exemplo.com.')
      setStatus('error')
      inputRef.current?.focus()
      return
    }
    setError('')
    setStatus('loading')
    window.setTimeout(() => {
      setStatus('done')
      setEmail('')
      setConsent(false)
    }, 900)
  }

  return (
    <section className="newsletter" aria-labelledby={`${id}-t`}>
      <div className="wrap newsletter__grid">
        <div>
          <h2 id={`${id}-t`} className="newsletter__title">
            Novidades, sem pressa.
          </h2>
          <p className="newsletter__text">Uma carta por estação com as peças que chegaram e os looks da campanha.</p>
        </div>

        <form className="newsletter__form" onSubmit={submit} noValidate>
          <div className="newsletter__row">
            <div className="field newsletter__field">
              <label htmlFor={`${id}-email`}>E-mail</label>
              <input
                ref={inputRef}
                id={`${id}-email`}
                className="input"
                type="email"
                inputMode="email"
                autoComplete="email"
                maxLength={254}
                placeholder="nome@exemplo.com"
                value={email}
                aria-invalid={status === 'error' || undefined}
                aria-describedby={`${id}-msg ${id}-note`}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (status === 'error' || status === 'done') setStatus('idle')
                }}
              />
            </div>
            <button type="submit" className="btn newsletter__submit" disabled={status === 'loading'}>
              {status === 'loading' ? (
                <>
                  <Loader2 size={16} className="spin" aria-hidden="true" /> Verificando
                </>
              ) : (
                'Quero receber'
              )}
            </button>
          </div>

          <label className="check">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span className="check__box" aria-hidden="true">
              <Check size={12} strokeWidth={3} />
            </span>
            <span>Aceito receber comunicações sobre coleções e eventos da boutique (opcional).</span>
          </label>

          <div id={`${id}-msg`} aria-live="polite" className="newsletter__msg">
            <AnimatePresence mode="wait">
              {status === 'error' && (
                <motion.p key="err" className="form-msg form-msg--error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <AlertCircle size={16} aria-hidden="true" /> {error}
                </motion.p>
              )}
              {status === 'done' && (
                <motion.p key="ok" className="form-msg form-msg--ok" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <Check size={16} aria-hidden="true" /> E-mail válido. Por ser uma demonstração, nenhuma inscrição foi feita e o endereço não foi enviado nem salvo.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <p id={`${id}-note`} className="caption">
            Protótipo sem serviço de e-mail integrado. Os dados digitados ficam apenas nesta página.
          </p>
        </form>
      </div>
    </section>
  )
}
