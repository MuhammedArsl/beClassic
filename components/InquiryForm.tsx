'use client'

import { useState, type ChangeEvent, type FormEvent } from 'react'
import Link from 'next/link'
import { occasionOptions, site } from '@/data/site'
import type { Vehicle } from '@/lib/types'
import CTAButton from './CTAButton'
import Process from './Process'
import Reveal from './Reveal'
import Turnstile from './Turnstile'

/**
 * Öffentlicher Turnstile-Schlüssel. Ist er nicht gesetzt, entfällt die
 * Sicherheitsprüfung und das Formular funktioniert unverändert — geschützt
 * durch Honeypot, Tempo-Prüfung und Rate-Limit auf dem Server.
 */
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''

interface InquiryFormProps {
  vehicle: Vehicle
  /** Sektionsnummer ausblenden (siehe VehicleShowcase). */
  showIndex?: boolean
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  startDate: string
  endDate: string
  occasion: string
  pickupLocation: string
  message: string
  privacy: boolean
  /**
   * Spam-Falle („Honeypot“). Das Feld ist für Menschen unsichtbar und wird
   * niemals ausgefüllt — Bots füllen dagegen blind jedes Feld aus. Steht hier
   * etwas drin, verwirft der Server die Anfrage.
   */
  website: string
}

type FormErrors = Partial<Record<keyof FormData, string>>
type Status = 'idle' | 'submitting' | 'success' | 'error'

const emptyForm: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  startDate: '',
  endDate: '',
  occasion: '',
  pickupLocation: '',
  message: '',
  privacy: false,
  website: '',
}

/** Heutiges Datum als YYYY-MM-DD — verhindert Anfragen in der Vergangenheit. */
function today(): string {
  return new Date().toISOString().split('T')[0]
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {}

  if (!data.firstName.trim()) errors.firstName = 'Bitte Vornamen angeben'
  if (!data.lastName.trim()) errors.lastName = 'Bitte Nachnamen angeben'

  if (!data.email.trim()) {
    errors.email = 'Bitte E-Mail-Adresse angeben'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim())) {
    errors.email = 'Bitte gültige E-Mail-Adresse angeben'
  }

  if (!data.phone.trim()) {
    errors.phone = 'Bitte Telefonnummer angeben'
  } else if (data.phone.replace(/\D/g, '').length < 6) {
    errors.phone = 'Bitte vollständige Telefonnummer angeben'
  }

  if (!data.startDate) errors.startDate = 'Bitte gewünschtes Datum wählen'

  // Rückgabedatum ist optional — wenn gesetzt, muss es plausibel sein.
  if (data.endDate && data.startDate && data.endDate < data.startDate) {
    errors.endDate = 'Rückgabe darf nicht vor dem Starttermin liegen'
  }

  if (!data.occasion) errors.occasion = 'Bitte Anlass wählen'
  if (!data.privacy) errors.privacy = 'Bitte der Datenschutzerklärung zustimmen'

  return errors
}

const fieldClass =
  'w-full border-b border-line-strong bg-transparent pb-3 pt-2 text-[1.0625rem] font-normal text-ink outline-none transition-colors duration-300 placeholder:text-mist/70 focus:border-ink'

const labelClass =
  'block text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-mist'

