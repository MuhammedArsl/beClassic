# Vorlagen für später

Ordner, die mit einem Unterstrich beginnen, schließt der Next.js App Router
vom Routing aus. Die Dateien hier sind also **nicht im Browser erreichbar** —
sie liegen fertig bereit, falls die Flotte einmal wächst.

## Was hier liegt

| Datei | Wird zu |
| --- | --- |
| `fahrzeuge/page.tsx` | `/fahrzeuge` — Übersicht aller Fahrzeuge |
| `fahrzeuge/[slug]/page.tsx` | `/fahrzeuge/mg-mga-roadster` — Detailseite je Fahrzeug |

Beide lesen bereits aus `data/vehicles.ts` und funktionieren unverändert.

## Aktivieren

Sobald ein zweites Fahrzeug dazukommt:

1. Ordner `fahrzeuge` aus `app/_spaeter/` nach `app/` verschieben.
2. In `data/site.ts` bei `navigation` einen Eintrag ergänzen:
   `{ label: 'Fahrzeuge', href: '/fahrzeuge' }`
3. Falls die Kopfleiste dann wieder Links tragen soll, in
   `components/Navigation.tsx` neben dem Anfrage-Button eine Linkliste über
   `site.navigation` ausgeben.

Mehr ist nicht nötig — die Seiten rendern jedes Fahrzeug automatisch.

## Warum aktuell aus

Solange nur der MG MGA im Bestand ist, soll die gesamte Aufmerksamkeit auf
der One-Page liegen. Eine Übersichtsseite mit einem einzigen Eintrag wirkt
leer und lenkt vom eigentlichen Ziel ab: der Anfrage.
