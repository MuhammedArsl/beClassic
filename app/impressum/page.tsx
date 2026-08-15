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
 * >>> WICHTIG: Dies ist eine Struktur-Vorlage, kein fertiger Rechtstext.
 * Bitte durch die eigenen Angaben ersetzen und vor dem Livegang prüfen
 * lassen — die WKO bietet Mitgliedern dafür einen kostenlosen
 * Impressum-Generator und eine Rechtsberatung an.
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
        note="Vorlage — bitte durch die eigenen Angaben ersetzen und rechtlich prüfen lassen."
      >
        <h2>Angaben gemäß § 5 ECG und § 25 MedienG</h2>
        <p>
          {site.name}
          <br />
          {site.contact.address.street}
          <br />
          {site.contact.address.zip} {site.contact.address.city}
          <br />
          {site.contact.address.country}
        </p>

        <h2>Inhaber / vertretungsbefugte Person</h2>
        <p>[Vor- und Nachname]</p>

        <h2>Unternehmensgegenstand</h2>
        <p>
          Vermietung von klassischen Kraftfahrzeugen ohne Beistellung eines
          Lenkers.
          <br />
          [Gewerbewortlaut laut Gewerbeschein eintragen]
        </p>

        <h2>Kontakt</h2>
        <p>
          Telefon: {site.contact.phone}
          <br />
          E-Mail: {site.contact.email}
        </p>

        <h2>Firmenbuch</h2>
        <p>
          [Firmenbuchnummer und Firmenbuchgericht eintragen — entfällt bei
          nicht eingetragenen Einzelunternehmen]
        </p>

        <h2>Umsatzsteuer-Identifikationsnummer</h2>
        <p>
          [UID-Nummer im Format ATU00000000 eintragen — oder Hinweis auf die
          Kleinunternehmerbefreiung gemäß § 6 Abs. 1 Z 27 UStG]
        </p>

        <h2>Gewerbebehörde</h2>
        <p>
          [Zuständige Bezirksverwaltungsbehörde eintragen — in Wien das
          Magistratische Bezirksamt des jeweiligen Bezirks]
        </p>

        <h2>Kammerzugehörigkeit</h2>
        <p>
          Mitglied der Wirtschaftskammer Österreich,
          <br />
          [zuständige Landeskammer und Fachgruppe eintragen]
          <br />
          Anwendbare Rechtsvorschrift: Gewerbeordnung 1994 (GewO), abrufbar
          unter ris.bka.gv.at
        </p>

        <h2>Online-Streitbeilegung</h2>
        <p>
          Bei Streitigkeiten aus einem Online-Vertrag können sich Verbraucher
          an die Internet Ombudsstelle wenden (ombudsstelle.at). Wir sind
          weder bereit noch verpflichtet, an Streitbeilegungsverfahren vor
          einer Verbraucherschlichtungsstelle teilzunehmen.
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

        <h2>Bildnachweise</h2>
        <p>
          Sämtliche Fahrzeugaufnahmen: [Name des Fotografen eintragen].
          <br />
          Die abgebildete Person hat der Veröffentlichung zugestimmt.
        </p>
      </LegalPage>
      <Footer />
    </>
  )
}
