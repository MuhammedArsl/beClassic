import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import CTAButton from '@/components/CTAButton'

export default function NotFound() {
  return (
    <>
      <Navigation variant="solid" />

      <main
        id="inhalt"
        className="flex min-h-[70vh] items-center bg-cream pb-32 pt-40"
      >
        <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-10">
          <div className="max-w-2xl">
            <p className="eyebrow">Fehler 404</p>
            <h1 className="display mt-6 text-[clamp(2.5rem,6vw,4.5rem)] text-ink">
              Diese Seite ist{' '}
              <span className="italic text-champagne">nicht verfügbar.</span>
            </h1>
            <p className="lede mt-8">
              Der aufgerufene Link führt ins Leere. Zurück zur Startseite — dort
              finden Sie unser Fahrzeug und das Anfrageformular.
            </p>
            <div className="mt-12">
              <CTAButton href="/" variant="solid-dark">
                Zur Startseite
              </CTAButton>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
