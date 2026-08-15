/**
 * Hinweis, solange Supabase nicht eingerichtet ist.
 *
 * Ohne Datenbank ist das Dashboard leer — ohne diesen Hinweis sähe das aus
 * wie „keine Anfragen“ und nicht wie „noch nicht verbunden“.
 */
export default function SetupNotice() {
  return (
    <div className="border border-line bg-sand/50 px-6 py-6">
      <p className="text-[0.9375rem] font-medium text-ink">
        Supabase ist noch nicht verbunden.
      </p>

      <ol className="mt-4 space-y-2 text-[0.9375rem] leading-relaxed text-mist">
        <li>
          1. Auf{' '}
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noreferrer"
            className="link-underline text-ink"
          >
            supabase.com
          </a>{' '}
          ein Projekt anlegen (Free-Plan genügt).
        </li>
        <li>
          2. Im Projekt <span className="text-ink">SQL Editor</span> öffnen und den
          Inhalt von <code className="text-ink">supabase/schema.sql</code> ausführen.
        </li>
        <li>
          3. Unter <span className="text-ink">Settings → API</span> die beiden Werte
          kopieren und in <code className="text-ink">.env.local</code> eintragen:
        </li>
      </ol>

      <pre className="mt-4 overflow-x-auto whitespace-pre-wrap break-all border-l-2 border-champagne bg-cream px-4 py-3 text-[0.8125rem] leading-relaxed text-ink">
        NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co{'\n'}
        SUPABASE_SERVICE_ROLE_KEY=eyJ…
      </pre>

      <p className="mt-4 text-[0.875rem] text-mist">
        Danach den Entwicklungsserver neu starten — <code className="text-ink">.env.local</code>{' '}
        wird nur beim Start gelesen.
      </p>
    </div>
  )
}
