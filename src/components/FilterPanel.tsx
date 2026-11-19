import { Check } from 'lucide-react'
import { allSizes, categories, colors, priceRanges } from '../data/catalog-meta'
import { products } from '../data/products'
import { applyFilters, type Filters } from '../store/catalog'
import { useCatalog } from '../store/catalog'

const colorList = Object.values(colors)

function toggle<T>(list: T[], v: T) {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v]
}

/** Painel de filtros compartilhado entre a barra lateral (desktop) e o drawer (mobile). */
export function FilterPanel({ idPrefix }: { idPrefix: string }) {
  const { filters, setFilters } = useCatalog()

  // Contagem prevista por categoria, considerando os demais filtros ativos.
  const countFor = (patch: Partial<Filters>) => applyFilters(products, { ...filters, ...patch }).length
  const usedColors = colorList.filter((c) => products.some((p) => p.colors.some((pc) => pc.id === c.id)))

  return (
    <div className="filters">
      <fieldset className="filters__group">
        <legend className="filters__legend">Categoria</legend>
        <div className="filters__chips">
          {categories.map((c) => {
            const on = filters.categories.includes(c.id)
            const n = countFor({ categories: on ? filters.categories : [c.id] })
            return (
              <button
                key={c.id}
                type="button"
                className="chip"
                aria-pressed={on}
                onClick={() => setFilters((f) => ({ ...f, categories: toggle(f.categories, c.id) }))}
              >
                {c.label}
                <span className="chip__count" aria-label={`${n} peças`}>
                  {n}
                </span>
              </button>
            )
          })}
        </div>
      </fieldset>

      <fieldset className="filters__group">
        <legend className="filters__legend">Faixa de preço</legend>
        <div className="filters__radios">
          {priceRanges.map((r) => (
            <label key={r.id} className="radio-row">
              <input
                type="radio"
                name={`${idPrefix}-price`}
                value={r.id}
                checked={filters.price === r.id}
                onChange={() => setFilters((f) => ({ ...f, price: r.id }))}
              />
              <span className="radio-row__dot" aria-hidden="true" />
              <span>{r.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="filters__group">
        <legend className="filters__legend">Tamanho</legend>
        <div className="filters__sizes">
          {allSizes.map((s) => (
            <button
              key={s}
              type="button"
              className="size-btn"
              aria-pressed={filters.sizes.includes(s)}
              onClick={() => setFilters((f) => ({ ...f, sizes: toggle(f.sizes, s) }))}
            >
              {s}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="filters__group">
        <legend className="filters__legend">Cor</legend>
        <div className="filters__colors">
          {usedColors.map((c) => {
            const on = filters.colors.includes(c.id)
            return (
              <button
                key={c.id}
                type="button"
                className="color-opt"
                aria-pressed={on}
                onClick={() => setFilters((f) => ({ ...f, colors: toggle(f.colors, c.id) }))}
              >
                <span className="swatch" style={{ background: c.hex }} aria-hidden="true">
                  {on && <Check size={12} strokeWidth={2.4} className="swatch__check" />}
                </span>
                {c.name}
              </button>
            )
          })}
        </div>
      </fieldset>
    </div>
  )
}
