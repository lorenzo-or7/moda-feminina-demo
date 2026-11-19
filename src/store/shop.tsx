import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { maxQuantity } from '../data/catalog-meta'
import { productById } from '../data/products'
import type { Size } from '../data/types'
import { isRecord, readStorage, writeStorage } from '../lib/storage'

export interface CartItem {
  key: string
  productId: string
  colorId: string
  size: Size
  quantity: number
}

interface State {
  cart: CartItem[]
  favorites: string[]
}

type Action =
  | { type: 'add'; item: Omit<CartItem, 'key'> }
  | { type: 'qty'; key: string; quantity: number }
  | { type: 'remove'; key: string }
  | { type: 'clear' }
  | { type: 'fav'; productId: string }

const CART_KEY = 'me:cart:v1'
const FAV_KEY = 'me:favorites:v1'

const itemKey = (i: Pick<CartItem, 'productId' | 'colorId' | 'size'>) => `${i.productId}|${i.colorId}|${i.size}`

export const limitFor = (productId: string) => {
  const p = productById(productId)
  return p ? maxQuantity[p.availability] : 1
}

/** Valida cada item contra o catálogo atual; descarta o que estiver malformado ou obsoleto. */
function validateCart(raw: unknown): CartItem[] | null {
  if (!Array.isArray(raw)) return null
  const out: CartItem[] = []
  for (const r of raw.slice(0, 50)) {
    if (!isRecord(r)) continue
    const { productId, colorId, size, quantity } = r
    if (typeof productId !== 'string' || typeof colorId !== 'string' || typeof size !== 'string') continue
    const p = productById(productId)
    if (!p) continue
    if (!p.colors.some((c) => c.id === colorId)) continue
    if (!p.sizes.includes(size as Size) || p.soldOut?.includes(size as Size)) continue
    const q = typeof quantity === 'number' && Number.isFinite(quantity) ? Math.floor(quantity) : 1
    const item = { productId, colorId, size: size as Size, quantity: Math.min(Math.max(q, 1), maxQuantity[p.availability]) }
    const key = itemKey(item)
    if (out.some((o) => o.key === key)) continue
    out.push({ ...item, key })
  }
  return out
}

function validateFavorites(raw: unknown): string[] | null {
  if (!Array.isArray(raw)) return null
  return [...new Set(raw.filter((x): x is string => typeof x === 'string' && !!productById(x)))].slice(0, 100)
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add': {
      const key = itemKey(action.item)
      const limit = limitFor(action.item.productId)
      const existing = state.cart.find((i) => i.key === key)
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((i) => (i.key === key ? { ...i, quantity: Math.min(i.quantity + action.item.quantity, limit) } : i)),
        }
      }
      return { ...state, cart: [...state.cart, { ...action.item, key, quantity: Math.min(action.item.quantity, limit) }] }
    }
    case 'qty': {
      return {
        ...state,
        cart: state.cart.map((i) =>
          i.key === action.key ? { ...i, quantity: Math.min(Math.max(1, action.quantity), limitFor(i.productId)) } : i,
        ),
      }
    }
    case 'remove':
      return { ...state, cart: state.cart.filter((i) => i.key !== action.key) }
    case 'clear':
      return { ...state, cart: [] }
    case 'fav': {
      const has = state.favorites.includes(action.productId)
      return {
        ...state,
        favorites: has ? state.favorites.filter((f) => f !== action.productId) : [...state.favorites, action.productId],
      }
    }
  }
}

interface ShopApi {
  cart: CartItem[]
  favorites: string[]
  cartCount: number
  subtotal: number
  /** Retorna a quantidade efetivamente presente na sacola após adicionar e se houve limitação. */
  addToCart: (item: Omit<CartItem, 'key'>) => { limited: boolean }
  setQuantity: (key: string, quantity: number) => void
  removeItem: (key: string) => void
  clearCart: () => void
  toggleFavorite: (productId: string) => boolean
  isFavorite: (productId: string) => boolean
}

const ShopContext = createContext<ShopApi | null>(null)

export function ShopProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    cart: readStorage(CART_KEY, validateCart, []),
    favorites: readStorage(FAV_KEY, validateFavorites, []),
  }))

  useEffect(() => writeStorage(CART_KEY, state.cart.map(({ key: _k, ...rest }) => rest)), [state.cart])
  useEffect(() => writeStorage(FAV_KEY, state.favorites), [state.favorites])

  const addToCart = useCallback(
    (item: Omit<CartItem, 'key'>) => {
      const key = itemKey(item)
      const current = state.cart.find((i) => i.key === key)?.quantity ?? 0
      const limit = limitFor(item.productId)
      dispatch({ type: 'add', item })
      return { limited: current + item.quantity > limit }
    },
    [state.cart],
  )

  const toggleFavorite = useCallback(
    (productId: string) => {
      const willAdd = !state.favorites.includes(productId)
      dispatch({ type: 'fav', productId })
      return willAdd
    },
    [state.favorites],
  )

  const api = useMemo<ShopApi>(() => {
    const subtotal = state.cart.reduce((s, i) => s + (productById(i.productId)?.price ?? 0) * i.quantity, 0)
    return {
      cart: state.cart,
      favorites: state.favorites,
      cartCount: state.cart.reduce((s, i) => s + i.quantity, 0),
      subtotal,
      addToCart,
      setQuantity: (key, quantity) => dispatch({ type: 'qty', key, quantity }),
      removeItem: (key) => dispatch({ type: 'remove', key }),
      clearCart: () => dispatch({ type: 'clear' }),
      toggleFavorite,
      isFavorite: (id) => state.favorites.includes(id),
    }
  }, [state, addToCart, toggleFavorite])

  return <ShopContext.Provider value={api}>{children}</ShopContext.Provider>
}

export function useShop() {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error('useShop deve ser usado dentro de ShopProvider')
  return ctx
}
