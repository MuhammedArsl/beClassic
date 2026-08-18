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
    <section id="fahrzeug" className="relative bg-cream py-20 sm:py-36">
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
      <div className="mx-auto mt-12 max-w-[1400px] px-6 sm:mt-24 sm:px-10">
        <Reveal variant="image">
          {/* Die Fotos sind durchweg 3:2-Querformat. Im früheren 4/5-Rahmen
              blieben davon auf dem Handy nur 53 % der Bildbreite übrig — der
              Wagen wurde vorn und hinten abgeschnitten. Mobil steht das Bild
              deshalb in seinem eigenen Format, erst ab sm wird beschnitten,
              wo die Breite dafür reicht. */}
          <Parallax
            className="relative aspect-[3/2] w-full sm:aspect-[16/9] lg:aspect-[21/9]"
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

              /* Das Raster hat zwei Zustände: mobil zwei Spalten, ab md vier.
                 Beide brauchen ihre eigenen Trennlinien und ihre eigene
                 Einrückung — sonst stand die erste Spalte um die Zellen-
                 polsterung eingerückt neben der Überschrift, und die letzte
                 Zelle bekam eine Linie zu viel.

                 Regel: Linie rechts überall ausser am Zeilenende, Linie
                 unten überall ausser in der letzten Zeile, Polsterung nur
                 dort, wo eine Nachbarzelle daneben steht. */
              const atRowStart = { mobile: index % 2 === 0, desktop: index % 4 === 0 }
              const atRowEnd = {
                mobile: index % 2 === 1 || index === total - 1,
                desktop: index % 4 === 3 || index === total - 1,
              }
              const inLastRow = {
                mobile: index >= (Math.ceil(total / 2) - 1) * 2,
                desktop: index >= (Math.ceil(total / 4) - 1) * 4,
              }

              return (
                <div
                  key={item.label}
                  className={[
                    'py-7 sm:py-8',
                    atRowStart.mobile
                      ? atRowStart.desktop
                        ? ''
                        : 'md:pl-6'
                      : 'pl-4 sm:pl-6',
                    atRowEnd.mobile
                      ? atRowEnd.desktop
                        ? ''
                        : 'md:pr-6'
                      : 'pr-4 sm:pr-6',
                    atRowEnd.mobile
                      ? atRowEnd.desktop
                        ? ''
                        : 'md:border-r md:border-line'
                      : atRowEnd.desktop
                        ? 'border-r border-line md:border-r-0'
                        : 'border-r border-line',
                    inLastRow.mobile
                      ? inLastRow.desktop
                        ? ''
                        : 'md:border-b md:border-line'
                      : inLastRow.desktop
                        ? 'border-b border-line md:border-b-0'
                        : 'border-b border-line',
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
      <div className="mx-auto mt-16 max-w-[1400px] px-6 sm:mt-24 sm:px-10">
        <div className="grid gap-12 sm:gap-16 lg:grid-cols-12 lg:gap-20">
          <div className={`min-w-0 ${compact ? 'lg:col-span-8' : 'lg:col-span-7'}`}>
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
            <div className="min-w-0 lg:col-span-5">
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
                        ? 'aspect-[3/2] sm:aspect-[16/9] lg:aspect-[21/9]'
                        : // Unterhalb von md steht die Galerie einspaltig über
                          // die volle Breite — dort passt das Originalformat.
                          'aspect-[3/2] md:aspect-[4/5]'
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
