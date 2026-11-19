import type { CollectionId } from './types'

/** Conteúdo editorial centralizado: troque textos e fotografias aqui. */

export const heroSlides = [
  {
    id: '1571513800374-df1bbe650e56',
    alt: 'Mulher em tons de bege segurando uma flor seca, sob luz natural',
    position: '50% 30%',
    mobilePosition: '58% 30%',
    caption: 'Look de abertura, linho e algodão cru',
  },
  {
    id: '1668952135120-7d997b1b3778',
    alt: 'Mulher com casaco longo em tom neutro',
    position: '50% 25%',
    mobilePosition: '50% 25%',
    caption: 'Casaco longo, alfaiataria macia',
  },
  {
    id: '1747396206869-75ea57b325ce',
    alt: 'Mulher com vestido simples de linho em estúdio claro',
    position: '50% 35%',
    mobilePosition: '50% 35%',
    caption: 'Vestido de linho, coleção Essentials',
  },
]

export interface CollectionEntry {
  id: CollectionId
  name: string
  line: string
  image: { id: string; alt: string; position?: string }
}

export const collections: CollectionEntry[] = [
  {
    id: 'essentials',
    name: 'Essentials',
    line: 'Linho, algodão e cortes que voltam ao armário toda semana.',
    image: { id: '1747396206869-75ea57b325ce', alt: 'Vestido de linho cru em estúdio claro', position: '50% 30%' },
  },
  {
    id: 'contemporary',
    name: 'Contemporary',
    line: 'Alfaiataria relaxada e estampas usadas com calma.',
    image: { id: '1613915617430-8ab0fd7c6baf', alt: 'Retrato em preto e branco de blazer e calça de alfaiataria', position: '50% 30%' },
  },
  {
    id: 'evening',
    name: 'Evening',
    line: 'Cetim, fendas e ouro para quando a noite pede presença.',
    image: { id: '1765870972916-48b69771eb10', alt: 'Vestido longo de cetim magenta em ambiente à meia-luz', position: '50% 30%' },
  },
  {
    id: 'new-season',
    name: 'New Season',
    line: 'Cores quentes, volumes leves e a campanha da estação.',
    image: { id: '1683660107736-1e8a2c02b8d4', alt: 'Vestido longo ferrugem em interior com luz de janela', position: '50% 35%' },
  },
]

export const collectionName = (id: CollectionId) => collections.find((c) => c.id === id)?.name ?? id

export interface Hotspot {
  productId: string
  /** posição em % sobre a fotografia */
  x: number
  y: number
  label: string
}

export interface Look {
  id: string
  numeral: string
  title: string
  text: string
  image: { id: string; alt: string; position?: string }
  hotspots: Hotspot[]
}

export const looks: Look[] = [
  {
    id: 'look-1',
    numeral: 'I',
    title: 'Luz de fim de tarde',
    text: 'Ferrugem e madeira. Um vestido longo que não pede mais nada além de uma janela aberta.',
    image: { id: '1683660107856-cdad7a562d12', alt: 'Mulher com vestido longo ferrugem ao lado de uma janela', position: '50% 35%' },
    hotspots: [{ productId: 'vestido-longo-ferrugem', x: 52, y: 58, label: 'Vestido longo de mangas bufantes' }],
  },
  {
    id: 'look-2',
    numeral: 'II',
    title: 'O giro',
    text: 'Lavanda em movimento. A saia rodada desenha o próprio gesto.',
    image: { id: '1659297949927-06fa02629af0', alt: 'Mulher girando com vestido lavanda em um jardim', position: '50% 40%' },
    hotspots: [{ productId: 'vestido-midi-lavanda', x: 48, y: 55, label: 'Vestido midi rodado' }],
  },
  {
    id: 'look-3',
    numeral: 'III',
    title: 'Depois das oito',
    text: 'Cetim magenta à meia-luz. Brilho na medida de quem não precisa provar nada.',
    image: { id: '1765870972439-d9258966cdce', alt: 'Mulher com longo vestido de cetim magenta em restaurante à meia-luz', position: '50% 30%' },
    hotspots: [{ productId: 'vestido-cetim-magenta', x: 50, y: 62, label: 'Vestido longo de cetim' }],
  },
  {
    id: 'look-4',
    numeral: 'IV',
    title: 'Algodão e silêncio',
    text: 'Camisa branca, saia café e um tecido que respira. O essencial dito em voz baixa.',
    image: { id: '1756887267535-6e25b59fe9c6', alt: 'Mulher com camisa branca e saia marrom diante de um tecido drapeado', position: '50% 30%' },
    hotspots: [{ productId: 'camisa-algodao-offwhite', x: 50, y: 38, label: 'Camisa de algodão' }],
  },
]

export const newCollection = {
  headline: 'The new perspective.',
  name: 'New Season',
  text: 'Ferrugem, lavanda, menta e chocolate. Uma estação de cores quentes e volumes leves, pensada para durar além dela mesma.',
  image: { id: '1700317440744-a126fc87b900', alt: 'Mulher em vestido escuro sentada em um muro de pedra, luz suave', position: '50% 35%' },
  detail: { id: '1789110519607-6176d668fb72', alt: 'Vestido slip verde-menta', position: '50% 25%' },
}

export const manifesto = {
  title: 'Estilo além das tendências.',
  body: 'Escolhemos poucas peças, e escolhemos devagar. Tecidos que envelhecem bem, cortes que respeitam o corpo, cores que conversam entre si. Uma boutique não existe para dizer quem você deve ser. Existe para oferecer bons começos.',
  values: [
    { title: 'Curadoria', text: 'Cada peça passa por prova, toque e lavagem antes de entrar na arara.' },
    { title: 'Identidade', text: 'Nada de uniforme da estação. Combinações que partem de quem veste.' },
    { title: 'Qualidade', text: 'Fibras naturais sempre que possível, costuras que aguentam o uso.' },
    { title: 'Atemporalidade', text: 'Peças que fazem sentido no ano que vem, e no outro.' },
  ],
  texture: { id: '1608424371207-ab70d9d68e80', alt: 'Textura de linho natural em tom areia, com dobras', position: '50% 50%' },
  portrait: { id: '1613423755148-0ff5515d60be', alt: 'Mulher sentada com vestido claro em ambiente quente', position: '50% 30%' },
}

export const service = {
  title: 'Seu estilo, nossa curadoria.',
  intro: 'Atendimento feito por gente, no seu tempo. Conte o que você procura e a boutique responde com sugestões reais do acervo.',
  benefits: [
    { title: 'Atendimento personalizado', text: 'Uma conversa direta sobre ocasião, medidas e preferências.' },
    { title: 'Seleção de peças', text: 'Separamos opções do acervo a partir do que você nos conta.' },
    { title: 'Consultoria de looks', text: 'Sugestões de combinação com o que já existe no seu armário.' },
    { title: 'Contato direto', text: 'Dúvidas sobre tamanho, tecido ou disponibilidade, sem intermediários.' },
  ],
  image: { id: '1618333452884-5c8d211ed2ad', alt: 'Mulher de casaco marrom em escadaria de concreto claro', position: '50% 30%' },
}
