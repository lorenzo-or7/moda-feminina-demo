import { Img } from '../components/Img'
import { FadeUp, Magnetic, MaskText, Parallax, RevealImage } from '../components/motion'
import { service } from '../data/editorial'
import { generalMessage, getWhatsappNumber } from '../lib/whatsapp'
import { useUi } from '../store/ui'

export function Service() {
  const { sendInquiry } = useUi()
  const hasNumber = !!getWhatsappNumber()

  return (
    <section id="contato" className="section service" aria-labelledby="service-title">
      <div className="wrap service__grid">
        <div className="service__media">
          <RevealImage direction="left">
            <div className="photo service__photo">
              <Parallax amount={44}>
                <Img id={service.image.id} alt={service.image.alt} ratio={1.3} position={service.image.position} sizes="(min-width: 900px) 40vw, 92vw" />
              </Parallax>
            </div>
          </RevealImage>
        </div>
        <div className="service__content">
          <h2 id="service-title" className="h-section">
            <MaskText lines={['Seu estilo,', 'nossa curadoria.']} />
          </h2>
          <p className="lede">{service.intro}</p>
          <dl className="service__list">
            {service.benefits.map((b, i) => (
              <FadeUp key={b.title} delay={i * 0.07} className="service__item">
                <dt>{b.title}</dt>
                <dd>{b.text}</dd>
              </FadeUp>
            ))}
          </dl>
          <div className="service__cta">
            <Magnetic>
              <button type="button" className="btn" onClick={() => sendInquiry({ title: 'Falar com a boutique', message: generalMessage() })}>
                Falar com a boutique
              </button>
            </Magnetic>
            <p className="caption">
              {hasNumber
                ? 'Abre uma conversa no WhatsApp em nova aba.'
                : 'Demonstração: sem número configurado, a mensagem aparece para você copiar.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
