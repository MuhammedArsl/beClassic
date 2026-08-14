import Image from 'next/image'
import type { Vehicle, VehicleImage } from '@/lib/types'
import Parallax from './Parallax'
import Reveal from './Reveal'

interface LifestyleProps {
  vehicle: Vehicle
  images: VehicleImage[]
}

/**
 * Erlebnis-Sektion.
 *
 * Der einzige dunkle Abschnitt der Seite — er setzt eine Zäsur zwischen
 * Vermietung und Ablauf und lässt die Bilder ohne Erklärung wirken.
 * Bewusst textarm gehalten.
 */
export default function Lifestyle({ vehicle, images }: LifestyleProps) {
  const [first, ...rest] = images

  return (
    <section className="relative bg-ink py-28 text-cream sm:py-36">
      {/* Kurzer, ruhiger Auftakt — mehr Text braucht dieser Bereich nicht. */}
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
        <div className="max-w-3xl">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="text-[0.8125rem] tracking-[0.28em] text-champagne-soft">
                03
              </span>
              <span aria-hidden="true" className="h-px w-10 bg-cream/25" />
              <span className="eyebrow text-cream/70">Das Erlebnis</span>
            </div>
          </Reveal>

          <h2 className="display mt-7 text-[clamp(2.25rem,5.2vw,4.25rem)] text-cream">
            <Reveal variant="line" as="span" delay={60}>
              Nicht nur ein Auto.
            </Reveal>
            <Reveal variant="line" as="span" delay={160}>
              <span className="italic text-champagne-soft">
                Ein Teil der Erinnerung.
              </span>
            </Reveal>
          </h2>
        </div>
      </div>

      {/* Großes, ruhiges Bild über die volle Breite */}
      {first && (
        <div className="mt-20 sm:mt-24">
          <Reveal variant="image">
            <Parallax
              className="relative aspect-[4/5] w-full sm:aspect-[16/9] lg:aspect-[2.4/1]"
              speed={0.18}
            >
              <div className="relative h-full w-full">
                <Image
                  src={first.src}
                  alt={first.alt}
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

      {/* Ein einziger Satz als Abbinder */}
      <div className="mx-auto mt-24 max-w-[1400px] px-6 sm:mt-32 sm:px-10">
        <Reveal>
          <p className="mx-auto max-w-3xl text-center font-display text-[clamp(1.5rem,3.2vw,2.5rem)] font-normal italic leading-[1.35] text-cream/80">
            „Am Ende erinnert sich niemand an das Fahrzeug — sondern an den Tag,
            an dem man darin saß.“
          </p>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-8 text-center text-[0.75rem] uppercase tracking-[0.28em] text-cream/50">
            {vehicle.name}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
