import type { Vehicle } from '@/lib/types'

/**
 * ZENTRALE FAHRZEUG-DATENQUELLE
 * ─────────────────────────────
 * Jedes Fahrzeug der Flotte ist genau ein Objekt in diesem Array. Die
 * Landingpage, die Übersicht unter /fahrzeuge und die Detailseiten unter
 * /fahrzeuge/[slug] lesen alle aus dieser Datei.
 *
 * NEUES FAHRZEUG ERGÄNZEN
 *   1. Objekt nach dem Vorbild unten anlegen (eindeutigen `slug` vergeben).
 *   2. Bilder unter /public/images/<slug>/ ablegen und hier verlinken.
 *   3. `order` vergeben — kleinere Zahl erscheint weiter vorne.
 *   Fertig. Alle Seiten aktualisieren sich automatisch.
 *
 * Solange nur ein Fahrzeug verfügbar ist, steht dieses über
 * `featuredVehicle` im Mittelpunkt der Landingpage.
 *
 * >>> HIER ANPASSEN: Die Angaben unten beschreiben einen MG MGA 1500 Roadster
 * (Baureihe 1955 bis Mai 1959 — danach löste der 1600 sie ab). Bitte Baujahr,
 * Farbe, Ausstattung und die persönlichen Textstellen an das tatsächliche
 * Fahrzeug anpassen.
 */

