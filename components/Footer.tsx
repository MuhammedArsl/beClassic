import Link from 'next/link'
import { site } from '@/data/site'
import Logo from './Logo'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line-invert bg-ink text-cream">
      <div className="mx-auto max-w-[1400px] px-6 py-16 sm:px-10 sm:py-24">
        <div className="grid gap-12 sm:gap-14 md:grid-cols-12">
          {/* Marke */}
          <div className="md:col-span-5">
            <Logo tone="light" />
            <p className="mt-8 max-w-sm text-[1.0625rem] font-normal leading-[1.8] text-cream/65">
              Klassische Fahrzeuge für Hochzeiten, Filmproduktionen, Events und
              besondere Fahrten.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3">
            <p className="eyebrow text-cream/55">Navigation</p>
            {/* Auf dem Handy weiter auseinander: `.tap-area` vergrössert die
                Trefferfläche jedes Links auf 44 px, und die dürfen sich nicht
                gegenseitig überlappen (siehe globals.css). */}
            <ul className="mt-6 space-y-5 sm:space-y-3">
              {site.navigation.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="link-underline tap-area inline-block text-[1.0625rem] font-normal text-cream/75 transition-colors duration-300 hover:text-cream"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontakt */}
          <div className="md:col-span-4">
            <p className="eyebrow text-cream/55">Kontakt</p>
            <ul className="mt-6 space-y-5 sm:space-y-3">
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="link-underline tap-area inline-block text-[1.0625rem] font-normal text-cream/75 transition-colors duration-300 hover:text-cream"
                >
                  {site.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.contact.phoneHref}`}
                  className="link-underline tap-area inline-block text-[1.0625rem] font-normal text-cream/75 transition-colors duration-300 hover:text-cream"
                >
                  {site.contact.phone}
                </a>
              </li>
              {site.social.instagram && (
                <li>
                  <a
                    href={site.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline tap-area inline-flex items-center gap-2 text-[1.0625rem] font-normal text-cream/75 transition-colors duration-300 hover:text-cream"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <rect
                        x="2.5"
                        y="2.5"
                        width="19"
                        height="19"
                        rx="5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="4.2"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                      <circle cx="17.6" cy="6.4" r="1.2" fill="currentColor" />
                    </svg>
                    Instagram
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Fußzeile */}
        <div className="mt-14 flex flex-col gap-6 border-t border-line-invert pt-8 sm:mt-20 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.875rem] font-normal text-cream/50">
            © {year} {site.name}. Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-8">
            <Link
              href="/impressum"
              className="link-underline tap-area inline-block text-[0.875rem] font-normal text-cream/65 transition-colors duration-300 hover:text-cream"
            >
              Impressum
            </Link>
            <Link
              href="/datenschutz"
              className="link-underline tap-area inline-block text-[0.875rem] font-normal text-cream/65 transition-colors duration-300 hover:text-cream"
            >
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
