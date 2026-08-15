import Image from 'next/image'
import type { Vehicle } from '@/lib/types'
import Parallax from './Parallax'
import Reveal from './Reveal'
import SectionIntro from './SectionIntro'

interface VehicleShowcaseProps {
  vehicle: Vehicle
  /**
   * Blendet die Sektionsnummer aus. Auf der Landingpage sind die Sektionen
   * durchnummeriert (01–03); auf einer Fahrzeug-Detailseite ergäbe eine
   * einzelne „01“ keinen Sinn.
   */
  showIndex?: boolean
  /**
   * Umfang der Sektion.
   *
   *   `voll`    — Geschichte, technische Daten und Galerie. Für die
   *               Fahrzeug-Detailseite, auf der genau das erwartet wird.
   *   `kompakt` — Bild, Eckdaten und ein Absatz. Für die Landingpage: dort
   *               soll das Fahrzeug Lust machen, nicht erschöpfend
   *               beschrieben werden. Wer mehr wissen will, fragt an.
   */
  variant?: 'voll' | 'kompakt'
}

/**
 * Die Fahrzeugsektion.
 *
 * Bewusst keine Fahrzeugbörsen-Optik: zuerst die Emotion (Bild, Geschichte),
 * die technischen Daten stehen ruhig daneben statt im Vordergrund.
 * Sämtliche Inhalte stammen aus `data/vehicles.ts`.
 */
export default function VehicleShowcase({
  vehicle,
  showIndex = true,
  variant = 'voll',
}: VehicleShowcaseProps) {
  const compact = variant === 'kompakt'

  // In der kompakten Fassung trägt der erste Absatz die Sektion allein —
  // er ist der stärkste und kommt ohne die folgenden aus.
  const story = compact ? vehicle.story.slice(0, 1) : vehicle.story

  return (
    <section id="fahrzeug" className="relative bg-cream py-28 sm:py-36">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
        <SectionIntro
          index={showIndex ? '01' : undefined}
          eyebrow="Das Fahrzeug"
          title="Ein Klassiker"
          titleAccent="mit Charakter."
          lede={vehicle.intro}
        />
      </div>

      {/* Großformatiges Fahrzeugbild mit dezentem Parallax */}
      <div className="mx-auto mt-20 max-w-[1400px] px-6 sm:mt-24 sm:px-10">
        <Reveal variant="image">
          <Parallax
            className="relative aspect-[4/5] w-full sm:aspect-[16/9] lg:aspect-[21/9]"
            speed={0.14}
          >
            <div className="relative h-full w-full">
              <Image
                src={vehicle.featuredImage.src}
                alt={vehicle.featuredImage.alt}
                fill
                sizes="(max-width: 1400px) 100vw, 1400px"
                className="object-cover"
              />
            </div>
          </Parallax>
        </Reveal>

        {/* Eckdaten als ruhige Linie unter dem Bild */}
        <Reveal delay={120}>
          <dl className="grid grid-cols-2 border-t border-line md:grid-cols-4">
            {vehicle.highlights.map((item, index) => {
              const total = vehicle.highlights.length
              // Trennlinien: mobil 2 Spalten, ab md 4 Spalten in einer Reihe.
              const endOfMobileRow = index % 2 === 1
              const lastCell = index === total - 1
              const inLastMobileRow = index >= total - 2

              return (
                <div
                  key={item.label}
                  className={[
                    'px-2 py-8 sm:px-6',
                    endOfMobileRow ? 'md:border-r md:border-line' : 'border-r border-line',
                    lastCell ? 'md:border-r-0' : '',
                    inLastMobileRow ? '' : 'border-b border-line md:border-b-0',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <dt className="eyebrow">{item.label}</dt>
                  <dd className="mt-3 font-display text-2xl font-normal text-ink sm:text-[1.75rem]">
                    {item.value}
                  </dd>
                </div>
              )
            })}
          </dl>
        </Reveal>
      </div>

      {/* Geschichte — in der vollen Fassung mit den technischen Daten daneben */}
      <div className="mx-auto mt-20 max-w-[1400px] px-6 sm:mt-24 sm:px-10">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          <div className={compact ? 'lg:col-span-8' : 'lg:col-span-7'}>
            <Reveal>
              <p className="eyebrow">Die Geschichte</p>
            </Reveal>
            <div className="mt-8 space-y-7">
              {story.map((paragraph, index) => (
                <Reveal key={index} delay={index * 90}>
                  <p
                    className={`font-normal leading-[1.85] text-mist ${
                      index === 0
                        ? 'text-[1.1875rem] text-ink/85 sm:text-[1.3125rem]'
                        : 'text-[1.0625rem] sm:text-[1.125rem]'
                    }`}
                  >
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Technische Daten: zehn Zeilen sind auf der Landingpage zu viel —
              die vier Eckdaten über dem Text sagen dort das Wesentliche. */}
          {!compact && (
            <div className="lg:col-span-5">
              <Reveal delay={100}>
                <div className="border-t border-ink pt-8">
                  <p className="eyebrow">Technische Daten</p>
                  <dl className="mt-8">
                    {vehicle.specifications.map((spec) => (
                      <div
                        key={spec.label}
                        className="flex items-baseline justify-between gap-6 border-b border-line py-4"
                      >
                        <dt className="text-[1.0625rem] font-normal text-mist">
                          {spec.label}
                        </dt>
                        <dd className="text-right text-[1.0625rem] font-normal text-ink">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            </div>
          )}
        </div>
      </div>

      {/* Bildergalerie — auf der Landingpage übernimmt die Erlebnis-Sektion
          den Bildteil, eine zweite Galerie davor wäre eine Wiederholung. */}
      {!compact && (
        <div className="mx-auto mt-24 max-w-[1400px] px-6 sm:mt-32 sm:px-10">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            {vehicle.images.map((image, index) => (
              <figure
                key={image.src}
                className={image.span === 'wide' ? 'md:col-span-3' : ''}
              >
                <Reveal variant="image" delay={(index % 3) * 100}>
                  <div
                    className={`media-zoom relative w-full overflow-hidden bg-sand ${
                      image.span === 'wide'
                        ? 'aspect-[16/9] lg:aspect-[21/9]'
                        : 'aspect-[4/5]'
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes={
                        image.span === 'wide'
                          ? '(max-width: 1400px) 100vw, 1400px'
                          : '(max-width: 768px) 100vw, 33vw'
                      }
                      className="object-cover"
                    />
                  </div>
                </Reveal>
                {image.caption && (
                  <Reveal delay={(index % 3) * 100 + 80}>
                    <figcaption className="mt-4 text-[0.8125rem] uppercase tracking-[0.2em] text-mist">
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
