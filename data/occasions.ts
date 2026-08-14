import type { UseCase } from '@/lib/types'

/**
 * Die Anlässe, für die Fahrzeuge gemietet werden können.
 *
 * Welche davon auf der Landingpage erscheinen, ergibt sich aus
 * `vehicle.availableUses` — es werden nur Anlässe gezeigt, die für das
 * jeweilige Fahrzeug tatsächlich angeboten werden.
 */
export const useCases: UseCase[] = [
  {
    id: 'hochzeit',
    title: 'Hochzeiten',
    description:
      'Die kurze Fahrt zwischen Trauung und Feier — oft der einzige Moment, den das Paar an diesem Tag für sich allein hat.',
    image: {
      src: '/images/anlaesse/hochzeit.svg',
      alt: 'Klassischer Roadster mit Blumenschmuck vor einer Kirche',
    },
  },
  {
    id: 'film',
    title: 'Film & Fotoshooting',
    description:
      'Ein Fahrzeug mit echter Patina statt einer Requisite. Für Produktionen, Editorials und Kampagnen, die Zeit erzählen wollen.',
    image: {
      src: '/images/anlaesse/film.svg',
      alt: 'Filmset mit klassischem Automobil und Beleuchtung',
    },
  },
  {
    id: 'event',
    title: 'Events',
    description:
      'Als Blickfang beim Empfang, als Bühne für eine Marke oder als Ankunft, über die am nächsten Tag noch gesprochen wird.',
    image: {
      src: '/images/anlaesse/event.svg',
      alt: 'Klassisches Automobil vor einer Abendveranstaltung',
    },
  },
  {
    id: 'wochenende',
    title: 'Wochenenden & Ausfahrten',
    description:
      'Zwei Tage, offenes Verdeck, keine Eile. Landstraßen, die man sonst nie fährt, weil sie länger dauern.',
    image: {
      src: '/images/anlaesse/wochenende.svg',
      alt: 'Roadster auf einer kurvigen Landstraße',
    },
  },
  {
    id: 'privat',
    title: 'Private Vermietung',
    description:
      'Ein Geburtstag, ein Jahrestag, ein Geschenk. Manchmal braucht ein Tag nur das richtige Auto, um besonders zu werden.',
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
 * Die großformatigen Lifestyle-Aufnahmen der Erlebnis-Sektion.
 * Bewusst textarm — die Bilder sollen wirken, nicht erklärt werden.
 */
export const lifestyleImages = [
  {
    src: '/images/erlebnis/hotel.svg',
    alt: 'Klassischer Roadster in der Auffahrt eines eleganten Hotels',
    caption: 'Ankunft',
  },
  {
    src: '/images/erlebnis/landstrasse.svg',
    alt: 'Roadster auf einer leeren Landstraße im Morgenlicht',
    caption: 'Landstraße',
  },
  {
    src: '/images/erlebnis/altstadt.svg',
    alt: 'Klassisches Automobil in einer historischen Altstadt',
    caption: 'Altstadt',
  },
  {
    src: '/images/erlebnis/filmset.svg',
    alt: 'Klassisches Automobil an einem Filmset',
    caption: 'Set',
  },
]
