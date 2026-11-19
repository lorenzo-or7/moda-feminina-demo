import type { MouseEvent } from 'react'
import { navLinks } from '../components/Navbar'
import { brand } from '../config/brand'
import { collections } from '../data/editorial'
import type { CollectionId } from '../data/types'
import { getWhatsappNumber } from '../lib/whatsapp'
import { useCatalog } from '../store/catalog'

const year = new Date().getFullYear()

export function Footer() {
  const { showInCatalog } = useCatalog()
  const wa = getWhatsappNumber()

  const goCollection = (e: MouseEvent, id: CollectionId) => {
    e.preventDefault()
    showInCatalog({ collection: id })
  }

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__grid">
          <div className="footer__brand">
            <p className="footer__tag">{brand.tagline}.</p>
            <p className="caption">
              Identidade fictícia criada para demonstração. Não representa uma marca, loja ou empresa real.
            </p>
          </div>

          <nav aria-label="Rodapé: navegação" className="footer__col">
            <h2 className="footer__h">Navegação</h2>
            <ul>
              {navLinks.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`}>{l.label}</a>
                </li>
              ))}
              <li>
                <a href="#catalogo">Catálogo</a>
              </li>
            </ul>
          </nav>

          <nav aria-label="Rodapé: coleções" className="footer__col">
            <h2 className="footer__h">Coleções</h2>
            <ul>
              {collections.map((c) => (
                <li key={c.id}>
                  <a href="#catalogo" onClick={(e) => goCollection(e, c.id)}>
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer__col">
            <h2 className="footer__h">Contato</h2>
            <ul>
              <li>WhatsApp: {wa ? <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer">+{wa}</a> : <span className="footer__muted">a configurar</span>}</li>
              <li>
                E-mail:{' '}
                {brand.contactEmail ? <a href={`mailto:${brand.contactEmail}`}>{brand.contactEmail}</a> : <span className="footer__muted">a configurar</span>}
              </li>
              {brand.socials.map((s) => (
                <li key={s.label}>
                  {s.url ? (
                    <a href={s.url} target="_blank" rel="noopener noreferrer">
                      {s.label}
                    </a>
                  ) : (
                    <span>
                      {s.label} <span className="footer__muted">(a configurar)</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="footer__wordmark" aria-hidden="true">
          {brand.wordmark}
        </p>

        <div className="footer__base">
          <p className="caption">
            Protótipo comercial {year}. Produtos, preços e disponibilidade demonstrativos; nenhuma venda é realizada. Fotografias via Unsplash, sob a Licença Unsplash.
          </p>
          <a className="footer__signature" href={brand.credits.studioUrl} target="_blank" rel="noopener noreferrer">
            {brand.credits.signature}
          </a>
        </div>
      </div>
    </footer>
  )
}
