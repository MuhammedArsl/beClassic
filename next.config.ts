import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /**
   * www auf die nackte Domain umleiten.
   *
   * Beide Namen zeigen auf denselben Worker. Ohne Umleitung wäre die Seite
   * unter zwei Adressen erreichbar — für Suchmaschinen doppelter Inhalt.
   * Dauerhaft (308), damit Lesezeichen und Verweise nachziehen.
   *
   * Vorher übernahm das der GoDaddy-Server nebenbei; mit dessen Wegfall
   * blieb www unversorgt und lief in einen Fehler 522.
   */
  async redirects() {
    const vonWww = [{ type: 'host' as const, value: 'www.beclassic.at' }]
    return [
      // Die Wurzel braucht eine eigene Regel. Mit `/:pfad*` passt der
      // Platzhalter auf null Segmente, und Next setzt ihn dann nicht ein —
      // die Startseite landete so auf der wörtlichen Adresse „/:pfad*"
      // und damit auf 404. Unterseiten waren davon nicht betroffen.
      {
        source: '/',
        has: vonWww,
        destination: 'https://beclassic.at/',
        permanent: true,
      },
      // Alles Übrige: `+` verlangt mindestens ein Segment.
      {
        source: '/:pfad+',
        has: vonWww,
        destination: 'https://beclassic.at/:pfad+',
        permanent: true,
      },
    ]
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // Die Platzhalterbilder in /public/images sind SVGs. Sobald echte Fotos
    // (JPG/WebP) hinterlegt sind, koennen die naechsten drei Zeilen entfallen.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

export default nextConfig
