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
  url: 'https://beclassic.de',

  contact: {
    // TODO: echte Kontaktdaten eintragen
    email: 'anfrage@beclassic.de',
    phone: '+49 000 0000000',
    phoneHref: '+490000000000',
    city: 'Deutschland',
    /** Optional: vollständige Adresse für Impressum und Footer. */
    address: {
      street: 'Musterstraße 1',
      zip: '00000',
      city: 'Musterstadt',
      country: 'Deutschland',
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

/** Die vier Schritte des Ablaufs — bewusst schlicht gehalten. */
export const processSteps = [
  {
    title: 'Anfrage senden',
    description:
      'Ein kurzes Formular genügt. Erzählen Sie uns von Ihrem Anlass, dem Datum und Ihren Wünschen.',
  },
  {
    title: 'Termin bestätigen',
    description:
      'Wir melden uns persönlich, klären Verfügbarkeit und Details und senden Ihnen ein individuelles Angebot.',
  },
  {
    title: 'Fahrzeug übernehmen',
    description:
      'Übergabe am vereinbarten Ort — gepflegt, vollgetankt und mit einer ruhigen Einweisung.',
  },
  {
    title: 'Fahrt genießen',
    description:
      'Der Rest gehört Ihnen. Wir bleiben im Hintergrund erreichbar, falls Sie etwas brauchen.',
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
