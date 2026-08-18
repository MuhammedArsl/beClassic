# BeClassic — Website

Premium-**One-Page** für die Vermietung klassischer Fahrzeuge.
Next.js 15 (App Router) · TypeScript · Tailwind CSS 4.

Die gesamte Seite ist ein einziger Scrollweg mit einem Ziel: der Anfrage.
Die Kopfleiste trägt deshalb nur die Wortmarke und den Anfrage-Button.

---

## Starten

```bash
npm run dev     # Entwicklung → http://localhost:3000
npm run build   # Produktions-Build
npm start       # Produktions-Build lokal ausführen
```

---

## Die drei Dateien, die du kennen musst

| Datei | Inhalt |
| --- | --- |
| `data/vehicles.ts` | **Alle Fahrzeugdaten.** Name, Baujahr, Technik, Story, Bilder. |
| `data/site.ts` | Kontaktdaten, Instagram, Navigation, Ablauf-Schritte. |
| `data/occasions.ts` | Die Anlässe (Hochzeit, Film, Event …) und die Erlebnis-Bilder. |

Alles andere liest ausschließlich aus diesen Dateien. Kein Fahrzeug steht
irgendwo fest im Seitencode.

### Was du vor dem Livegang anpassen solltest

Suche im Projekt nach `TODO` — dort stehen alle Stellen, die echte Daten
brauchen:

- `data/site.ts` → E-Mail, Telefon, Adresse, Instagram, Domain
- `data/vehicles.ts` → exaktes Baujahr, Farbe, Ausstattung des Fahrzeugs
- `app/impressum/page.tsx` und `app/datenschutz/page.tsx` → Rechtstexte
  (Struktur-Vorlagen — bitte rechtlich prüfen lassen)

---

## Bilder ersetzen

Unter `public/images/` liegen aktuell **SVG-Platzhalter** in der Markenfarbwelt.
Jedes Motiv trägt einen Hinweis, was dort hingehört. Ablauf:

1. Foto unter demselben Pfad ablegen, z. B.
   `public/images/mg-mga-roadster/hero.jpg`
2. In `data/vehicles.ts` bzw. `data/occasions.ts` die Endung `.svg` → `.jpg`
   ändern.
3. Sobald **keine** SVGs mehr verwendet werden, in `next.config.ts` die drei
   Zeilen unter `dangerouslyAllowSVG` entfernen.

Eine Übersicht aller benötigten Motive und Formate steht in
`public/images/README.md`.

**Empfehlung:** Querformate mindestens 2400 px breit, Hochformate mindestens
1400 px breit, als JPG mit ~80 % Qualität. Next.js optimiert sie beim
Ausliefern automatisch zu WebP/AVIF.

---

## Ein zweites Fahrzeug hinzufügen

1. In `data/vehicles.ts` das Objekt `mgaRoadster` kopieren, umbenennen und
   einen eigenen `slug` vergeben.
2. Neues Objekt in das Array `vehicles` eintragen und `order` setzen.
3. Bilder unter `public/images/<slug>/` ablegen.

Die One-Page zeigt das Fahrzeug aus `featuredVehicle` — standardmäßig das mit
der kleinsten `order`. Sie bleibt also unverändert funktionsfähig; du steuerst
allein über `order`, welches Fahrzeug im Mittelpunkt steht.

**Wenn du zusätzlich Unterseiten möchtest:** Unter `app/_spaeter/fahrzeuge/`
liegen `/fahrzeuge` (Übersicht) und `/fahrzeuge/[slug]` (Detailseite) fertig
bereit. Ordner mit `_`-Präfix routet Next.js nicht — die Seiten sind also
aktuell bewusst deaktiviert. Zum Aktivieren genügt es, den Ordner `fahrzeuge`
nach `app/` zu verschieben. Details in `app/_spaeter/README.md`.

---

## Anfrageformular

Aktuell **Frontend-Demo**: Das Formular validiert vollständig (Client *und*
Server) und zeigt die Bestätigung — die Anfrage wird aber nur in der
Server-Konsole ausgegeben, nicht versendet.

