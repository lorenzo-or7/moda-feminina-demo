const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export const formatPrice = (value: number) => brl.format(value)

export const pluralize = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`