const mgaRoadster: Vehicle = {
  slug: 'mg-mga-roadster',
  name: 'MG MGA 1500 Roadster',
  make: 'MG',
  model: 'MGA 1500 Roadster',
  /* TODO: exaktes Baujahr eintragen.
     1959 ist für einen 1500 möglich, aber knapp: Die Baureihe lief nur bis
     Mai 1959. Bitte gegen die Fahrzeugpapiere prüfen — der Wert erscheint
     auf der Startseite in den Eckdaten und in der Zeile über dem Titel. */
  year: 1959,
  category: 'klassiker',
  eyebrow: 'Britischer Roadster · 1959',
  tagline: 'Ein Klassiker mit Charakter.',
  intro:
    'Offen, leicht und unverwechselbar britisch. Der MGA gehört zu den schönsten Formen, die je aus Abingdon kamen — und er fährt sich genau so, wie er aussieht.',
  /* Der erste Absatz trägt die Startseite allein — dort wird die Geschichte
     auf einen Absatz gekürzt (siehe components/VehicleShowcase.tsx,
     variant="kompakt"). Alle drei erscheinen auf der späteren Detailseite. */
  story: [
    'Als MG 1955 den MGA vorstellte, war das ein Bruch mit allem, was die Marke bis dahin gebaut hatte. Statt der aufrechten Vorkriegsform des MG TF kam eine tief gezogene, fließende Karosserie, deren Linie direkt aus dem Rennsport stammte — aus den Le-Mans-Erfahrungen, die MG in den Jahren zuvor gesammelt hatte. Der 1500 ist diese erste, unverfälschte Ausbaustufe.',
    'Unter der langen Haube arbeitet der 1489 cm³ große Vierzylinder der BMC-B-Serie: rund 72 PS, ein Vierganggetriebe, Trommelbremsen an allen vier Rädern. Kein Servo, keine Assistenz, keine Dämmung zwischen Ihnen und der Straße — so direkt fährt sich heute kein Auto mehr.',
    'Was bleibt, ist das Wesentliche: das Geräusch des Vierzylinders, der Fahrtwind, das große dünne Lenkrad in den Händen. Ein Auto, das nicht schnell sein muss, um besonders zu wirken — und das auf jeder Hochzeit, jedem Set und jeder Landstraße sofort zum Mittelpunkt wird.',
  ],
  /* Diese vier Eckdaten sind auf der Startseite die einzige Technik-Angabe —
     die vollständige Tabelle steht dort nicht mehr. Deshalb gehört der
     Hubraum hierher: Er unterscheidet den 1500 vom 1600. */
  highlights: [
    { label: 'Baujahr', value: '1959' },
    { label: 'Motor', value: '1,5 Liter' },
    { label: 'Sitzplätze', value: '2 Personen' },
    { label: 'Verdeck', value: 'Offen fahrbar' },
  ],
  specifications: [
    { label: 'Fahrzeug', value: 'MG MGA 1500 Roadster' },
    { label: 'Baujahr', value: '1959' },
    { label: 'Motor', value: '1,5 Liter Reihenvierzylinder (1489 cm³)' },
    { label: 'Leistung', value: 'ca. 72 PS' },
    { label: 'Getriebe', value: '4-Gang, manuell' },
    { label: 'Antrieb', value: 'Hinterradantrieb' },
    // Scheibenbremsen vorn kamen erst mit dem 1600 — der 1500 hat Trommeln.
    { label: 'Bremsen', value: 'Trommeln rundum' },
    { label: 'Sitzplätze', value: '2' },
    { label: 'Höchstgeschwindigkeit', value: 'ca. 155 km/h' },
    { label: 'Karosserie', value: 'Roadster, offen' },
    { label: 'Farbe', value: 'Old English White' }, // TODO: tatsächliche Farbe eintragen
  ],
  /* Das Hero-Bild trägt die Startseite. Die Wahl fiel auf die Seitenansicht
     vor der Hofburg, weil der Hero seine Schrift unten links setzt: Dort
     liegt in dieser Aufnahme leerer Asphalt, das Fahrzeug steht frei
     darüber. Aufnahmen mit dem Wagen im unteren Bilddrittel würden von der
     Headline überdeckt. Zweite Wahl wäre portrait.jpg. */
  heroImage: {
    src: '/images/mg-mga-roadster/hero.jpg',
    alt: 'MG MGA 1500 Roadster in der Seitenansicht vor der Wiener Hofburg',
  },
  featuredImage: {
    src: '/images/mg-mga-roadster/portrait.jpg',
    alt: 'MG MGA 1500 Roadster im Abendlicht vor dem Kunsthistorischen Museum in Wien',
  },
  images: [
    {
      src: '/images/mg-mga-roadster/galerie-01.jpg',
      alt: 'MG MGA 1500 Roadster von hinten vor dem Kunsthistorischen Museum',
      caption: 'Abfahrt bei letztem Licht',
      span: 'wide',
    },
    {
      src: '/images/mg-mga-roadster/galerie-02.jpg',
      alt: 'MGA-Emblem und Le-Mans-Schriftzug auf der Fronthaube',
      caption: 'Emblem und Schriftzug im Original',
    },
    {
      src: '/images/mg-mga-roadster/galerie-03.jpg',
      alt: 'MG MGA 1500 Roadster in der Seitenansicht mit geöffneter Motorhaube',
      caption: 'Vor der Ausfahrt',
    },
    {
      src: '/images/mg-mga-roadster/galerie-04.jpg',
      alt: 'Drehzahlmesser und Rundinstrumente im Armaturenbrett',
      caption: 'Instrumente ohne Ablenkung',
    },
    {
      src: '/images/mg-mga-roadster/galerie-05.jpg',
      alt: 'Blick von oben in den offenen Innenraum mit Sitzen und Windschutzscheibe',
      caption: 'Offen',
      span: 'wide',
    },
    {
      src: '/images/mg-mga-roadster/galerie-06.jpg',
      alt: 'MG MGA 1500 Roadster in der Abenddämmerung',
      caption: 'Später Abend',
      span: 'wide',
    },
  ],
  availableUses: ['hochzeit', 'film', 'event', 'wochenende', 'privat'],
  available: true,
  order: 1,
}

/** Alle Fahrzeuge der Flotte. Weitere Einträge hier ergänzen. */
export const vehicles: Vehicle[] = [mgaRoadster]

/** Nur verfügbare Fahrzeuge, in definierter Reihenfolge. */
export const availableVehicles: Vehicle[] = vehicles
  .filter((vehicle) => vehicle.available)
  .sort((a, b) => a.order - b.order)

/**
 * Das Fahrzeug, das auf der Landingpage im Mittelpunkt steht.
 * Sobald mehrere Fahrzeuge gepflegt sind, kann hier gezielt eines
 * ausgewählt oder die Landingpage auf eine Liste umgestellt werden.
 */
export const featuredVehicle: Vehicle = availableVehicles[0] ?? vehicles[0]

export function getVehicleBySlug(slug: string): Vehicle | undefined {
  return vehicles.find((vehicle) => vehicle.slug === slug)
}

/** Alle Fahrzeuge, die für einen bestimmten Anlass angeboten werden. */
export function getVehiclesByUseCase(useCase: string): Vehicle[] {
  return availableVehicles.filter((vehicle) =>
    vehicle.availableUses.includes(useCase as Vehicle['availableUses'][number]),
  )
}