export default function InquiryForm({
  vehicle,
  showIndex = true,
}: InquiryFormProps) {
  const [data, setData] = useState<FormData>(emptyForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<Status>('idle')

  /**
   * Zeitpunkt, zu dem das Formular im Browser erschien. Menschen brauchen zum
   * Ausfüllen mindestens einige Sekunden — Bots senden praktisch sofort ab.
   * Der Server verwirft alles, was zu schnell zurückkommt.
   */
  const [openedAt] = useState(() => Date.now())

  /** Vom Server gelieferte Fehlermeldung, z. B. beim Erreichen des Limits. */
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  /** Prüf-Token von Turnstile — leer, solange die Prüfung nicht bestanden ist. */
  const [turnstileToken, setTurnstileToken] = useState('')

  const update = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = event.target
    const nextValue =
      type === 'checkbox' ? (event.target as HTMLInputElement).checked : value

    setData((previous) => ({ ...previous, [name]: nextValue }))
    // Fehler verschwindet, sobald der Nutzer das Feld korrigiert.
    setErrors((previous) => ({ ...previous, [name]: undefined }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationErrors = validate(data)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      // Zum ersten fehlerhaften Feld springen.
      const firstError = Object.keys(validationErrors)[0]
      document
        .querySelector<HTMLElement>(`[name="${firstError}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    // Ist Turnstile aktiv, muss die Prüfung vor dem Absenden durch sein.
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setErrorMessage(
        'Die Sicherheitsprüfung läuft noch. Bitte einen Moment warten und erneut absenden.',
      )
      setStatus('error')
      return
    }

    setStatus('submitting')

    try {
      const response = await fetch('/api/anfrage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          vehicle: vehicle.name,
          vehicleSlug: vehicle.slug,
          // Ausfülldauer in Millisekunden — dient der Bot-Erkennung.
          elapsedMs: Date.now() - openedAt,
          turnstileToken,
        }),
      })

      if (!response.ok) {
        // Der Server erklärt bestimmte Fälle genauer (etwa zu viele Anfragen).
        const payload = await response.json().catch(() => null)
        setErrorMessage(
          typeof payload?.error === 'string' ? payload.error : null,
        )
        throw new Error('Anfrage fehlgeschlagen')
      }

      setErrorMessage(null)
      setStatus('success')
      setData(emptyForm)
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="anfrage" className="relative bg-shell py-28 sm:py-36">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          {/* Linke Spalte: Kontext und Kontakt */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <Reveal>
                <div className="flex items-center gap-4">
                  {showIndex && (
                    <span className="text-[0.8125rem] tracking-[0.28em] text-champagne">
                      03
                    </span>
                  )}
                  <span aria-hidden="true" className="h-px w-10 bg-line-strong" />
                  <span className="eyebrow">Anfrage</span>
                </div>
              </Reveal>

              <h2 className="display mt-7 text-[clamp(2.25rem,5.2vw,4rem)] text-ink">
                <Reveal variant="line" as="span" delay={60}>
                  Erzählen Sie uns
                </Reveal>
                <Reveal variant="line" as="span" delay={160}>
                  <span className="italic text-champagne">von Ihrem Anlass.</span>
                </Reveal>
              </h2>

              <Reveal delay={240}>
                <p className="lede mt-8 max-w-md">
                  Ihre Anfrage ist unverbindlich und kostenlos. Wir melden uns in
                  der Regel innerhalb von 24 Stunden persönlich bei Ihnen.
                </p>
              </Reveal>

              {/* Der Ablauf steht hier statt in einer eigenen Sektion —
                  er beantwortet die Frage, die genau an dieser Stelle
                  aufkommt: was passiert nach dem Absenden? */}
              <Reveal delay={300}>
                <div className="mt-12">
                  <Process />
                </div>
              </Reveal>

              <Reveal delay={380}>
                <div className="mt-10 border-t border-line pt-8">
                  <p className="eyebrow">Direkter Kontakt</p>
                  <div className="mt-5 space-y-2">
                    <a
                      href={`mailto:${site.contact.email}`}
                      className="link-underline block w-fit text-[1.0625rem] font-normal text-ink"
                    >
                      {site.contact.email}
                    </a>
                    <a
                      href={`tel:${site.contact.phoneHref}`}
                      className="link-underline block w-fit text-[1.0625rem] font-normal text-ink"
                    >
                      {site.contact.phone}
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Rechte Spalte: Formular oder Bestätigung */}
          <div className="lg:col-span-7">
            {status === 'success' ? (
              <SuccessMessage onReset={() => setStatus('idle')} />
            ) : (
              <Reveal delay={120}>
                <form onSubmit={handleSubmit} noValidate className="space-y-10">
                  {/* Spam-Falle: für Menschen unsichtbar und nicht per Tab
                      erreichbar, für Screenreader ausgeblendet. Bots füllen
                      solche Felder trotzdem aus und verraten sich dadurch.
                      Bewusst nicht per `display: none` versteckt — darauf sind
                      viele Bots inzwischen trainiert. */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden"
                  >
                    <label htmlFor="website">
                      Dieses Feld bitte leer lassen
                    </label>
                    <input
                      id="website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={data.website}
                      onChange={update}
                    />
                  </div>

                  {/* Name */}
                  <div className="grid gap-8 sm:grid-cols-2">
                    <Field
                      label="Vorname"
                      name="firstName"
                      value={data.firstName}
                      onChange={update}
                      error={errors.firstName}
                      autoComplete="given-name"
                      required
                    />
                    <Field
                      label="Nachname"
                      name="lastName"
                      value={data.lastName}
                      onChange={update}
                      error={errors.lastName}
                      autoComplete="family-name"
                      required
                    />
                  </div>

                  {/* Kontakt */}
                  <div className="grid gap-8 sm:grid-cols-2">
                    <Field
                      label="E-Mail"
                      name="email"
                      type="email"
                      value={data.email}
                      onChange={update}
                      error={errors.email}
                      autoComplete="email"
                      required
                    />
                    <Field
                      label="Telefon"
                      name="phone"
                      type="tel"
                      value={data.phone}
                      onChange={update}
                      error={errors.phone}
                      autoComplete="tel"
                      required
                    />
                  </div>

                  {/* Zeitraum */}
                  <div className="grid gap-8 sm:grid-cols-2">
                    <Field
                      label="Gewünschtes Datum"
                      name="startDate"
                      type="date"
                      value={data.startDate}
                      onChange={update}
                      error={errors.startDate}
                      min={today()}
                      required
                    />
                    <Field
                      label="Rückgabe (optional)"
                      name="endDate"
                      type="date"
                      value={data.endDate}
                      onChange={update}
                      error={errors.endDate}
                      min={data.startDate || today()}
                    />
                  </div>

                  {/* Anlass */}
                  <div>
                    <label htmlFor="occasion" className={labelClass}>
                      Anlass <span className="text-champagne">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="occasion"
                        name="occasion"
                        value={data.occasion}
                        onChange={update}
                        required
                        aria-invalid={Boolean(errors.occasion)}
                        className={`${fieldClass} cursor-pointer appearance-none pr-8 ${
                          errors.occasion ? 'border-champagne' : ''
                        } ${data.occasion ? 'text-ink' : 'text-mist/60'}`}
                      >
                        <option value="">Bitte wählen</option>
                        {occasionOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <svg
                        aria-hidden="true"
                        className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-mist"
                        width="12"
                        height="7"
                        viewBox="0 0 12 7"
                        fill="none"
                      >
                        <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1" />
                      </svg>
                    </div>
                    {errors.occasion && <FieldError message={errors.occasion} />}
                  </div>

                  {/* Abholort */}
                  <Field
                    label="Abholort"
                    name="pickupLocation"
                    value={data.pickupLocation}
                    onChange={update}
                    error={errors.pickupLocation}
                    placeholder="z. B. Standesamt, Hotel oder Adresse"
                  />

                  {/* Nachricht */}
                  <div>
                    <label htmlFor="message" className={labelClass}>
                      Nachricht / besondere Wünsche
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={data.message}
                      onChange={update}
                      rows={4}
                      placeholder="Erzählen Sie uns kurz von Ihrem Anlass …"
                      className={`${fieldClass} resize-none`}
                    />
                  </div>

                  {/* Datenschutz */}
                  <div>
                    <label className="flex cursor-pointer items-start gap-4">
                      {/* Eigene Checkbox: Rahmen füllt sich, Haken blendet ein */}
                      <span className="relative mt-1 flex h-4 w-4 shrink-0 items-center justify-center">
                        <input
                          type="checkbox"
                          name="privacy"
                          checked={data.privacy}
                          onChange={update}
                          aria-invalid={Boolean(errors.privacy)}
                          className={`peer h-4 w-4 cursor-pointer appearance-none border bg-transparent transition-colors duration-300 checked:border-ink checked:bg-ink ${
                            errors.privacy ? 'border-champagne' : 'border-line-strong'
                          }`}
                        />
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 12 10"
                          width="10"
                          height="8"
                          fill="none"
                          className="pointer-events-none absolute text-cream opacity-0 transition-opacity duration-300 peer-checked:opacity-100"
                        >
                          <path
                            d="M1 5L4.5 8.5L11 1.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </span>
                      <span className="text-[0.9375rem] font-normal leading-relaxed text-mist">
                        Ich habe die{' '}
                        <Link
                          href="/datenschutz"
                          className="link-underline text-ink"
                        >
                          Datenschutzerklärung
                        </Link>{' '}
                        gelesen und stimme der Verarbeitung meiner Daten zur
                        Bearbeitung dieser Anfrage zu.{' '}
                        <span className="text-champagne">*</span>
                      </span>
                    </label>
                    {errors.privacy && <FieldError message={errors.privacy} />}
                  </div>

                  {/* Sicherheitsprüfung — bleibt für die meisten Besucher
                      unsichtbar und verlangt nur bei Verdacht eine Aktion. */}
                  {TURNSTILE_SITE_KEY && (
                    <Turnstile
                      siteKey={TURNSTILE_SITE_KEY}
                      onVerify={(token) => {
                        setTurnstileToken(token)
                        setErrorMessage(null)
                        // Eine zuvor gezeigte Warnung ist damit hinfällig.
                        setStatus((previous) =>
                          previous === 'error' ? 'idle' : previous,
                        )
                      }}
                      onExpire={() => setTurnstileToken('')}
                      className="max-w-sm"
                    />
                  )}

                  {/* Absenden */}
                  <div className="flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-[0.875rem] font-normal text-mist">
                      Unverbindlich · Keine Vorkasse
                    </p>
                    <CTAButton
                      type="submit"
                      variant="solid-dark"
                      disabled={status === 'submitting'}
                      className="w-full sm:w-auto"
                    >
                      {status === 'submitting'
                        ? 'Wird gesendet …'
                        : 'Unverbindlich anfragen'}
                    </CTAButton>
                  </div>

                  {status === 'error' && (
                    <p
                      role="alert"
                      className="border-l-2 border-champagne bg-sand/60 px-5 py-4 text-[0.9375rem] font-normal text-ink"
                    >
                      {errorMessage ??
                        'Ihre Anfrage konnte leider nicht übermittelt werden. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt an'}{' '}
                      <a
                        href={`mailto:${site.contact.email}`}
                        className="link-underline"
                      >
                        {site.contact.email}
                      </a>
                      .
                    </p>
                  )}
                </form>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Formular-Bausteine ─────────────────────────────────────── */

interface FieldProps {
  label: string
  name: keyof FormData
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  type?: string
  error?: string
  required?: boolean
  placeholder?: string
  autoComplete?: string
  min?: string
}

function Field({
  label,
  name,
  value,
  onChange,
  type = 'text',
  error,
  required,
  placeholder,
  autoComplete,
  min,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label} {required && <span className="text-champagne">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        min={min}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`${fieldClass} ${error ? 'border-champagne' : ''}`}
      />
      {error && <FieldError id={`${name}-error`} message={error} />}
    </div>
  )
}

function FieldError({ message, id }: { message: string; id?: string }) {
  return (
    <p id={id} role="alert" className="mt-2 text-[0.875rem] font-normal text-champagne">
      {message}
    </p>
  )
}

/** Bestätigung nach erfolgreichem Absenden. */
function SuccessMessage({ onReset }: { onReset: () => void }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[28rem] flex-col justify-center border-t border-ink pt-12"
      style={{ animation: 'fade-up 0.9s cubic-bezier(0.22,1,0.36,1) both' }}
    >
      {/* Feine Linie, die aus dem Nichts einläuft */}
      <div className="mb-10 h-px w-16 origin-left bg-champagne" />

      <p className="eyebrow">Anfrage eingegangen</p>

      <h3 className="display mt-6 text-[clamp(2rem,4.2vw,3.25rem)] text-ink">
        Vielen Dank.
      </h3>

      <p className="lede mt-7 max-w-lg">
        Ihre Anfrage liegt uns vor. Wir prüfen die Verfügbarkeit und melden uns
        in der Regel innerhalb von 24 Stunden persönlich bei Ihnen — mit einem
        individuellen Angebot für Ihren Anlass.
      </p>

      <p className="mt-8 max-w-lg text-[0.9375rem] font-normal leading-relaxed text-mist">
        Sollte Ihr Termin kurzfristig sein, erreichen Sie uns auch direkt unter{' '}
        <a href={`tel:${site.contact.phoneHref}`} className="link-underline text-ink">
          {site.contact.phone}
        </a>
        .
      </p>

      <div className="mt-12">
        <button
          type="button"
          onClick={onReset}
          className="link-underline text-[0.875rem] uppercase tracking-[0.22em] text-mist transition-colors duration-300 hover:text-ink"
        >
          Weitere Anfrage senden
        </button>
      </div>
    </div>
  )
}
