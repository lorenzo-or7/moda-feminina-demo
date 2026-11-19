import { Img } from '../components/Img'
import { FadeUp, MaskText, Parallax, RevealImage, ScrollWords } from '../components/motion'
import { manifesto } from '../data/editorial'

export function Manifesto() {
  return (
    <section id="sobre" className="section manifesto" aria-labelledby="manifesto-title">
      <div className="wrap manifesto__grid">
        <h2 id="manifesto-title" className="display manifesto__title">
          <MaskText lines={['Estilo além', 'das tendências.']} />
        </h2>

        <div className="manifesto__texture">
          <RevealImage direction="right">
            <div className="photo manifesto__texture-photo">
              <Parallax amount={30}>
                <Img id={manifesto.texture.id} alt={manifesto.texture.alt} ratio={1.2} sizes="(min-width: 900px) 22vw, 45vw" widths={[320, 480, 640]} />
              </Parallax>
            </div>
          </RevealImage>
        </div>

        <ScrollWords text={manifesto.body} className="manifesto__body" />

        <div className="manifesto__portrait">
          <RevealImage>
            <div className="photo manifesto__portrait-photo">
              <Parallax amount={40}>
                <Img id={manifesto.portrait.id} alt={manifesto.portrait.alt} ratio={1.35} position={manifesto.portrait.position} sizes="(min-width: 900px) 30vw, 70vw" />
              </Parallax>
            </div>
          </RevealImage>
        </div>

        <dl className="manifesto__values">
          {manifesto.values.map((v, i) => (
            <FadeUp key={v.title} delay={i * 0.08} className="manifesto__value">
              <dt>{v.title}</dt>
              <dd>{v.text}</dd>
            </FadeUp>
          ))}
        </dl>
      </div>
    </section>
  )
}
