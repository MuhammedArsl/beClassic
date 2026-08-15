import { Suspense } from 'react'
import LoginForm from '@/components/admin/LoginForm'
import { isAuthConfigured } from '@/lib/admin-auth'
import { site } from '@/data/site'

export default function LoginPage() {
  const configured = isAuthConfigured()

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <p className="eyebrow">{site.name}</p>
        <h1 className="display mt-4 text-[2.5rem] leading-tight text-ink">
          Dashboard
        </h1>
        <p className="mt-4 text-[0.9375rem] text-mist">
          Anfragen ansehen, beantworten und Termine bestätigen.
        </p>

        {configured ? (
          <Suspense>
            <LoginForm />
          </Suspense>
        ) : (
          <div className="mt-10 border-l-2 border-champagne bg-sand/60 px-5 py-4 text-[0.9375rem] text-ink">
            <p className="font-medium">Zugang noch nicht eingerichtet.</p>
            <p className="mt-2 text-mist">
              Bitte in <code className="text-ink">.env.local</code> hinterlegen und
              den Server neu starten:
            </p>
            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-all text-[0.8125rem] leading-relaxed text-ink">
              ADMIN_PASSWORD=…{'\n'}ADMIN_SESSION_SECRET=…
            </pre>
          </div>
        )}
      </div>
    </main>
  )
}