**E-Mail-Versand aktivieren** (Beispiel Resend):

```bash
npm install resend
```

`.env.local` anlegen:

```
RESEND_API_KEY=re_xxxxxxxx
ANFRAGE_EMPFAENGER=deine@adresse.de
```

Dann in `app/api/anfrage/route.ts` den dokumentierten Block einkommentieren.
Der Rest — Validierung, Fehlerbehandlung, Bestätigungsansicht — ist bereits
fertig.

---

## Spam-Schutz

Vier Stufen, alle serverseitig durchgesetzt. Für echte Besucher bleibt das
Formular unverändert bequem — kein Klickrätsel, kein Zusatzfeld.

| Stufe | Wirkung | Konfiguration |
| --- | --- | --- |
| **Honeypot** | Unsichtbares Feld, das nur Bots ausfüllen | aktiv |
| **Tempo-Prüfung** | Absenden in unter 3 Sekunden = kein Mensch | aktiv |
| **Rate-Limit** | Max. 5 Anfragen je Absender in 10 Minuten | aktiv |
| **Cloudflare Turnstile** | CAPTCHA-Ersatz, meist unsichtbar | Schlüssel nötig |

Bei Honeypot und Tempo-Prüfung antwortet der Server bewusst mit einem
scheinbaren Erfolg — der Bot hält die Einlieferung für geglückt und probiert
keine Umgehung. Verarbeitet wird nichts.

### Turnstile scharf schalten

In `.env.local` liegen aktuell **Cloudflares Testschlüssel**. Die laufen immer
erfolgreich durch und schützen nicht. Für den Livegang:

1. Auf `dash.cloudflare.com` → **Turnstile** → *Add Site* die eigene Domain
   eintragen (Modus **Managed**). Kostenlos, auch ohne dort gehostete Domain.
2. Die beiden Schlüssel eintragen — lokal in `.env.local`, beim Hoster in den
   Umgebungsvariablen des Projekts:

```
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAA...   # öffentlich
TURNSTILE_SECRET_KEY=0x4AAAAAAA...             # geheim, nie ins Repository
```

3. Server neu starten — Umgebungsvariablen werden nur beim Start gelesen.

**Sind beide Werte leer, entfällt die Turnstile-Prüfung** und die Seite läuft
mit den drei übrigen Stufen weiter. Praktisch für die lokale Entwicklung, aber
für den Livebetrieb solltest du echte Schlüssel setzen.

> Turnstile lädt ein Skript von `challenges.cloudflare.com`. Der entsprechende
> Abschnitt steht bereits in der Datenschutzerklärung (Punkt 4) und muss beim
> Deaktivieren wieder entfernt werden.

---

## Aufbau

```
app/
  page.tsx                    One-Page (alle Sektionen)
  layout.tsx                  Schriften, Metadaten
  globals.css                 Design-System (Farben, Typo, Animationen)
  api/anfrage/route.ts        Formular-Endpunkt
  impressum/ · datenschutz/   Rechtsseiten
  not-found.tsx               404
  _spaeter/fahrzeuge/         deaktivierte Vorlagen für mehrere Fahrzeuge
components/
  Navigation · Hero · VehicleShowcase · Occasions
  Lifestyle · Process · InquiryForm · Footer
  Reveal · Parallax · SectionIntro · CTAButton · Logo · LegalPage
data/                         ← Inhalte
lib/types.ts                  Typdefinitionen
```

Die One-Page besteht aus fünf durchnummerierten Sektionen:
Hero → 01 Das Fahrzeug → 02 Vermietung → 03 Erlebnis → 04 Ablauf →
05 Anfrage → Footer.

### Design-System

Farben und Schriften sind zentral in `app/globals.css` unter `@theme`
definiert und stehen überall als Tailwind-Klassen bereit
(`bg-cream`, `text-ink`, `text-champagne`, `border-line` …).

| Token | Wert | Verwendung |
| --- | --- | --- |
| `cream` | `#F7F4EE` | Haupthintergrund |
| `shell` | `#EFEAE0` | abgesetzte Sektionen |
| `sand` | `#E3DACB` | Karten, Formularflächen |
| `ink` | `#1A1815` | Schrift, dunkle Sektion |
| `mist` | `#7C756B` | Fließtext |
| `champagne` | `#A88A5C` | Akzent |

