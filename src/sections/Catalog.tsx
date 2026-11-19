import { AnimatePresence, motion } from 'motion/react'
import { SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'
import { Drawer } from '../components/Drawer'
import { FilterPanel } from '../components/FilterPanel'
import { MaskText } from '../components/motion'
import { ProductCard } from '../components/ProductCard'
import { categoryLabel, colors, priceRanges, sortOptions, type SortId } from '../data/catalog-meta'
import { collectionName } from '../data/editorial'
import { products } from '../data/products'
import { pluralize } from '../lib/format'
import { activeFilterCount, useCatalog } from '../store/catalog'

const colorName = (id: string) => Object.values(colors).find((c) => c.id === id)?.name ?? id

export function Catalog() {
  const { filters, setFilters, reset, results } = useCatalog()
  const [drawer, setDrawer] = useState(false)
  const active = activeFilterCount(filters)

  const pills: { key: string; label: string; remove: () => void }[] = [
    ...(filters.collection
      ? [{ key: 'col', label: `Coleção ${collectionName(filters.collection)}`, remove: () => setFilters((f) => ({ ...f, collection: null })) }]
      : []),
    ...filters.categories.map((c) => ({
      key: `cat-${c}`,
      label: categoryLabel(c),
      remove: () => setFilters((f) => ({ ...f, categories: f.categories.filter((x) => x !== c) })),
    })),
    ...(filters.price !== 'all'
      ? [{ key: 'price', label: priceRanges.find((p) => p.id === filters.price)?.label ?? '', remove: () => setFilters((f) => ({ ...f, price: 'all' })) }]
      : []),
    ...filters.sizes.map((s) => ({
      key: `size-${s}`,
      label: `Tamanho ${s}`,
      remove: () => setFilters((f) => ({ ...f, sizes: f.sizes.filter((x) => x !== s) })),
    })),
    ...filters.colors.map((c) => ({
      key: `color-${c}`,
      label: colorName(c),
      remove: () => setFilters((f) => ({ ...f, colors: f.colors.filter((x) => x !== c) })),
    })),
  ]

  return (
    <section id="catalogo" className="section catalog" aria-labelledby="catalogo-title">
      <div className="wrap">
        <header className="catalog__head">
          <h2 id="catalogo-title" className="h-section">
            <MaskText lines={['O acervo']} />
          </h2>
          <p className="lede">
            {products.length} peças demonstrativas. Filtre por categoria, valor, tamanho ou cor e abra qualquer peça para ver detalhes.
          </p>
        </header>

        <div className="catalog__layout">
          <aside className="catalog__aside" aria-label="Filtros do catálogo">
            <div className="catalog__aside-inner">
              <div className="catalog__aside-head">
                <p className="filters__title">Filtrar</p>
                {active > 0 && (
                  <button type="button" className="text-link" onClick={reset}>
                    Limpar filtros
                  </button>
                )}
              </div>
              <FilterPanel idPrefix="desk" />
            </div>
          </aside>

          <div className="catalog__main" id="catalogo-resultados">
            <div className="catalog__toolbar">
              <button type="button" className="chip catalog__filter-btn" onClick={() => setDrawer(true)} aria-haspopup="dialog">
                <SlidersHorizontal size={16} strokeWidth={1.7} />
                Filtrar{active > 0 && <span className="chip__count chip__count--solid">{active}</span>}
              </button>
              <p className="catalog__count" aria-live="polite" aria-atomic="true">
                {pluralize(results.length, 'peça', 'peças')}
              </p>
              <label className="catalog__sort">
                <span className="sr-only">Ordenar por</span>
                <span className="catalog__sort-label" aria-hidden="true">
                  Ordenar
                </span>
                <select className="select" value={filters.sort} onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value as SortId }))}>
                  {sortOptions.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {pills.length > 0 && (
              <ul className="catalog__pills" aria-label="Filtros ativos">
                <AnimatePresence initial={false}>
                  {pills.map((p) => (
                    <motion.li key={p.key} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                      <button type="button" className="pill" onClick={p.remove} aria-label={`Remover filtro ${p.label}`}>
                        {p.label}
                        <X size={14} strokeWidth={1.8} aria-hidden="true" />
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
                <li>
                  <button type="button" className="text-link" onClick={reset}>
                    Limpar filtros
                  </button>
                </li>
              </ul>
            )}

            {results.length > 0 ? (
              <motion.ul className="catalog__grid" layout="position">
                <AnimatePresence mode="popLayout" initial={false}>
                  {results.map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} />
                  ))}
                </AnimatePresence>
              </motion.ul>
            ) : (
              <motion.div className="catalog__empty" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <p className="catalog__empty-title">Nenhuma peça com essa combinação.</p>
                <p className="lede">Tente remover um dos filtros ou ampliar a faixa de preço. Você também pode pedir uma sugestão à boutique.</p>
                <div className="catalog__empty-actions">
                  <button type="button" className="btn" onClick={reset}>
                    Limpar filtros
                  </button>
                  <a href="#contato" className="btn btn--ghost">
                    Pedir sugestão
                  </a>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <Drawer
        open={drawer}
        onClose={() => setDrawer(false)}
        title="Filtros"
        side="left"
        footer={
          <div className="drawer__foot-row">
            <button type="button" className="btn btn--ghost" onClick={reset} disabled={active === 0}>
              Limpar
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setDrawer(false)
                window.setTimeout(() => document.getElementById('catalogo-resultados')?.scrollIntoView({ block: 'start' }), 60)
              }}
            >
              Ver {pluralize(results.length, 'peça', 'peças')}
            </button>
          </div>
        }
      >
        <FilterPanel idPrefix="mob" />
      </Drawer>
    </section>
  )
}
