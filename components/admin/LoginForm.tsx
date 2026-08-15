'use client'

import { useState, type FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

/** Anmeldeformular. Setzt bei Erfolg das Sitzungscookie und leitet weiter. */
export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        setError(payload?.error ?? 'Anmeldung fehlgeschlagen.')
        return
      }

      // Zurück zum ursprünglich angefragten Pfad (siehe middleware.ts).
      const target = searchParams.get('weiter') ?? '/admin'
      // Der Serverzustand kennt das neue Cookie noch nicht — ohne refresh
      // käme eine zwischengespeicherte Fassung der Seite zurück.
      router.replace(target.startsWith('/admin') ? target : '/admin')
      router.refresh()
    } catch {
      setError('Der Server ist gerade nicht erreichbar.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-6">
      <div>
        <label
          htmlFor="password"
          className="block text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-mist"
        >
          Passwort
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          autoFocus
          required
          className="mt-2 w-full border-b border-line-strong bg-transparent pb-3 pt-2 text-[1.0625rem] text-ink outline-none transition-colors duration-300 focus:border-ink"
        />
      </div>

      {error && (
        <p
          role="alert"
          className="border-l-2 border-champagne bg-sand/60 px-4 py-3 text-[0.9375rem] text-ink"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy || !password}
        className="w-full bg-ink px-6 py-4 text-[0.8125rem] uppercase tracking-[0.22em] text-cream transition-opacity duration-300 hover:opacity-85 disabled:opacity-40"
      >
        {busy ? 'Wird geprüft …' : 'Anmelden'}
      </button>
    </form>
  )
}
