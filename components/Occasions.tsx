import Image from 'next/image'
import type { UseCase } from '@/lib/types'
import Reveal from './Reveal'
import SectionIntro from './SectionIntro'

interface OccasionsProps {
  useCases: UseCase[]
}

/**
 * „Für besondere Momente“ — die Anlässe, für die ein Fahrzeug gemietet wird.
 *
 * Layout-Rhythmus: die ersten beiden Anlässe erhalten je eine halbe Breite,
 * alle weiteren stehen zu dritt in einer Reihe. Bei den derzeit fünf Anlässen
 * geht das Raster exakt auf.
 */
export default function Occasions({ useCases }: OccasionsProps) {
  return (
    <section id="vermietung" className="bg-shell py-28 sm:py-36">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
        <SectionIntro
          index="02"
          eyebrow="Vermietung"
          title="Für besondere"
          titleAccent="Momente."
          lede="Ein Klassiker verändert den Charakter eines Tages. Ob als stiller Begleiter einer Trauung oder als Hauptdarsteller vor der Kamera — die Anlässe sind so unterschiedlich wie die Menschen dahinter."
        />

        <div className="mt-20 grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-6 sm:mt-24">
          {useCases.map((useCase, index) => {
            const large = index < 2

            return (
              <article
                key={useCase.id}
                className={`group ${large ? 'md:col-span-3' : 'md:col-span-2'}`}
              >
                <Reveal variant="image" delay={(index % 3) * 90}>
                  <div
                    className={`media-zoom relative w-full overflow-hidden bg-sand ${
                      large ? 'aspect-[3/2]' : 'aspect-[4/5]'
                    }`}
                  >
                    <Image
                      src={useCase.image.src}
                      alt={useCase.image.alt}
                      fill
                      sizes={
                        large
                          ? '(max-width: 768px) 100vw, 50vw'
                          : '(max-width: 768px) 100vw, 33vw'
                      }
                      className="object-cover"
                    />
                    {/* Sehr dezente Abdunklung, damit Bilder ruhiger wirken */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-ink/5 transition-opacity duration-700 group-hover:opacity-0"
                    />
                  </div>
                </Reveal>

                <Reveal delay={(index % 3) * 90 + 70}>
                  <div className="mt-6">
                    <div className="flex items-baseline gap-4">
                      <span className="text-[0.75rem] tracking-[0.24em] text-champagne">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3
                        className={`font-display font-normal text-ink ${
                          large ? 'text-3xl sm:text-[2.125rem]' : 'text-2xl sm:text-[1.75rem]'
                        }`}
                      >
                        {useCase.title}
                      </h3>
                    </div>
                    <p className="mt-4 max-w-md text-[1.0625rem] font-normal leading-[1.8] text-mist">
                      {useCase.description}
                    </p>
                  </div>
                </Reveal>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
