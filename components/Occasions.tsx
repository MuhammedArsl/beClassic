import Image from 'next/image'
import type { UseCase, VehicleImage } from '@/lib/types'
import Parallax from './Parallax'
import Reveal from './Reveal'
import SectionIntro from './SectionIntro'

interface OccasionsProps {
  useCases: UseCase[]
  /** Grossformatige Aufnahmen aus `data/occasions.ts`. */
  images: VehicleImage[]
}

/**
 * „Für besondere Momente“ — Anlässe und Erlebnis in einer Sektion.
 *
 * Früher waren das zwei getrennte Abschnitte: erst fünf Anlässe mit je einem
 * eigenen Bild, dann ein dunkler Bildteil. Zusammen waren das zehn Bilder und
 * viel Text für eine einzige Aussage — nämlich wofür man den Wagen mietet.
 *
 * Jetzt trägt die Sektion die Anlässe als knappe Textliste und lässt die
 * Bilder danach für sich sprechen. Der dunkle Grund setzt weiterhin die
 * Zäsur zwischen Fahrzeug und Anfrage.
 */
export default function Occasions({ useCases, images }: OccasionsProps) {
  const [lead, ...rest] = images

  return (
    <section id="vermietung" className="relative bg-ink py-28 text-cream sm:py-36">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
        <SectionIntro
          index="02"
          eyebrow="Vermietung"
          title="Für besondere"
          titleAccent="Momente."
          tone="light"
        />

        {/* Anlässe als ruhige Liste — je Anlass eine Zeile, kein Bild. */}
        <ul className="mt-16 grid grid-cols-1 gap-x-16 border-t border-line-invert sm:mt-20 sm:grid-cols-2">
          {useCases.map((useCase, index) => (
            <li key={useCase.id} className="border-b border-line-invert">
              <Reveal delay={(index % 2) * 80}>
                <div className="py-7">
                  <h3 className="font-display text-[1.625rem] font-normal leading-snug text-cream sm:text-[1.875rem]">
                    {useCase.title}
                  </h3>
                  <p className="mt-2 max-w-md text-[1rem] font-normal leading-[1.75] text-cream/60">
                    {useCase.description}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      {/* Grosses, ruhiges Bild über die volle Breite */}
      {lead && (
        <div className="mt-20 sm:mt-24">
          <Reveal variant="image">
            <Parallax
              className="relative aspect-[4/5] w-full sm:aspect-[16/9] lg:aspect-[2.4/1]"
              speed={0.18}
            >
              <div className="relative h-full w-full">
                <Image
                  src={lead.src}
                  alt={lead.alt}
                  fill
                  sizes="100vw"
                  className="object-cover opacity-90"
                />
              </div>
            </Parallax>
          </Reveal>
        </div>
      )}

      {/* Versetztes Bildpaar — die rechte Spalte läuft tiefer */}
      {rest.length > 0 && (
        <div className="mx-auto mt-6 max-w-[1400px] px-6 sm:mt-8 sm:px-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
            {rest.map((image, index) => (
              <figure
                key={image.src}
                className={index % 2 === 1 ? 'sm:mt-20 lg:mt-28' : ''}
              >
                <Reveal variant="image" delay={index * 100}>
                  <div className="media-zoom relative aspect-[4/5] w-full overflow-hidden bg-graphite sm:aspect-[3/4]">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover opacity-90 transition-opacity duration-700 hover:opacity-100"
                    />
                  </div>
                </Reveal>
                {image.caption && (
                  <Reveal delay={index * 100 + 80}>
                    <figcaption className="mt-4 text-[0.8125rem] uppercase tracking-[0.24em] text-cream/55">
                      {image.caption}
                    </figcaption>
                  </Reveal>
                )}
              </figure>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
