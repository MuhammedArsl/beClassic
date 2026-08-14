import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import VehicleShowcase from '@/components/VehicleShowcase'
import InquiryForm from '@/components/InquiryForm'
import Reveal from '@/components/Reveal'
import { getVehicleBySlug, vehicles } from '@/data/vehicles'

interface PageProps {
  params: Promise<{ slug: string }>
}

/** Erzeugt zur Buildzeit eine statische Seite je Fahrzeug. */
export function generateStaticParams() {
  return vehicles.map((vehicle) => ({ slug: vehicle.slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const vehicle = getVehicleBySlug(slug)

  if (!vehicle) return { title: 'Fahrzeug nicht gefunden' }

  return {
    title: vehicle.name,
    description: vehicle.intro,
    openGraph: {
      title: vehicle.name,
      description: vehicle.intro,
      images: [{ url: vehicle.featuredImage.src }],
    },
  }
}

/**
 * Fahrzeug-Detailseite.
 *
 * Nutzt dieselben Komponenten wie die Landingpage — dadurch sieht ein neues
 * Fahrzeug ohne zusätzlichen Aufwand genauso hochwertig aus.
 */
export default async function VehiclePage({ params }: PageProps) {
  const { slug } = await params
  const vehicle = getVehicleBySlug(slug)

  if (!vehicle || !vehicle.available) notFound()

  return (
    <>
      <Navigation variant="solid" />

      <main id="inhalt" className="bg-cream pt-32 sm:pt-40">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
          <Reveal>
            <Link
              href="/fahrzeuge"
              className="link-underline text-[0.875rem] uppercase tracking-[0.22em] text-mist transition-colors duration-300 hover:text-ink"
            >
              ← Alle Fahrzeuge
            </Link>
          </Reveal>
        </div>

        {/* Ohne Sektionsnummern — die Durchnummerierung gilt nur der Landingpage. */}
        <VehicleShowcase vehicle={vehicle} showIndex={false} />
        <InquiryForm vehicle={vehicle} showIndex={false} />
      </main>

      <Footer />
    </>
  )
}
