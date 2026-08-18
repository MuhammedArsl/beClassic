import Link from 'next/link'
import { site } from '@/data/site'

interface LogoProps {
  /** `light` für helle Schrift auf dunklem Grund. */
  tone?: 'dark' | 'light'
  /** Blendet die feine Unterzeile aus (z. B. in der kompakten Navigation). */
  showTagline?: boolean
  /**
   * Zusatzklassen nur für die Unterzeile — gedacht für Fälle, in denen sie
   * erst ab einer Breite sinnvoll ist (`hidden sm:block` in der Kopfleiste,
   * wo sie auf dem Handy sonst umbricht und an den Knopf stößt).
   */
  taglineClassName?: string
  className?: string
}

/**
 * Wortmarke. Rein typografisch gehalten — sobald eine echte Logodatei
 * vorliegt, kann hier ein <Image> eingesetzt werden.
 */
export default function Logo({
  tone = 'dark',
  showTagline = true,
  taglineClassName = '',
  className = '',
}: LogoProps) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — zur Startseite`}
      className={`group inline-flex flex-col leading-none ${className}`.trim()}
    >
      {/* Auf dem Handy etwas kleiner und enger gesperrt: sonst bleibt in der
          Kopfleiste neben dem Anfrage-Knopf kein Platz mehr. */}
      <span
        className={`font-display text-[1.375rem] font-normal tracking-[0.12em] transition-colors duration-500 sm:text-[1.6rem] sm:tracking-[0.16em] ${
          tone === 'light' ? 'text-cream' : 'text-ink'
        }`}
      >
        {site.name.toUpperCase()}
      </span>
      {showTagline && (
        <span
          className={`mt-1.5 text-[0.6875rem] font-normal uppercase tracking-[0.34em] transition-colors duration-500 ${
            tone === 'light' ? 'text-cream/70' : 'text-mist'
          } ${taglineClassName}`.trim()}
        >
          {site.tagline}
        </span>
      )}
    </Link>
  )
}
