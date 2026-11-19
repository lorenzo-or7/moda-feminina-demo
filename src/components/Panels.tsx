import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { maxQuantity } from '../data/catalog-meta'
import { productById } from '../data/products'
import { formatPrice, pluralize } from '../lib/format'
import { buildSelectionMessage } from '../lib/whatsapp'
import { useShop } from '../store/shop'
import { useUi } from '../store/ui'
import { Drawer } from './Drawer'
import { Img } from './Img'
import { EASE } from './motion'

export function CartPanel() {
  const ui = useUi()
  const { panel, sendInquiry, openQuickView, toast } = ui
  const { cart, subtotal, cartCount, setQuantity, removeItem, clearCart } = useShop()
  const [confirmClear, setConfirmClear] = useState(false)
  const reduce = useReducedMotion()
  const open = panel === 'cart'
  const closePanel = () => {
    setConfirmClear(false)
    ui.closePanel()
  }

  const send = () => {
    const lines = cart.flatMap((i) => {
      const p = productById(i.productId)
      if (!p) return []
      const color = p.colors.find((c) => c.id === i.colorId)?.name ?? ''
      return [{ name: p.name, color, size: i.size, quantity: i.quantity, unitPrice: p.price }]
    })
    sendInquiry({ title: 'Consulta da sua seleção', message: buildSelectionMessage(lines) })
  }

  return (
    <Drawer
      open={open}
      onClose={closePanel}
      title="Sacola de seleção"
      subtitle={cartCount ? pluralize(cartCount, 'peça selecionada', 'peças selecionadas') : undefined}
      footer={
        cart.length > 0 ? (
          <div className="cart__foot">
            <div className="cart__subtotal">
              <span>Subtotal demonstrativo</span>
              <motion.strong key={subtotal} initial={reduce ? false : { opacity: 0.3, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                {formatPrice(subtotal)}
              </motion.strong>
            </div>
            <p className="caption">
              Valores e disponibilidade são demonstrativos. A consulta é enviada à boutique, sem pagamento ou reserva automática.
            </p>
            <button type="button" className="btn btn--block" onClick={send}>
              Enviar consulta pelo WhatsApp
            </button>
            {confirmClear ? (
              <div className="cart__confirm" role="group" aria-label="Confirmar limpeza da seleção">
                <span>Remover todas as peças?</span>
                <button
                  type="button"
                  className="text-link cart__danger"
                  onClick={() => {
                    clearCart()
                    setConfirmClear(false)
                    toast('Seleção limpa.', 'info')
                  }}
                >
                  Sim, limpar
                </button>
                <button type="button" className="text-link" onClick={() => setConfirmClear(false)}>
                  Manter
                </button>
              </div>
            ) : (
              <button type="button" className="text-link cart__clear" onClick={() => setConfirmClear(true)}>
                Limpar seleção
              </button>
            )}
          </div>
        ) : undefined
      }
    >
      {cart.length === 0 ? (
        <div className="panel-empty">
          <p className="panel-empty__title">Sua seleção está vazia.</p>
          <p>Abra uma peça do catálogo, escolha cor e tamanho e adicione aqui para consultar a boutique de uma vez.</p>
          <a href="#catalogo" className="btn" onClick={closePanel}>
            Ver o acervo
          </a>
        </div>
      ) : (
        <ul className="cart__list">
          <AnimatePresence initial={false}>
            {cart.map((item) => {
              const p = productById(item.productId)
              if (!p) return null
              const color = p.colors.find((c) => c.id === item.colorId)
              const max = maxQuantity[p.availability]
              return (
                <motion.li
                  key={item.key}
                  layout={!reduce}
                  className="cart__item"
                  initial={reduce ? false : { opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, x: 40, height: 0, marginBottom: 0, paddingBlock: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <button
                    type="button"
                    className="cart__thumb photo"
                    onClick={() => {
                      closePanel()
                      openQuickView(p.id)
                    }}
                    aria-label={`Ver detalhes de ${p.name}`}
                  >
                    <Img id={p.images[0].id} alt="" ratio={4 / 3} position={p.images[0].position} sizes="88px" widths={[120, 200]} />
                  </button>
                  <div className="cart__info">
                    <div className="cart__row">
                      <p className="cart__name">{p.name}</p>
                      <p className="cart__price">{formatPrice(p.price * item.quantity)}</p>
                    </div>
                    <p className="caption">
                      {color?.name}, tamanho {item.size}
                      {item.quantity > 1 && <>, {formatPrice(p.price)} cada</>}
                    </p>
                    <div className="cart__row cart__row--controls">
                      <div className="stepper stepper--sm" role="group" aria-label={`Quantidade de ${p.name}`}>
                        <button
                          type="button"
                          className="stepper__btn"
                          onClick={() => setQuantity(item.key, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          aria-label="Diminuir quantidade"
                        >
                          <Minus size={14} />
                        </button>
                        <output className="stepper__value" aria-live="polite">
                          {item.quantity}
                        </output>
                        <button
                          type="button"
                          className="stepper__btn"
                          onClick={() => setQuantity(item.key, item.quantity + 1)}
                          disabled={item.quantity >= max}
                          aria-label={item.quantity >= max ? `Limite de ${max} unidades` : 'Aumentar quantidade'}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        type="button"
                        className="icon-btn cart__remove"
                        onClick={() => {
                          removeItem(item.key)
                          toast(`${p.name} saiu da seleção.`, 'info')
                        }}
                        aria-label={`Remover ${p.name} da seleção`}
                      >
                        <Trash2 size={17} strokeWidth={1.6} />
                      </button>
                    </div>
                  </div>
                </motion.li>
              )
            })}
          </AnimatePresence>
        </ul>
      )}
    </Drawer>
  )
}

export function FavoritesPanel() {
  const { panel, closePanel, openQuickView, toast } = useUi()
  const { favorites, toggleFavorite } = useShop()
  const reduce = useReducedMotion()
  const items = favorites.map(productById).filter((p) => !!p)

  return (
    <Drawer
      open={panel === 'favorites'}
      onClose={closePanel}
      title="Favoritos"
      subtitle={items.length ? pluralize(items.length, 'peça salva', 'peças salvas') : undefined}
    >
      {items.length === 0 ? (
        <div className="panel-empty">
          <p className="panel-empty__title">Nenhum favorito ainda.</p>
          <p>Toque no coração de qualquer peça para guardá-la aqui. Os favoritos ficam salvos neste navegador.</p>
          <a href="#catalogo" className="btn" onClick={closePanel}>
            Ver o acervo
          </a>
        </div>
      ) : (
        <ul className="fav__grid">
          <AnimatePresence initial={false}>
            {items.map((p) => (
              <motion.li
                key={p.id}
                layout={!reduce}
                className="fav__item"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <button
                  type="button"
                  className="fav__open"
                  onClick={() => {
                    closePanel()
                    openQuickView(p.id)
                  }}
                  aria-label={`Ver detalhes de ${p.name}`}
                >
                  <span className="photo fav__photo">
                    <Img id={p.images[0].id} alt="" ratio={4 / 3} position={p.images[0].position} sizes="200px" widths={[240, 400]} />
                  </span>
                  <span className="fav__name">{p.name}</span>
                  <span className="caption">{formatPrice(p.price)}</span>
                </button>
                <button
                  type="button"
                  className="text-link fav__remove"
                  onClick={() => {
                    toggleFavorite(p.id)
                    toast(`${p.name} saiu dos favoritos.`, 'info')
                  }}
                >
                  Remover
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </Drawer>
  )
}
