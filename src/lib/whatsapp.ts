import { brand } from '../config/brand'
import { formatPrice } from './format'

/** Número válido: apenas dígitos, 12 ou 13 caracteres com DDI (ex.: 55 + DDD + número). */
export function getWhatsappNumber(): string | null {
  const digits = String(brand.whatsappNumber ?? '').replace(/\D/g, '')
  return /^\d{12,13}$/.test(digits) ? digits : null
}

export function whatsappUrl(message: string): string | null {
  const number = getWhatsappNumber()
  if (!number) return null
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export interface MessageLine {
  name: string
  color: string
  size: string
  quantity: number
  unitPrice: number
}

export function buildSelectionMessage(lines: MessageLine[]): string {
  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0)
  const items = lines
    .map(
      (l, i) =>
        `${i + 1}. ${l.name}\n   Cor: ${l.color} | Tamanho: ${l.size} | Qtd.: ${l.quantity}\n   ${formatPrice(l.unitPrice * l.quantity)}`,
    )
    .join('\n\n')
  return [
    `Olá, ${brand.name}! Gostaria de consultar a disponibilidade destas peças:`,
    '',
    items,
    '',
    `Subtotal demonstrativo: ${formatPrice(subtotal)}`,
    '',
    'Podem me ajudar com tamanhos e prazos?',
  ].join('\n')
}

export function buildProductMessage(line: Omit<MessageLine, 'quantity'> & { quantity?: number }): string {
  return [
    `Olá, ${brand.name}! Tenho interesse nesta peça:`,
    '',
    `${line.name}`,
    `Cor: ${line.color} | Tamanho: ${line.size}${line.quantity ? ` | Qtd.: ${line.quantity}` : ''}`,
    `Valor demonstrativo: ${formatPrice(line.unitPrice * (line.quantity ?? 1))}`,
    '',
    'Está disponível?',
  ].join('\n')
}

export const generalMessage = () =>
  `Olá, ${brand.name}! Gostaria de atendimento personalizado para escolher algumas peças.`
