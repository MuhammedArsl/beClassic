/**
 * Zentrale Typdefinitionen der Fahrzeugdaten.
 *
 * Alle Komponenten lesen ausschliesslich aus diesen Strukturen — kein Fahrzeug
 * ist irgendwo im JSX hart verdrahtet. Ein neues Fahrzeug entsteht dadurch,
 * dass in `data/vehicles.ts` ein weiterer Eintrag ergaenzt wird.
 */

/** Anlass-Schluessel. Erweiterbar; die Anzeige-Daten liegen in `data/occasions.ts`. */
export type UseCaseId =
  | 'hochzeit'
  | 'film'
  | 'event'
  | 'wochenende'
  | 'privat'

/** Fahrzeugkategorie — heute nur `klassiker`, spaeter z. B. `moderne` oder `sportwagen`. */
export type VehicleCategory = 'klassiker' | 'moderne' | 'sportwagen'

export interface VehicleImage {
  /** Pfad relativ zu /public, z. B. `/images/mga/galerie-01.svg` */
  src: string
  /** Bildbeschreibung — wird als alt-Text ausgegeben (Barrierefreiheit + SEO). */
  alt: string
  /** Optionale Bildunterschrift in der Galerie. */
  caption?: string
  /**
   * Kachelgroesse im Galerie-Raster.
   * `wide` = volle Breite im Panoramaformat, `default` = ein Drittel im Hochformat.
   */
  span?: 'default' | 'wide'
}

export interface VehicleSpecification {
  /** Kurzes Label, z. B. „Motor“ */
  label: string
  /** Wert, z. B. „1,5 Liter Reihenvierzylinder“ */
  value: string
}

export interface Vehicle {
  /** URL-Segment, z. B. `mg-mga-roadster` → /fahrzeuge/mg-mga-roadster */
  slug: string
  /** Vollstaendiger Fahrzeugname, z. B. „MG MGA 1500 Roadster“ */
  name: string
  /** Marke, getrennt gefuehrt fuer spaetere Filterung. */
  make: string
  /** Modellbezeichnung ohne Marke. */
  model: string
  /** Baujahr als Zahl — erlaubt spaeter Sortierung. */
  year: number
  category: VehicleCategory
  /** Eine Zeile ueber dem Fahrzeugnamen, z. B. „Britischer Roadster, 1959“ */
  eyebrow: string
  /** Emotionale Ueberschrift, z. B. „Ein Klassiker mit Charakter.“ */
  tagline: string
  /** Kurzer Einleitungstext (2–3 Saetze). */
  intro: string
  /** Mehrabsaetzige Geschichte des Fahrzeugs. Jeder Eintrag ist ein Absatz. */
  story: string[]
  /** Technische Daten in Anzeigereihenfolge. */
  specifications: VehicleSpecification[]
  /** Drei bis vier praegnante Eckdaten fuer die Kurzuebersicht. */
  highlights: VehicleSpecification[]
  /** Grossformatiges Bild fuer Hero / Kopfbereich. */
  heroImage: VehicleImage
  /** Vorschaubild fuer Uebersichtslisten (/fahrzeuge). */
  featuredImage: VehicleImage
  /** Bildergalerie der Fahrzeugsektion. */
  images: VehicleImage[]
  /** Fuer welche Anlaesse dieses Fahrzeug angeboten wird. */
  availableUses: UseCaseId[]
  /** Steuert die Sichtbarkeit — `false` blendet das Fahrzeug ueberall aus. */
  available: boolean
  /** Kleiner ist weiter vorne. Bestimmt die Reihenfolge in Listen. */
  order: number
}

export interface UseCase {
  id: UseCaseId
  title: string
  /** Kurzer, emotionaler Beschreibungstext. */
  description: string
  image: VehicleImage
}
