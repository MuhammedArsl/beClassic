# Bilder

Alle Dateien hier sind derzeit **SVG-Platzhalter**. Sie zeigen an, welches
Motiv an welcher Stelle steht, und können 1:1 durch echte Fotos ersetzt werden.

Nach dem Ersetzen die Pfade in `data/vehicles.ts` bzw. `data/occasions.ts`
anpassen (`.svg` → `.jpg`).

## Benötigte Motive

### Fahrzeug — `mg-mga-roadster/`

| Datei | Format | Motiv | Wo sichtbar |
| --- | --- | --- | --- |
| `hero.jpg` | Querformat, ≥ 2400 px | Fahrzeug im Abendlicht, viel Raum oben links für die Headline | Startbild, Vollbild |
| `portrait.jpg` | Panorama 21:9 | Saubere Seitenansicht, ganzes Fahrzeug | Fahrzeugsektion, groß |
| `galerie-01.jpg` | Panorama 21:9 | Seitenansicht / Fahraufnahme | Galerie, volle Breite |
| `galerie-02.jpg` | Hochformat 4:5 | Frontpartie, Kühlergrill, Chrom | Galerie |
| `galerie-03.jpg` | Hochformat 4:5 | Cockpit, Lenkrad, Instrumente | Galerie |
| `galerie-04.jpg` | Hochformat 4:5 | Detail — Speichenrad, Emblem, Leder | Galerie |
| `galerie-05.jpg` | Panorama 21:9 | Heck im Gegenlicht | Galerie, volle Breite |

### Anlässe — `anlaesse/`

| Datei | Format | Motiv |
| --- | --- | --- |
| `hochzeit.jpg` | Querformat 3:2 | Fahrzeug mit Blumenschmuck, vor Kirche oder Standesamt |
| `film.jpg` | Querformat 3:2 | Set-Situation, Kamera oder Licht im Bild |
| `event.jpg` | Hochformat 4:5 | Fahrzeug bei einer Abendveranstaltung |
| `wochenende.jpg` | Hochformat 4:5 | Fahrzeug auf kurviger Landstraße |
| `privat.jpg` | Hochformat 4:5 | Fahrzeug vor elegantem Hotel oder Restaurant |

### Erlebnis — `erlebnis/`

| Datei | Format | Motiv |
| --- | --- | --- |
| `hotel.jpg` | Breites Panorama, ≥ 2400 px | Ankunft in einer Hotelauffahrt |
| `landstrasse.jpg` | Hochformat 3:4 | Leere Landstraße, Morgenlicht |
| `altstadt.jpg` | Hochformat 3:4 | Historische Innenstadt |
| `filmset.jpg` | Hochformat 3:4 | Filmset-Atmosphäre |

Die Erlebnis-Bilder werden leicht abgedunkelt auf dunklem Grund gezeigt —
kontrastreiche, ruhige Aufnahmen wirken hier am besten.

## Technisches

- **Format:** JPG (~80 % Qualität) oder WebP. Next.js liefert automatisch
  AVIF/WebP in passender Größe aus.
- **Auflösung:** Querformate ≥ 2400 px breit, Hochformate ≥ 1400 px breit.
- Sobald keine SVGs mehr verwendet werden, in `next.config.ts` die drei Zeilen
  unter `dangerouslyAllowSVG` entfernen.
