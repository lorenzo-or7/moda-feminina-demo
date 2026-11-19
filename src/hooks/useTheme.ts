import { useCallback, useEffect, useState } from 'react'
import { writeStorage } from '../lib/storage'

export type Theme = 'light' | 'dark'
const KEY = 'me:theme'

const current = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

type DocWithVT = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> }
}

/**
 * Tema claro é o padrão. A troca usa View Transitions (revelação circular a partir do botão)
 * quando suportado e sem prefers-reduced-motion; senão, transição de cores via CSS.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(current)

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]')
    meta?.setAttribute('content', theme === 'dark' ? '#171513' : '#F7F5F0')
  }, [theme])

  const toggle = useCallback((origin?: { x: number; y: number }) => {
    const next: Theme = current() === 'dark' ? 'light' : 'dark'
    const apply = () => {
      document.documentElement.dataset.theme = next
      setTheme(next)
      writeStorage(KEY, next)
    }
    const doc = document as DocWithVT
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!doc.startViewTransition || reduce) {
      document.documentElement.classList.add('theme-fade')
      apply()
      window.setTimeout(() => document.documentElement.classList.remove('theme-fade'), 500)
      return
    }
    const x = origin?.x ?? window.innerWidth - 40
    const y = origin?.y ?? 40
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    const t = doc.startViewTransition(apply)
    t.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
          { duration: 650, easing: 'cubic-bezier(.65,0,.35,1)', pseudoElement: '::view-transition-new(root)' },
        )
      })
      .catch(() => {})
  }, [])

  return { theme, toggle }
}
