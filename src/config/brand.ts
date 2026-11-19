/**
 * Configuração central da marca.
 * Para personalizar o protótipo para uma cliente, edite apenas este arquivo
 * (e os dados em src/data). Nenhum valor aqui representa uma empresa real.
 */
export const brand = {
  name: 'Maison Elle',
  /** Wordmark exibido na navbar e no rodapé. */
  wordmark: 'Maison Elle',
  tagline: 'Boutique feminina com curadoria editorial',
  campaign: 'Campanha Primavera–Verão 2027',

  /**
   * Número do WhatsApp no formato internacional, somente dígitos (ex.: 5511999999999).
   * Vazio = modo demonstrativo: a mensagem é exibida para copiar, sem destinatário.
   * Também pode ser definido via variável de ambiente VITE_WHATSAPP_NUMBER.
   */
  whatsappNumber: (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) ?? '',

  /** E-mail de contato. Vazio = exibido como "a configurar". */
  contactEmail: '',

  /** Redes sociais. URL vazia = item exibido como "a configurar", sem link. */
  socials: [
    { label: 'Instagram', url: '' },
    { label: 'Pinterest', url: '' },
    { label: 'TikTok', url: '' },
  ],

  credits: {
    studio: 'Or7.dev',
    studioUrl: 'https://or7.dev',
    signature: 'Experience crafted by Or7.dev',
  },
} as const

export type Brand = typeof brand
