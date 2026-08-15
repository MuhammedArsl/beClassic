/**
 * Globale Seiten- und Kontaktdaten.
 *
 * >>> HIER ANPASSEN: Alle mit „TODO“ markierten Werte durch echte Angaben
 * ersetzen. Sie werden in Navigation, Footer, Impressum und den Metadaten
 * verwendet.
 */

export const site = {
  name: 'BeClassic',
  /** Wird im Logo als feine Unterzeile gesetzt. */
  tagline: 'Klassische Automobile',
  description:
    'Klassische Fahrzeuge für Hochzeiten, Filmproduktionen, Events und besondere Fahrten. Persönlich vermittelt, sorgfältig gepflegt, unverbindlich anfragbar.',
  /** TODO: Produktions-Domain eintragen (wichtig für SEO und Social-Vorschau). */
  url: 'https://beclassic.at',

  contact: {
    // TODO: echte Kontaktdaten eintragen.
    // Die Vorwahl +43 steht für Österreich; `phoneHref` ist dieselbe Nummer
    // ohne Leerzeichen — sie landet im tel:-Link.
    email: 'anfrage@beclassic.at',
    phone: '+43 000 0000000',
    phoneHref: '+430000000000',
    /** Erscheint als Einzugsgebiet in den strukturierten Daten. */
    city: 'Wien, Österreich',
    /** Optional: vollständige Adresse für Impressum und Footer. */
    address: {
      street: 'Musterstraße 1',
      zip: '1010',
      city: 'Wien',
      country: 'Österreich',
    },
  },

  social: {
    // TODO: echten Instagram-Handle eintragen. Leerer String blendet den Link aus.
    instagram: 'https://instagram.com/beclassic',
    instagramHandle: '@beclassic',
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
