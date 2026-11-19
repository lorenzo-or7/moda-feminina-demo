/**
 * Persistência local resiliente: qualquer falha (modo privado, cota, JSON inválido,
 * dados adulterados) resulta no valor padrão, nunca em erro de execução.
 */
export function readStorage<T>(key: string, validate: (raw: unknown) => T | null, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    const parsed: unknown = JSON.parse(raw)
    const valid = validate(parsed)
    return valid ?? fallback
  } catch {
    return fallback
  }
}

export function writeStorage(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* armazenamento indisponível: segue apenas em memória */
  }
}

export const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)
