import type { UseCase } from '@/lib/types'

/**
 * Die Anlässe, für die Fahrzeuge gemietet werden können.
 *
 * Welche davon auf der Landingpage erscheinen, ergibt sich aus
 * `vehicle.availableUses` — es werden nur Anlässe gezeigt, die für das
 * jeweilige Fahrzeug tatsächlich angeboten werden.
 *
 * Die Beschreibungen sind bewusst kurz: Auf der Landingpage stehen alle
 * fünf untereinander (siehe components/Occasions.tsx). Ein Satz je Anlass
 * lässt sich überfliegen — ein Absatz je Anlass nicht.
 *
 * Die Bilder bleiben gepflegt, werden auf der Landingpage aber nicht mehr
 * ausgespielt; sie stehen für spätere Anlass-Seiten bereit.
 */
export const useCases: UseCase[] = [
  {
    id: 'hochzeit',
    title: 'Hochzeiten',
    description:
      'Die Fahrt zwischen Trauung und Feier — oft der einzige Moment, den das Paar für sich hat.',
    image: {
      src: '/images/anlaesse/hochzeit.svg',
      alt: 'Klassischer Roadster mit Blumenschmuck vor einer Kirche',
    },
  },
  {
    id: 'film',
    title: 'Film & Fotoshooting',
    description: 'Echte Patina statt Requisite — für Produktionen und Editorials.',
    image: {
      src: '/images/anlaesse/film.svg',
      alt: 'Filmset mit klassischem Automobil und Beleuchtung',
    },
  },
  {
    id: 'event',
    title: 'Events',
    description: 'Eine Ankunft, über die am nächsten Tag noch gesprochen wird.',
    image: {
      src: '/images/anlaesse/event.svg',
      alt: 'Klassisches Automobil vor einer Abendveranstaltung',
    },
  },
  {
    id: 'wochenende',
    title: 'Wochenenden & Ausfahrten',
    description: 'Offenes Verdeck, keine Eile, Landstraßen ohne Umweg-Reue.',
    image: {
      src: '/images/anlaesse/wochenende.svg',
      alt: 'Roadster auf einer kurvigen Landstraße',
    },
  },
  {
    id: 'privat',
    title: 'Private Vermietung',
    description: 'Ein Geburtstag, ein Jahrestag, ein Geschenk.',
    image: {
      src: '/images/anlaesse/privat.svg',
      alt: 'Klassisches Automobil vor einem eleganten Hotel',
    },
  },
]

export function getUseCasesByIds(ids: readonly string[]): UseCase[] {
  return ids
    .map((id) => useCases.find((useCase) => useCase.id === id))
    .filter((useCase): useCase is UseCase => Boolean(useCase))
}

/**
 * Die großformatigen Aufnahmen der Vermietungs-Sektion.
 * Bewusst textarm — die Bilder sollen wirken, nicht erklärt werden.
 *
 * REIHENFOLGE ZÄHLT (siehe components/Occasions.tsx):
 *   Der ERSTE Eintrag läuft als breites Panorama über die volle Seitenbreite
 *   und bekommt keine Bildunterschrift. Alle weiteren stehen paarweise im
 *   Hochformat versetzt daneben — deshalb eine gerade Anzahl, sonst bleibt
 *   am Ende ein Bild allein stehen.
 */
export const lifestyleImages = [
  {
    src: '/images/erlebnis/hofburg.jpg',
    alt: 'MG MGA 1500 Roadster vor der Wiener Hofburg am Heldenplatz',
  },
  {
    src: '/images/erlebnis/cockpit.jpg',
    alt: 'Cockpit des MG MGA 1500 mit großem Lenkrad und rotem Lederinterieur',
    caption: 'Cockpit',
  },
  {
    src: '/images/erlebnis/speichenrad.jpg',
    alt: 'Verchromtes Speichenrad des MG MGA 1500 in Nahaufnahme',
    caption: 'Speichenräder',
  },
  {
    src: '/images/erlebnis/leder.jpg',
    alt: 'Geöffnete Tür mit rot gestepptem Lederpaneel',
    caption: 'Rotes Leder',
  },
  {
    src: '/images/erlebnis/hofburg-detail.jpg',
    alt: 'MG MGA 1500 Roadster mit offenem Verdeck vor der Wiener Hofburg',
    caption: 'Heldenplatz',
  },
]
