import { processSteps } from '@/data/site'
import Reveal from './Reveal'
import SectionIntro from './SectionIntro'

/**
 * Der Ablauf in vier Schritten.
 *
 * Bewusst kein Buchungsfunnel: die Sektion soll die Hemmschwelle senken und
 * deutlich machen, dass am Ende ein persönliches Gespräch steht.
 */
export default function Process() {
  return (
    <section className="bg-cream py-28 sm:py-36">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
        <SectionIntro
          index="04"
          eyebrow="Ablauf"
          title="Vier Schritte,"
          titleAccent="mehr nicht."
          lede="Keine Online-Buchung, keine Vorkasse. Sie schildern uns Ihren Anlass — den Rest klären wir persönlich."
        />

        <div className="mt-20 grid grid-cols-1 gap-x-8 gap-y-12 border-t border-line pt-4 sm:mt-24 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, index) => (
            <Reveal key={step.title} delay={index * 110}>
              <div className="relative pt-10">
                {/* Nummer als feiner Anker über dem Text */}
                <span className="absolute left-0 top-0 font-display text-[1rem] tracking-[0.2em] text-champagne">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <h3 className="font-display text-[1.75rem] font-normal leading-snug text-ink">
                  {step.title}
                </h3>
                <p className="mt-4 text-[1.0625rem] font-normal leading-[1.8] text-mist">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
