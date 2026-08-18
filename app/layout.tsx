import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import { site } from '@/data/site'
import { featuredVehicle } from '@/data/vehicles'
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

/** Für den Alternativtext des Vorschaubildes. */
const vehicleName = featuredVehicle.name

/**
 * Seitentitel — die wichtigste einzelne Zeile für die Auffindbarkeit.
 *
 * Vorher: „Klassische Fahrzeuge für besondere Momente“. Schön, aber es
 * enthält keinen Begriff, nach dem jemand sucht. Gesucht wird nach der
 * Leistung plus dem Ort: „Oldtimer mieten Wien“. Genau das steht jetzt
 * vorn — Google gewichtet den Anfang des Titels am stärksten und schneidet
 * nach etwa 60 Zeichen ab.
 */
const titel = `${site.name} — Oldtimer mieten in Wien`

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: titel,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  /**
   * Kanonische Adresse. Die Seite ist unter beclassic.at und www erreichbar
   * (www leitet per 308 um, siehe next.config.ts). Der Canonical sagt Google
   * zusätzlich unmissverständlich, welche der beiden zählt — sonst kann sich
   * über geteilte Links die falsche Variante im Index festsetzen.
   */
  alternates: { canonical: '/' },
  // Die Begriffe zielen bewusst auf Wien und Österreich — dort steht das
  // Fahrzeug, und ohne Ortsbezug konkurriert die Seite sinnlos mit dem
  // gesamten deutschsprachigen Raum.
  keywords: [
    'Oldtimer mieten Wien',
    'Hochzeitsauto Wien',
    'Oldtimer Hochzeit Österreich',
    'Klassiker Vermietung Wien',
    'MG MGA mieten',
    'MG MGA 1500 mieten',
    'Oldtimer Fotoshooting Wien',
    'Filmfahrzeug mieten Österreich',
  ],
  openGraph: {
    type: 'website',
    // de_AT statt de_DE: Das ist die Auszeichnung, an der Facebook, WhatsApp
    // und LinkedIn den Sprachraum ablesen.
    locale: 'de_AT',
    url: site.url,
    siteName: site.name,
    title: titel,
    description: site.description,
    /**
     * Ohne Bild zeigt ein geteilter Link nur eine graue Fläche mit Text —
     * bei einem Angebot, das ausschließlich über das Aussehen des Fahrzeugs
     * verkauft, der teuerste Fehler beim Teilen. Bisher war
     * `card: 'summary_large_image'` gesetzt, ohne dass je ein Bild
     * dazugehörte; die Karte blieb deshalb leer.
     */
    images: [
      {
        url: '/images/mg-mga-roadster/hero.jpg',
        width: 2800,
        height: 1866,
        alt: `${vehicleName} vor der Wiener Hofburg`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: titel,
    description: site.description,
    images: ['/images/mg-mga-roadster/hero.jpg'],
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
    <html lang="de-AT" className={`${cormorant.variable} ${jost.variable}`}>
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
