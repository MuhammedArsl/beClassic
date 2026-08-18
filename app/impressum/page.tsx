import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import LegalPage from '@/components/LegalPage'
import { site } from '@/data/site'

export const metadata: Metadata = {
  title: 'Impressum',
  robots: { index: false, follow: true },
}

/**
 * >>> UNVOLLSTÄNDIG — die Seite weist selbst darauf hin.
 *
 * Enthalten sind bisher nur Inhaber und Kontaktdaten. Es fehlen die
 * Pflichtangaben unten; sie sind nachzutragen, sobald sie vorliegen. Die
 * frühere Fassung stand voller Platzhalter samt erfundener Anschrift
 * („Musterstraße 1") — die ist deshalb entfernt.
 *
 * NOCH NACHZUTRAGEN
 *   - Geschäftsanschrift (die echte, siehe data/site.ts → contact.address)
 *   - Gewerbewortlaut laut Gewerbeschein
 *   - UID-Nummer oder Hinweis auf die Kleinunternehmerbefreiung
 *     (§ 6 Abs. 1 Z 27 UStG)
 *   - Firmenbuchnummer und -gericht, falls eingetragen
 *   - zuständige Bezirksverwaltungsbehörde (in Wien: Magistratisches
 *     Bezirksamt) und Kammerzugehörigkeit
 *   - Bildnachweise
 *   Die WKO bietet Mitgliedern dafür einen kostenlosen Impressum-Generator
 *   und eine Rechtsberatung an.
 *
 * RECHTSRAHMEN ÖSTERREICH
 *   Die Offenlegungspflichten ergeben sich aus mehreren Gesetzen zugleich:
 *     § 5 ECG    — Informationspflichten für Diensteanbieter im Internet
 *     § 25 MedienG — Offenlegung für wiederkehrende elektronische Medien
 *     § 14 UGB   — Angaben für im Firmenbuch eingetragene Unternehmen
 *   Ein gewerblicher Fahrzeugverleih ist in Österreich zusätzlich
 *   gewerberechtlich gebunden (GewO 1994): Gewerbewortlaut, Bezirks-
 *   verwaltungsbehörde und Wirtschaftskammer-Zugehörigkeit gehören ins
 *   Impressum.
 */
export default function ImpressumPage() {
  return (
    <>
      <Navigation variant="solid" />
      <LegalPage
        eyebrow="Rechtliches"
        title="Impressum"
        note="Diese Seite wird derzeit überarbeitet."
      >
        <h2>Wird gerade bearbeitet</h2>
        <p>
          Die vollständigen Angaben gemäß § 5 ECG und § 25 MedienG werden
          derzeit zusammengestellt und in Kürze hier veröffentlicht.
        </p>

        <h2>Inhaber</h2>
        <p>{site.owner}</p>

        <h2>Kontakt</h2>
        <p>
          {site.name}
          <br />
          {site.contact.address.city}
          <br />
          Telefon: <a href={`tel:${site.contact.phoneHref}`}>{site.contact.phone}</a>
          <br />
          E-Mail: <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
        </p>

        <h2>Haftung für Inhalte</h2>
        <p>
          Die Inhalte dieser Website wurden mit Sorgfalt erstellt. Für die
          Richtigkeit, Vollständigkeit und Aktualität wird keine Gewähr
          übernommen. Als Diensteanbieter sind wir gemäß §§ 13 bis 18 ECG
          nicht verpflichtet, übermittelte oder gespeicherte fremde
          Informationen zu überwachen oder nach Umständen zu forschen, die
          auf eine rechtswidrige Tätigkeit hinweisen.
        </p>
      </LegalPage>
      <Footer />
    </>
  )
}
