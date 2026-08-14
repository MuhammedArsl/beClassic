import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Reveal from '@/components/Reveal'
import SectionIntro from '@/components/SectionIntro'
import { availableVehicles } from '@/data/vehicles'

export const metadata: Metadata = {
  title: 'Fahrzeuge',
  description:
    'Unsere klassischen Fahrzeuge für Hochzeiten, Filmproduktionen, Events und besondere Fahrten.',
}

/**
 * Fahrzeugübersicht.
 *
 * Rendert automatisch alle verfügbaren Fahrzeuge aus `data/vehicles.ts`.
 * Solange nur ein Fahrzeug gepflegt ist, bleibt die Landingpage der
 * Haupteinstieg — diese Seite ist bereits vorbereitet und wird mit jedem
 * weiteren Fahrzeug von selbst voller.
 */
export default function VehiclesPage() {
  return (
    <>
      <Navigation variant="solid" />

      <main id="inhalt" className="bg-cream pt-40 sm:pt-48">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
          <SectionIntro
            eyebrow="Die Flotte"
            title="Unsere"
            titleAccent="Klassiker."
            lede="Sorgfältig ausgewählt, gepflegt und bereit für Ihren Anlass. Jedes Fahrzeug erzählt seine eigene Geschichte."
          />

          <div className="mt-20 grid grid-cols-1 gap-x-8 gap-y-16 pb-32 md:grid-cols-2">
            {availableVehicles.map((vehicle, index) => (
              <article key={vehicle.slug} className="group">
                <Link href={`/fahrzeuge/${vehicle.slug}`}>
                  <Reveal variant="image" delay={index * 100}>
                    <div className="media-zoom relative aspect-[3/2] w-full overflow-hidden bg-sand">
                      <Image
                        src={vehicle.featuredImage.src}
                        alt={vehicle.featuredImage.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  </Reveal>

                  <Reveal delay={index * 100 + 80}>
                    <div className="mt-6">
                      <p className="eyebrow">{vehicle.eyebrow}</p>
                      <h2 className="mt-3 font-display text-[2rem] font-normal text-ink">
                        {vehicle.name}
                      </h2>
                      <p className="mt-3 max-w-md text-[1.0625rem] font-normal leading-[1.8] text-mist">
                        {vehicle.intro}
                      </p>
                      <span className="link-underline mt-6 inline-block text-[0.875rem] uppercase tracking-[0.22em] text-ink">
                        Fahrzeug ansehen
                      </span>
                    </div>
                  </Reveal>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
