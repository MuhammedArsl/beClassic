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
 * Bitte durch die eigenen Angaben ersetzen und vor dem Livegang anwaltlich
 * bzw. über einen Impressumsgenerator prüfen lassen.
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
        <h2>Angaben gemäß § 5 DDG</h2>
        <p>
          {site.name}
          <br />
          {site.contact.address.street}
          <br />
          {site.contact.address.zip} {site.contact.address.city}
          <br />
          {site.contact.address.country}
        </p>

        <h2>Vertreten durch</h2>
        <p>[Vor- und Nachname der vertretungsberechtigten Person]</p>

        <h2>Kontakt</h2>
        <p>
          Telefon: {site.contact.phone}
          <br />
          E-Mail: {site.contact.email}
        </p>

        <h2>Umsatzsteuer-Identifikationsnummer</h2>
        <p>
          Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
          <br />
          [USt-IdNr. eintragen — oder Hinweis auf Kleinunternehmerregelung
          gemäß § 19 UStG]
        </p>

        <h2>Redaktionell verantwortlich</h2>
        <p>
          [Name und Anschrift der verantwortlichen Person, sofern von den
          Angaben oben abweichend]
        </p>

        <h2>Verbraucherstreitbeilegung</h2>
        <p>
          Wir sind nicht bereit und nicht verpflichtet, an
          Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen.
        </p>

        <h2>Haftung für Inhalte</h2>
        <p>
          Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte
          auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
          §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht
          verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
          überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
          Tätigkeit hinweisen.
        </p>

        <h2>Bildnachweise</h2>
        <p>[Fotograf / Bildquellen eintragen]</p>
      </LegalPage>
      <Footer />
    </>
  )
}
