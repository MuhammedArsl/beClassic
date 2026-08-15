import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import LegalPage from '@/components/LegalPage'
import { site } from '@/data/site'

export const metadata: Metadata = {
  title: 'Datenschutz',
  robots: { index: false, follow: true },
}

/**
 * >>> WICHTIG: Dies ist eine Struktur-Vorlage, kein fertiger Rechtstext.
 * Die Datenschutzerklärung muss die tatsächliche Datenverarbeitung abbilden
 * (Hosting, Formular, Schriftarten, Analyse) und sollte vor dem Livegang
 * rechtlich geprüft werden.
 */
export default function DatenschutzPage() {
  return (
    <>
      <Navigation variant="solid" />
      <LegalPage
        eyebrow="Rechtliches"
        title="Datenschutz"
        note="Vorlage — muss an die tatsächliche Datenverarbeitung angepasst und rechtlich geprüft werden."
      >
        <h2>1. Verantwortliche Stelle</h2>
        <p>
          {site.name}
          <br />
          {site.contact.address.street}
          <br />
          {site.contact.address.zip} {site.contact.address.city}
          <br />
          E-Mail: {site.contact.email}
        </p>

        <h2>2. Aufruf dieser Website</h2>
        <p>
          Beim Aufruf dieser Website werden durch den Hosting-Anbieter
          automatisch Informationen in sogenannten Server-Logfiles
          gespeichert — etwa IP-Adresse, Datum und Uhrzeit des Zugriffs,
          aufgerufene Seite, verwendeter Browser und Betriebssystem. Die
          Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO
          zum Zweck des sicheren und stabilen Betriebs der Website.
        </p>
        <p>[Hosting-Anbieter und Speicherdauer ergänzen.]</p>

        <h2>3. Anfrageformular</h2>
        <p>
          Wenn Sie uns über das Anfrageformular kontaktieren, verarbeiten wir
          die von Ihnen angegebenen Daten — Vor- und Nachname, E-Mail-Adresse,
          Telefonnummer, gewünschter Zeitraum, Anlass, Abholort sowie Ihre
          Nachricht — ausschließlich zur Bearbeitung Ihrer Anfrage und für den
          Fall von Anschlussfragen.
        </p>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche
          Maßnahmen) sowie Art. 6 Abs. 1 lit. a DSGVO (Ihre Einwilligung). Sie
          können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft
          widerrufen — eine formlose Nachricht an {site.contact.email} genügt.
        </p>
        <p>
          Die Daten verbleiben bei uns, bis der Zweck der Speicherung entfällt
          oder Sie uns zur Löschung auffordern. Gesetzliche
          Aufbewahrungspflichten bleiben unberührt.
        </p>

        <h2>4. Spam-Schutz im Anfrageformular</h2>
        <p>
          Zum Schutz vor automatisierten Anfragen (Spam-Bots) setzen wir im
          Anfrageformular den Dienst <strong>Cloudflare Turnstile</strong> der
          Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA ein.
          Beim Aufruf des Formulars wird hierzu eine Verbindung zu Servern von
          Cloudflare aufgebaut und Ihre IP-Adresse übermittelt. Turnstile prüft
          anhand technischer Merkmale Ihres Browsers, ob die Eingabe von einem
          Menschen stammt.
        </p>
        <p>
          Nach Angaben des Anbieters werden dabei keine Cookies zu Werbezwecken
          gesetzt und die erhobenen Daten nicht zur Profilbildung verwendet.
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes
          Interesse liegt im Schutz unseres Formulars vor missbräuchlicher
          automatisierter Nutzung.
        </p>
        <p>
          [Sofern erforderlich: Auftragsverarbeitungsvertrag mit Cloudflare
          abschließen und auf die Standardvertragsklauseln für die
          Datenübermittlung in die USA hinweisen. Weitere Informationen:
          cloudflare.com/privacypolicy]
        </p>

        <h2>5. Speicherung und Bearbeitung Ihrer Anfrage</h2>
        <p>
          Ihre Anfrage und der anschließende Nachrichtenverlauf werden in einer
          Datenbank des Anbieters <strong>Supabase</strong> gespeichert, damit
          wir Ihr Anliegen nachvollziehbar bearbeiten und auf Rückfragen
          antworten können. Der Zugriff auf diese Daten ist passwortgeschützt
          und ausschließlich uns möglich.
        </p>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche
          Maßnahmen). Gespeichert werden die im Formular angegebenen Daten
          sowie ein etwaig vereinbarter Termin samt Treffpunkt.
        </p>
        <p>
          [Serverstandort des gewählten Supabase-Projekts eintragen. Bei einem
          Standort außerhalb der EU ist zusätzlich auf die
          Standardvertragsklauseln hinzuweisen. Auftragsverarbeitungsvertrag
          mit Supabase abschließen — supabase.com/legal/dpa]
        </p>

        <h2>6. E-Mail-Versand</h2>
        <p>
          Für den Versand unserer Antworten und Terminbestätigungen setzen wir
          den Dienst <strong>Resend</strong> ein. Dabei werden Ihre
          E-Mail-Adresse und der Inhalt der Nachricht an den Anbieter
          übermittelt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.
        </p>
        <p>
          [Auftragsverarbeitungsvertrag mit Resend abschließen und auf die
          Standardvertragsklauseln für die Datenübermittlung in die USA
          hinweisen — resend.com/legal/dpa]
        </p>

        <h2>7. Schriftarten</h2>
        <p>
          Diese Website bindet die verwendeten Schriftarten lokal vom eigenen
          Server ein. Beim Seitenaufruf wird dadurch keine Verbindung zu
          Servern Dritter aufgebaut und es werden keine Daten an Google
          übertragen.
        </p>

        <h2>8. Cookies und Analyse</h2>
        <p>
          Diese Website setzt derzeit keine Cookies zu Analyse- oder
          Marketingzwecken ein. [Sollte später ein Analyse-Werkzeug oder ein
          Kartendienst eingebunden werden, ist dieser Abschnitt entsprechend zu
          ergänzen — inklusive Einwilligungslösung.]
        </p>

        <h2>9. Ihre Rechte</h2>
        <p>
          Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre
          gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger
          sowie den Zweck der Datenverarbeitung (Art. 15 DSGVO). Darüber hinaus
          stehen Ihnen die Rechte auf Berichtigung (Art. 16), Löschung
          (Art. 17), Einschränkung der Verarbeitung (Art. 18),
          Datenübertragbarkeit (Art. 20) sowie ein Widerspruchsrecht (Art. 21)
          zu.
        </p>
        <p>
          Ihnen steht zudem ein Beschwerderecht bei der Aufsichtsbehörde zu.
          Zuständig ist die Österreichische Datenschutzbehörde,
          Barichgasse 40–42, 1030 Wien (dsb.gv.at).
        </p>

        <h2>10. SSL-/TLS-Verschlüsselung</h2>
        <p>
          Diese Seite nutzt aus Sicherheitsgründen eine SSL-/TLS-Verschlüsselung.
          Eine verschlüsselte Verbindung erkennen Sie daran, dass die
          Adresszeile des Browsers von „http://“ auf „https://“ wechselt.
        </p>
      </LegalPage>
      <Footer />
    </>
  )
}
