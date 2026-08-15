-- ─────────────────────────────────────────────────────────────
-- BeClassic — Datenbankschema für Anfragen und Nachrichtenverlauf
--
-- ANWENDEN:
--   Supabase-Dashboard → SQL Editor → diesen Inhalt einfügen → "Run".
--   Das Skript ist wiederholbar ausführbar (IF NOT EXISTS / DROP POLICY).
-- ─────────────────────────────────────────────────────────────

-- ── Tabelle: Anfragen ────────────────────────────────────────
-- Eine Zeile je abgesendetem Formular. Die Stammdaten bleiben
-- unverändert; alles, was sich im Laufe der Bearbeitung ändert,
-- steht in den unteren Feldern (status, termin_*, notiz).

create table if not exists public.inquiries (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  -- Angaben aus dem Formular
  first_name      text not null,
  last_name       text not null,
  email           text not null,
  phone           text not null,
  start_date      date not null,
  end_date        date,
  occasion        text not null,
  pickup_location text,
  message         text,
  vehicle         text,
  vehicle_slug    text,

  -- Bearbeitungsstand
  --   neu            → noch nicht angesehen
  --   in_bearbeitung → Kontakt aufgenommen, Details werden geklärt
  --   akzeptiert     → Termin steht, Kalendereintrag verfügbar
  --   abgelehnt      → kein Termin zustande gekommen
  status text not null default 'neu'
    check (status in ('neu', 'in_bearbeitung', 'akzeptiert', 'abgelehnt')),

  -- Verbindlicher Termin. Wird beim Akzeptieren gesetzt und ist
  -- die Grundlage für die ICS-Datei.
  appointment_start    timestamptz,
  appointment_end      timestamptz,
  appointment_location text,

  -- Interne Notiz, für den Kunden nicht sichtbar.
  internal_note text
);

create index if not exists inquiries_created_at_idx
  on public.inquiries (created_at desc);

create index if not exists inquiries_status_idx
  on public.inquiries (status);

-- ── Tabelle: Nachrichtenverlauf ──────────────────────────────
-- Die ursprüngliche Formularnachricht wird beim Anlegen als erste
-- eingehende Nachricht mitgeschrieben. Dadurch ist der Verlauf
-- vollständig, ohne Sonderfall in der Anzeige.

create table if not exists public.inquiry_messages (
  id         uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.inquiries (id) on delete cascade,
  created_at timestamptz not null default now(),

  -- 'eingehend' = vom Kunden, 'ausgehend' = von BeClassic
  direction text not null check (direction in ('eingehend', 'ausgehend')),

  body text not null,

  -- Versandprotokoll für ausgehende Nachrichten. Ist kein
  -- RESEND_API_KEY hinterlegt, bleibt email_sent = false und das
  -- Dashboard bietet stattdessen einen mailto-Link an.
  email_sent  boolean not null default false,
  email_error text
);

create index if not exists inquiry_messages_inquiry_idx
  on public.inquiry_messages (inquiry_id, created_at);

-- ── updated_at automatisch pflegen ───────────────────────────

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists inquiries_touch_updated_at on public.inquiries;
create trigger inquiries_touch_updated_at
  before update on public.inquiries
  for each row execute function public.touch_updated_at();

-- ── Zugriffsschutz ───────────────────────────────────────────
-- RLS ist aktiv, es gibt aber bewusst KEINE Policy: damit kommt
-- über den öffentlichen anon-Key niemand an die Daten.
-- Die Anwendung greift ausschliesslich serverseitig mit dem
-- Service-Role-Key zu, der RLS umgeht.

alter table public.inquiries        enable row level security;
alter table public.inquiry_messages enable row level security;

drop policy if exists "kein oeffentlicher zugriff" on public.inquiries;
drop policy if exists "kein oeffentlicher zugriff" on public.inquiry_messages;
