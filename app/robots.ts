import type { MetadataRoute } from 'next'
import { site } from '@/data/site'

/**
 * robots.txt
 *
 * Cloudflare liefert für die Domain bereits eine verwaltete robots.txt aus
 * (sie sperrt KI-Sammler wie GPTBot und CCBot aus und erlaubt Suchmaschinen).
 * Was ihr fehlt, sind die beiden Angaben, die nur die Anwendung kennt: wo die
 * Sitemap liegt und dass das Dashboard nichts im Index verloren hat.
 *
 * `/admin` ist ohnehin durch Anmeldung geschützt und leitet auf die Anmeldung
 * um — aber eine Weiterleitung kostet den Crawler trotzdem einen Besuch, und
 * die Anmeldeseite selbst ist öffentlich erreichbar.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  }
}