Schriften: **Cormorant Garamond** (Headlines) und **Jost** (Text) — über
`next/font` lokal ausgeliefert, es werden keine Daten an Google übertragen.

### Animationen

Ohne Animations-Bibliothek. `components/Reveal.tsx` nutzt einen
IntersectionObserver, `components/Parallax.tsx` rechnet in
`requestAnimationFrame` und bewegt ausschließlich `transform`. Beides
respektiert die Systemeinstellung „Bewegung reduzieren“; Parallax bleibt auf
Mobilgeräten bewusst aus.

---

## Veröffentlichen

Die Seite läuft auf **Cloudflare Workers**, angepasst über
[OpenNext](https://opennext.js.org/cloudflare). Vercel scheidet aus: Dessen
kostenloser Hobby-Plan erlaubt keine kommerzielle Nutzung, und für eine
Autovermietung wäre Pro fällig. Cloudflares kostenlose Stufe erlaubt sie.

### Die Dateien

| Datei | Wofür |
| --- | --- |
| `wrangler.jsonc` | Name des Workers, Kompatibilitätsflags, Assets, Bildoptimierung |
| `open-next.config.ts` | Wie Next.js für Workers umgebaut wird |

Zwei Flags stehen in `wrangler.jsonc` und dürfen nicht weg: `nodejs_compat`,
weil `lib/mail.ts` und `lib/ics.ts` `Buffer` benutzen, und
`global_fetch_strictly_public`, damit Aufrufe an Supabase, Resend und
Turnstile wirklich nach draußen gehen.

### Befehle

```bash
npm run cf:preview   # baut und startet den Worker lokal (echte Workers-Laufzeit)
npm run cf:deploy    # baut und veröffentlicht
```

`npm run dev` bleibt für die tägliche Arbeit — das ist schneller. Der
Preview-Befehl ist die Probe vor dem Veröffentlichen, weil er in derselben
Laufzeit läuft wie später die Live-Seite.

### Zugangsdaten: zwei Sorten, zwei Wege

Das ist die Stelle, an der es still schiefgeht, wenn man es verwechselt.

**Zur Laufzeit gelesen** — als Secret in Cloudflare hinterlegen:

```bash
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put NEXT_PUBLIC_SUPABASE_URL
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put ADMIN_SESSION_SECRET
npx wrangler secret put TURNSTILE_SECRET_KEY
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put ANFRAGE_ABSENDER
npx wrangler secret put ANFRAGE_EMPFAENGER
```

`NEXT_PUBLIC_SUPABASE_URL` steht trotz seines Namens hier: Die Variable wird
nur serverseitig gelesen (`lib/supabase.ts`), deshalb bleibt im Bundle ein
echter Zugriff zur Laufzeit stehen.

**Zur Bauzeit fest eingesetzt** — muss beim Bauen in der Umgebung stehen:

```
NEXT_PUBLIC_TURNSTILE_SITE_KEY
```

Dieser Wert landet im Browser-Bundle und wird beim Bauen hineingeschrieben.
Ihn nachträglich als Secret zu setzen bringt **nichts** — er muss in
`.env.local` stehen (oder in der Umgebung), *bevor* `cf:deploy` läuft.
Ändert er sich, muss neu gebaut und veröffentlicht werden.

### Domain verbinden

Im Cloudflare-Dashboard: **Workers & Pages → beclassic → Settings → Domains &
Routes → Custom Domain** hinzufügen (`beclassic.at` und `www.beclassic.at`).
Cloudflare legt die DNS-Einträge dabei selbst an und ersetzt die alten.

Wichtig: Die bisherigen `A`-Einträge zeigten auf den GoDaddy-Baukasten. Der
lieferte zwar direkt eine Seite aus, verwarf aber Anfragen von Cloudflares
Proxy — daher der Fehler 522. Diese Einträge müssen weg, sonst bleibt der
Fehler bestehen.
