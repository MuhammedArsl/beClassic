import { processSteps } from '@/data/site'
import Reveal from './Reveal'

/**
 * Der Ablauf in vier Schritten — als kompakte Liste.
 *
 * Früher eine eigene Sektion über vier Spalten mit je einem Absatz. Das war
 * viel Fläche für eine Aussage, die in eine Zeile passt: „Sie fragen an, wir
 * melden uns persönlich.“ Jetzt steht der Ablauf direkt neben dem Formular,
 * wo er tatsächlich gebraucht wird — als Antwort auf die Frage „was passiert,
 * wenn ich das jetzt abschicke?“.
 */
export default function Process() {
  return (
    <div className="border-t border-line pt-8">
      <p className="eyebrow">Ablauf</p>

      <ol className="mt-6 space-y-4">
        {processSteps.map((step, index) => (
          <Reveal key={step.title} delay={index * 70}>
            <li className="flex gap-4">
              <span className="mt-[0.2rem] shrink-0 font-display text-[0.8125rem] tracking-[0.2em] text-champagne">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-[0.9375rem] font-normal leading-relaxed text-mist">
                <span className="text-ink">{step.title}</span>
                {' — '}
                {step.description}
              </span>
            </li>
          </Reveal>
        ))}
      </ol>
    </div>
  )
}
