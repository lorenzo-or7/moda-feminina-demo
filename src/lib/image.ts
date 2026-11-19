/**
 * Fotografias servidas pelo CDN do Unsplash (Licença Unsplash, uso gratuito).
 * O CDN gera formatos otimizados (auto=format → AVIF/WebP) e recortes sob demanda.
 */
const BASE = 'https://images.unsplash.com/photo-'

export function img(id: string, width: number, height?: number, quality = 72): string {
  const h = height ? `&h=${height}` : ''
  return `${BASE}${id}?auto=format&fit=crop&w=${width}${h}&q=${quality}`
}

/** srcset em larguras padronizadas, mantendo a proporção informada (altura/largura). */
export function srcSet(id: string, ratio?: number, widths = [360, 540, 720, 960, 1280, 1600]): string {
  return widths
    .map((w) => `${img(id, w, ratio ? Math.round(w * ratio) : undefined)} ${w}w`)
    .join(', ')
}
