import Link from 'next/link'
import { site } from '@/data/site'

interface LogoProps {
  /** `light` für helle Schrift auf dunklem Grund. */
  tone?: 'dark' | 'light'
  /** Blendet die feine Unterzeile aus (z. B. in der kompakten Navigation). */
  showTagline?: boolean
  className?: string
}

/**
 * Wortmarke. Rein typografisch gehalten — sobald eine echte Logodatei
 * vorliegt, kann hier ein <Image> eingesetzt werden.
 */
export default function Logo({
  tone = 'dark',
  showTagline = true,
  className = '',
}: LogoProps) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — zur Startseite`}
      className={`group inline-flex flex-col leading-none ${className}`.trim()}
    >
      <span
        className={`font-display text-2xl font-normal tracking-[0.16em] transition-colors duration-500 sm:text-[1.6rem] ${
          tone === 'light' ? 'text-cream' : 'text-ink'
        }`}
      >
        {site.name.toUpperCase()}
      </span>
      {showTagline && (
        <span
          className={`mt-1.5 text-[0.6875rem] font-normal uppercase tracking-[0.34em] transition-colors duration-500 ${
            tone === 'light' ? 'text-cream/70' : 'text-mist'
          }`}
        >
          {site.tagline}
        </span>
      )}
    </Link>
  )
}
