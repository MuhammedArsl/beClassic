import { defineCloudflareConfig } from '@opennextjs/cloudflare'

/**
 * OpenNext-Anpassung für Cloudflare Workers.
 *
 * Ohne inkrementellen Cache (R2), weil die Seite keinen braucht: Die
 * öffentlichen Seiten werden beim Bauen erzeugt und liegen als statische
 * Dateien im Asset-Verzeichnis, das Dashboard steht auf `force-dynamic` und
 * soll gerade nicht zwischengespeichert werden. Ein R2-Bucket wäre damit ein
 * Bauteil, das nichts trägt — und eines mehr, das beim Deployen existieren
 * muss.
 *
 * Sobald eine Seite mit `revalidate` dazukommt, gehört hier der
 * r2IncrementalCache hinein, dazu der Bucket und die WORKER_SELF_REFERENCE-
 * Bindung in wrangler.jsonc. Siehe https://opennext.js.org/cloudflare/caching
 */
export default defineCloudflareConfig()
