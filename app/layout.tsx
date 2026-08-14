import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import { site } from '@/data/site'
import './globals.css'

/** Display-Serif für Headlines — feine Strichstärken, hoher Kontrast. */
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

/** Geometrische Sans für Fließtext, Labels und Bedienelemente. */
const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-jost',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Klassische Fahrzeuge für besondere Momente`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    'Oldtimer mieten',
    'Hochzeitsauto',
    'Klassiker Vermietung',
    'MG MGA mieten',
    'Oldtimer Fotoshooting',
    'Filmfahrzeug mieten',
  ],
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Klassische Fahrzeuge für besondere Momente`,
    description: site.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — Klassische Fahrzeuge für besondere Momente`,
    description: site.description,
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#f7f4ee',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="antialiased">
        <a
          href="#inhalt"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-6 focus:py-3 focus:text-sm focus:text-cream"
        >
          Zum Inhalt springen
        </a>
        {children}
      </body>
    </html>
  )
}
