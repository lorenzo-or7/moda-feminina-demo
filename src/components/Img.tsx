import { useState, type CSSProperties } from 'react'
import { img, srcSet } from '../lib/image'

interface Props {
  id: string
  alt: string
  /** altura / largura do recorte (ex.: 4/3 = 1.333 para retrato 3:4) */
  ratio?: number
  sizes?: string
  position?: string
  priority?: boolean
  className?: string
  style?: CSSProperties
  widths?: number[]
}

/** Imagem responsiva com srcset, lazy loading e fade-in ao carregar. */
export function Img({ id, alt, ratio, sizes = '100vw', position, priority, className, style, widths }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const fallbackW = 960
  if (failed) {
    return (
      <span className={`img-fallback ${className ?? ''}`} role="img" aria-label={alt} style={style}>
        <span aria-hidden="true">Imagem indisponível</span>
      </span>
    )
  }
  return (
    <img
      src={img(id, fallbackW, ratio ? Math.round(fallbackW * ratio) : undefined)}
      srcSet={srcSet(id, ratio, widths)}
      sizes={sizes}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      className={className}
      data-loaded={loaded || undefined}
      style={{ objectPosition: position, ...style }}
      draggable={false}
    />
  )
}
