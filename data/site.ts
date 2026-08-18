/**
 * Globale Seiten- und Kontaktdaten.
 *
 * >>> HIER ANPASSEN: Alle mit „TODO“ markierten Werte durch echte Angaben
 * ersetzen. Sie werden in Navigation, Footer, Impressum und den Metadaten
 * verwendet.
 */

export const site = {
  name: 'BeClassic',
  /** Vertretungsbefugte Person — Pflichtangabe im Impressum (§ 5 ECG). */
  owner: 'Yusuf Özcan',
  /** Wird im Logo als feine Unterzeile gesetzt. */
  tagline: 'Klassische Automobile',
  /**
   * Wird als Meta-Beschreibung ausgeliefert und erscheint so im Suchergebnis.
   * Der Ortsbezug steht bewusst im ersten Satz: Danach wird gesucht
   * („Oldtimer mieten Wien“), und Google schneidet hinten ab.
   * Richtwert 150–160 Zeichen.
   */
  description:
    'Oldtimer mieten in Wien: klassische Fahrzeuge für Hochzeit, Fotoshooting, Filmproduktion und Events in ganz Österreich. Persönlich vermittelt, unverbindlich anfragbar.',
  url: 'https://beclassic.at',

  contact: {
    // Die Vorwahl +43 steht für Österreich; `phoneHref` ist dieselbe Nummer
    // ohne Leerzeichen — sie landet im tel:-Link.
    email: 'beclassicvienna@outlook.com',
    phone: '+43 676 4427719',
    phoneHref: '+436764427719',
    /** Erscheint als Einzugsgebiet in den strukturierten Daten. */
    city: 'Wien, Österreich',
    /**
     * Es wird bewusst nur der Ort geführt, keine Straße.
     * Vorher stand hier die erfundene Anschrift „Musterstraße 1, 1010 Wien“ —
     * die lief in die Datenschutzerklärung und in die strukturierten Daten
     * der Startseite und damit als Geschäftsanschrift zu Google. Eine falsche
     * Adresse schadet dort mehr als eine fehlende. Sobald die echte
     * Geschäftsanschrift feststeht, kommt sie hier als `street` und `zip`
     * dazu — Impressum, Datenschutz und schema.org ziehen sie dann von selbst.
     */
    address: {
      city: 'Wien',
      country: 'Österreich',
    },
  },

  social: {
    // Ohne den ?igsh=-Parameter aus dem Teilen-Link: Der ist ein
    // Sitzungs-Kennzeichen von Instagram und gehört nicht in einen
    // dauerhaften Verweis. Leerer String blendet den Link aus.
    instagram: 'https://www.instagram.com/beclassicvienna',
    instagramHandle: '@beclassicvienna',
  },

  /**
   * Sprungmarken innerhalb der One-Page.
   *
   * Die Kopfleiste zeigt bewusst nur die Wortmarke und den Anfrage-Button —
   * diese Liste wird ausschließlich im Footer ausgegeben.
   */
  navigation: [
    { label: 'Fahrzeug', href: '#fahrzeug' },
    { label: 'Vermietung', href: '#vermietung' },
    { label: 'Anfrage', href: '#anfrage' },
  ],
} as const

/**
 * Die vier Schritte des Ablaufs.
 *
 * Die Beschreibungen sind bewusst auf einen Halbsatz gekürzt: Sie stehen
 * neben dem Anfrageformular (siehe components/Process.tsx) und sollen die
 * Aufmerksamkeit dort nicht vom Formular abziehen.
 */
export const processSteps = [
  {
    title: 'Anfrage senden',
    description: 'unverbindlich, in zwei Minuten',
  },
  {
    title: 'Termin bestätigen',
    description: 'wir melden uns persönlich, meist am selben Tag',
  },
  {
    title: 'Fahrzeug übernehmen',
    description: 'am vereinbarten Ort, gepflegt und vollgetankt',
  },
  {
    title: 'Fahrt genießen',
    description: 'der Rest gehört Ihnen',
  },
] as const

/** Auswahl im Anfrageformular. `value` wird an die API übermittelt. */
export const occasionOptions = [
  { value: 'hochzeit', label: 'Hochzeit' },
  { value: 'film', label: 'Film / Fotoshooting' },
  { value: 'event', label: 'Event' },
  { value: 'privat', label: 'Private Fahrt' },
  { value: 'wochenende', label: 'Wochenende' },
  { value: 'sonstiges', label: 'Sonstiges' },
] as const
