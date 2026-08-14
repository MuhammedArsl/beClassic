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
 * >>> HIER ANPASSEN: Die Angaben unten beschreiben einen MG MGA 1600 Roadster
 * (Baureihe 1955–1962). Bitte Baujahr, Farbe, Ausstattung und die persönlichen
 * Textstellen an das tatsächliche Fahrzeug anpassen.
 */

const mgaRoadster: Vehicle = {
  slug: 'mg-mga-roadster',
  name: 'MG MGA 1600 Roadster',
  make: 'MG',
  model: 'MGA 1600 Roadster',
  year: 1959, // TODO: exaktes Baujahr des Fahrzeugs eintragen
  category: 'klassiker',
  eyebrow: 'Britischer Roadster · 1959',
  tagline: 'Ein Klassiker mit Charakter.',
  intro:
    'Offen, leicht und unverwechselbar britisch. Der MGA gehört zu den schönsten Formen, die je aus Abingdon kamen — und er fährt sich genau so, wie er aussieht.',
  story: [
    'Als MG 1955 den MGA vorstellte, war das ein Bruch mit allem, was die Marke bis dahin gebaut hatte. Statt der aufrechten Vorkriegsform des MG TF kam eine tief gezogene, fließende Karosserie, deren Linie direkt aus dem Rennsport stammte — aus den Le-Mans-Erfahrungen, die MG in den Jahren zuvor gesammelt hatte.',
    'Der 1600er von 1959 gilt vielen als die reifste Ausbaustufe: 1,6 Liter Hubraum, vorn erstmals Scheibenbremsen, dazu das direkte, unverfälschte Fahrgefühl, das dem Wagen bis heute seinen Ruf verleiht. Kein Servo, keine Assistenz, keine Dämmung zwischen Ihnen und der Straße.',
    'Was bleibt, ist das Wesentliche: das Geräusch des Vierzylinders, der Fahrtwind, das große dünne Lenkrad in den Händen. Ein Auto, das nicht schnell sein muss, um besonders zu wirken — und das auf jeder Hochzeit, jedem Set und jeder Landstraße sofort zum Mittelpunkt wird.',
  ],
  highlights: [
    { label: 'Baujahr', value: '1959' },
    { label: 'Sitzplätze', value: '2 Personen' },
    { label: 'Getriebe', value: 'Manuell' },
    { label: 'Verdeck', value: 'Offen fahrbar' },
  ],
  specifications: [
    { label: 'Fahrzeug', value: 'MG MGA 1600 Roadster' },
    { label: 'Baujahr', value: '1959' },
    { label: 'Motor', value: '1.6 Liter Reihenvierzylinder' },
    { label: 'Leistung', value: 'ca. 80 PS' },
    { label: 'Getriebe', value: '4-Gang, manuell' },
    { label: 'Antrieb', value: 'Hinterradantrieb' },
    { label: 'Sitzplätze', value: '2' },
    { label: 'Höchstgeschwindigkeit', value: 'ca. 155 km/h' },
    { label: 'Karosserie', value: 'Roadster, offen' },
    { label: 'Farbe', value: 'Old English White' }, // TODO: tatsächliche Farbe eintragen
  ],
  heroImage: {
    src: '/images/mg-mga-roadster/hero.svg',
    alt: 'MG MGA 1600 Roadster im Abendlicht auf einer Landstraße',
  },
  featuredImage: {
    src: '/images/mg-mga-roadster/portrait.svg',
    alt: 'MG MGA 1600 Roadster in der Seitenansicht',
  },
  images: [
    {
      src: '/images/mg-mga-roadster/galerie-01.svg',
      alt: 'Seitenansicht des MG MGA Roadster',
      caption: 'Die Linie, die 1955 alles veränderte',
      span: 'wide',
    },
    {
      src: '/images/mg-mga-roadster/galerie-02.svg',
      alt: 'Frontpartie mit klassischem MG Kühlergrill',
      caption: 'Kühlergrill und Chrom im Original',
    },
    {
      src: '/images/mg-mga-roadster/galerie-03.svg',
      alt: 'Cockpit des MG MGA mit großem Lenkrad und Rundinstrumenten',
      caption: 'Cockpit ohne Ablenkung',
    },
    {
      src: '/images/mg-mga-roadster/galerie-04.svg',
      alt: 'Detailaufnahme der Speichenräder',
      caption: 'Speichenräder',
    },
    {
      src: '/images/mg-mga-roadster/galerie-05.svg',
      alt: 'MG MGA Roadster von hinten im Gegenlicht',
      caption: 'Abfahrt bei letztem Licht',
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
