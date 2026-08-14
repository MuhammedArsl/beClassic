import Reveal from './Reveal'

interface SectionIntroProps {
  /** Laufende Nummer, z. B. „01“ — sorgt für Rhythmus über die Seite. */
  index?: string
  /** Kleines Label, z. B. „Das Fahrzeug“ */
  eyebrow: string
  /** Große Serif-Überschrift. */
  title: string
  /** Zweite Zeile der Überschrift, kursiv und in Champagner gesetzt. */
  titleAccent?: string
  /** Optionaler Einleitungstext. */
  lede?: string
  tone?: 'dark' | 'light'
  align?: 'left' | 'center'
  className?: string
}

/** Einheitlicher Kopf für alle Sektionen: Label, Headline, optionaler Lede. */
export default function SectionIntro({
  index,
  eyebrow,
  title,
  titleAccent,
  lede,
  tone = 'dark',
  align = 'left',
  className = '',
}: SectionIntroProps) {
  const light = tone === 'light'
  const centered = align === 'center'

  return (
    <div
      className={`${centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'} ${className}`.trim()}
    >
      <Reveal>
        <div
          className={`flex items-center gap-4 ${centered ? 'justify-center' : ''}`}
        >
          {index && (
            <span
              className={`text-[0.8125rem] tracking-[0.28em] ${light ? 'text-champagne-soft' : 'text-champagne'}`}
            >
              {index}
            </span>
          )}
          <span
            aria-hidden="true"
            className={`h-px w-10 ${light ? 'bg-cream/25' : 'bg-line-strong'}`}
          />
          <span
            className={`eyebrow ${light ? 'text-cream/70' : 'text-mist'}`}
          >
            {eyebrow}
          </span>
        </div>
      </Reveal>

      <h2
        className={`display mt-7 text-[clamp(2.25rem,5.2vw,4.25rem)] ${light ? 'text-cream' : 'text-ink'}`}
      >
        <Reveal variant="line" as="span" delay={60}>
          {title}
        </Reveal>
        {titleAccent && (
          <Reveal variant="line" as="span" delay={160}>
            <span
              className={`italic ${light ? 'text-champagne-soft' : 'text-champagne'}`}
            >
              {titleAccent}
            </span>
          </Reveal>
        )}
      </h2>

      {lede && (
        <Reveal delay={240}>
          <p
            className={`lede mt-8 ${centered ? 'mx-auto' : ''} max-w-2xl ${light ? 'text-cream/75' : 'text-mist'}`}
          >
            {lede}
          </p>
        </Reveal>
      )}
    </div>
  )
}
