import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Serverseitiger Supabase-Zugang.
 *
 * Bewusst NUR mit dem Service-Role-Key: Die Tabellen haben RLS aktiv und
 * keine Policy, kommen über den öffentlichen anon-Key also niemand an die
 * Daten. Dieser Modul darf deshalb ausschliesslich auf dem Server geladen
 * werden — niemals in einer 'use client'-Komponente importieren.
 *
 * >>> EINRICHTEN (siehe auch supabase/schema.sql)
 *   1. Auf supabase.com ein Projekt anlegen (Free-Plan genügt).
 *   2. Projekt → SQL Editor → Inhalt von supabase/schema.sql ausführen.
 *   3. Projekt → Settings → API → beide Werte in .env.local eintragen:
 *        NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
 *        SUPABASE_SERVICE_ROLE_KEY=eyJ...
 */

let cached: SupabaseClient | null = null

/** true, sobald beide Zugangsdaten hinterlegt sind. */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  )
}

/**
 * Liefert den Client — oder `null`, wenn keine Zugangsdaten hinterlegt sind.
 *
 * Das `null` ist Absicht: Ohne Supabase soll die Seite weiterlaufen (das
 * Formular protokolliert die Anfrage dann nur in der Server-Konsole), statt
 * mit einem Fehler abzubrechen.
 */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null
  if (cached) return cached

  cached = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  )

  return cached
}
