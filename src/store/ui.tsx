import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { whatsappUrl } from '../lib/whatsapp'

export type Panel = 'cart' | 'favorites' | null

export interface Toast {
  id: number
  message: string
  tone: 'success' | 'error' | 'info'
}

export interface Inquiry {
  title: string
  message: string
}

interface UiApi {
  quickViewId: string | null
  openQuickView: (id: string) => void
  closeQuickView: () => void
  panel: Panel
  openPanel: (p: Exclude<Panel, null>) => void
  closePanel: () => void
  toasts: Toast[]
  toast: (message: string, tone?: Toast['tone']) => void
  dismissToast: (id: number) => void
  inquiry: Inquiry | null
  /** Abre o WhatsApp se houver número válido; caso contrário mostra a mensagem para copiar. */
  sendInquiry: (inq: Inquiry) => void
  closeInquiry: () => void
}

const UiContext = createContext<UiApi | null>(null)

export function UiProvider({ children }: { children: ReactNode }) {
  const [quickViewId, setQuickViewId] = useState<string | null>(null)
  const [panel, setPanel] = useState<Panel>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [inquiry, setInquiry] = useState<Inquiry | null>(null)
  const seq = useRef(0)

  const dismissToast = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), [])
  const toast = useCallback(
    (message: string, tone: Toast['tone'] = 'success') => {
      const id = ++seq.current
      setToasts((t) => [...t.slice(-2), { id, message, tone }])
      window.setTimeout(() => dismissToast(id), 3600)
    },
    [dismissToast],
  )

  const sendInquiry = useCallback((inq: Inquiry) => {
    const url = whatsappUrl(inq.message)
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
      return
    }
    setInquiry(inq)
  }, [])

  const api = useMemo<UiApi>(
    () => ({
      quickViewId,
      openQuickView: setQuickViewId,
      closeQuickView: () => setQuickViewId(null),
      panel,
      openPanel: setPanel,
      closePanel: () => setPanel(null),
      toasts,
      toast,
      dismissToast,
      inquiry,
      sendInquiry,
      closeInquiry: () => setInquiry(null),
    }),
    [quickViewId, panel, toasts, toast, dismissToast, inquiry, sendInquiry],
  )
  return <UiContext.Provider value={api}>{children}</UiContext.Provider>
}

export function useUi() {
  const ctx = useContext(UiContext)
  if (!ctx) throw new Error('useUi deve ser usado dentro de UiProvider')
  return ctx
}
