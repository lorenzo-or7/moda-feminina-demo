import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { priceRanges, type PriceRangeId, type SortId } from '../data/catalog-meta'
import { products } from '../data/products'
import type { CategoryId, CollectionId, Product, Size } from '../data/types'

export interface Filters {
  categories: CategoryId[]
  price: PriceRangeId
  sizes: Size[]
  colors: string[]
  collection: CollectionId | null
  sort: SortId
}

export const emptyFilters: Filters = {
  categories: [],
  price: 'all',
  sizes: [],
  colors: [],
  collection: null,
  sort: 'curadoria',
}

export function applyFilters(list: Product[], f: Filters): Product[] {
  const range = priceRanges.find((r) => r.id === f.price) ?? priceRanges[0]
  const filtered = list.filter((p) => {
    if (f.categories.length && !f.categories.includes(p.category)) return false
    if (f.collection && p.collection !== f.collection) return false
    if (p.price < range.min || p.price > range.max) return false
    if (f.sizes.length && !f.sizes.some((s) => p.sizes.includes(s) && !p.soldOut?.includes(s))) return false
    if (f.colors.length && !f.colors.some((c) => p.colors.some((pc) => pc.id === c))) return false
    return true
  })
  const sorted = [...filtered]
  switch (f.sort) {
    case 'menor-preco':
      sorted.sort((a, b) => a.price - b.price)
      break
    case 'maior-preco':
      sorted.sort((a, b) => b.price - a.price)
      break
    case 'nome':
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
      break
    case 'novidades':
      sorted.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew) || a.rank - b.rank)
      break
    default:
      sorted.sort((a, b) => a.rank - b.rank)
  }
  return sorted
}

export const activeFilterCount = (f: Filters) =>
  f.categories.length + f.sizes.length + f.colors.length + (f.price !== 'all' ? 1 : 0) + (f.collection ? 1 : 0)

interface CatalogApi {
  filters: Filters
  setFilters: (updater: (f: Filters) => Filters) => void
  reset: () => void
  results: Product[]
  /** Aplica um filtro vindo de outra seção e rola até o catálogo. */
  showInCatalog: (patch: Partial<Filters>) => void
}

const CatalogContext = createContext<CatalogApi | null>(null)

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [filters, setState] = useState<Filters>(emptyFilters)
  const setFilters = useCallback((u: (f: Filters) => Filters) => setState(u), [])
  const reset = useCallback(() => setState((f) => ({ ...emptyFilters, sort: f.sort })), [])
  const showInCatalog = useCallback((patch: Partial<Filters>) => {
    setState({ ...emptyFilters, ...patch })
    requestAnimationFrame(() => {
      document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])
  const results = useMemo(() => applyFilters(products, filters), [filters])

  const api = useMemo(() => ({ filters, setFilters, reset, results, showInCatalog }), [filters, setFilters, reset, results, showInCatalog])
  return <CatalogContext.Provider value={api}>{children}</CatalogContext.Provider>
}

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog deve ser usado dentro de CatalogProvider')
  return ctx
}
