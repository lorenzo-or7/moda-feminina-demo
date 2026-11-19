import type { Availability, CategoryId, ColorOption, Size } from './types'

export const categories: { id: CategoryId; label: string }[] = [
  { id: 'vestidos', label: 'Vestidos' },
  { id: 'blusas', label: 'Blusas' },
  { id: 'calcas', label: 'Calças' },
  { id: 'saias', label: 'Saias' },
  { id: 'conjuntos', label: 'Conjuntos' },
  { id: 'acessorios', label: 'Acessórios' },
]

export const categoryLabel = (id: CategoryId) => categories.find((c) => c.id === id)?.label ?? id

export const allSizes: Size[] = ['PP', 'P', 'M', 'G', 'GG', 'Único']

/** Paleta de cores do catálogo. O nome sempre acompanha a amostra (não dependemos só da cor). */
export const colors = {
  offwhite: { id: 'offwhite', name: 'Off-white', hex: '#F1ECE2' },
  areia: { id: 'areia', name: 'Areia', hex: '#D9C6A8' },
  terracota: { id: 'terracota', name: 'Terracota', hex: '#B3593F' },
  caramelo: { id: 'caramelo', name: 'Caramelo', hex: '#A0622D' },
  chocolate: { id: 'chocolate', name: 'Chocolate', hex: '#5A3A2A' },
  oliva: { id: 'oliva', name: 'Oliva', hex: '#6F7148' },
  salvia: { id: 'salvia', name: 'Sálvia', hex: '#A7B09A' },
  menta: { id: 'menta', name: 'Menta', hex: '#C9D8C5' },
  lavanda: { id: 'lavanda', name: 'Lavanda', hex: '#A99BC9' },
  rosa: { id: 'rosa', name: 'Rosa', hex: '#D9467A' },
  magenta: { id: 'magenta', name: 'Magenta', hex: '#8E1F4E' },
  vermelho: { id: 'vermelho', name: 'Vermelho', hex: '#A3242B' },
  azul: { id: 'azul', name: 'Jeans', hex: '#7D9BC1' },
  preto: { id: 'preto', name: 'Preto', hex: '#1E1C1B' },
  dourado: { id: 'dourado', name: 'Dourado', hex: '#C9A15A' },
  estampado: { id: 'estampado', name: 'Estampado', hex: 'conic-gradient(#B3593F 0 25%, #F1ECE2 0 50%, #6F7148 0 75%, #D9C6A8 0)' },
} satisfies Record<string, ColorOption>

export const availabilityLabel: Record<Availability, string> = {
  disponivel: 'Disponível',
  ultimas: 'Últimas unidades',
  encomenda: 'Sob consulta',
}

/** Limite de quantidade por item, coerente com a disponibilidade simulada. */
export const maxQuantity: Record<Availability, number> = {
  disponivel: 5,
  ultimas: 2,
  encomenda: 3,
}

export type PriceRangeId = 'all' | 'ate-300' | '300-600' | 'acima-600'
export const priceRanges: { id: PriceRangeId; label: string; min: number; max: number }[] = [
  { id: 'all', label: 'Todos os valores', min: 0, max: Infinity },
  { id: 'ate-300', label: 'Até R$ 300', min: 0, max: 300 },
  { id: '300-600', label: 'R$ 300 a R$ 600', min: 300, max: 600 },
  { id: 'acima-600', label: 'Acima de R$ 600', min: 600, max: Infinity },
]

export type SortId = 'curadoria' | 'novidades' | 'menor-preco' | 'maior-preco' | 'nome'
export const sortOptions: { id: SortId; label: string }[] = [
  { id: 'curadoria', label: 'Curadoria' },
  { id: 'novidades', label: 'Novidades primeiro' },
  { id: 'menor-preco', label: 'Menor preço' },
  { id: 'maior-preco', label: 'Maior preço' },
  { id: 'nome', label: 'Nome (A–Z)' },
]
