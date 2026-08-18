import type { MetadataRoute } from 'next'
import { site } from '@/data/site'

/**
 * sitemap.xml
 *
 * Enthält nur die Startseite. Das ist kein Versehen: Die Seite ist eine
 * One-Page, und Impressum wie Datenschutz stehen selbst auf `noindex`
 * (siehe deren `metadata`). Eine Adresse in die Sitemap zu schreiben und sie
 * gleichzeitig aus dem Index zu halten, ist ein Widerspruch, den Google in
 * der Search Console als Fehler meldet.
 *
 * Kommen später die Fahrzeug-Unterseiten aus `app/_spaeter/` dazu, gehören
 * sie hier hinein — am besten aus `vehicles` erzeugt, damit die Liste nicht
 * getrennt gepflegt werden muss.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${site.url}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
