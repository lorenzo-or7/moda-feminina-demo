export type CategoryId = 'vestidos' | 'blusas' | 'calcas' | 'saias' | 'conjuntos' | 'acessorios'
export type CollectionId = 'essentials' | 'contemporary' | 'evening' | 'new-season'
export type Size = 'PP' | 'P' | 'M' | 'G' | 'GG' | 'Único'
export type Availability = 'disponivel' | 'ultimas' | 'encomenda'

export interface ColorOption {
  id: string
  name: string
  hex: string
}

export interface ProductImage {
  id: string
  alt: string
  /** object-position para enquadramento (ex.: '50% 20%'). */
  position?: string
}

export interface Product {
  id: string
  name: string
  category: CategoryId
  collection: CollectionId
  price: number
  description: string
  details: string[]
  images: ProductImage[]
  /** Cores disponíveis. A primeira é a cor fotografada. */
  colors: ColorOption[]
  sizes: Size[]
  /** Tamanhos esgotados na simulação. */
  soldOut?: Size[]
  availability: Availability
  isNew?: boolean
  /** Ordem de curadoria (menor = primeiro). */
  rank: number
}
