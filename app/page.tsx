import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import VehicleShowcase from '@/components/VehicleShowcase'
import Occasions from '@/components/Occasions'
import Lifestyle from '@/components/Lifestyle'
import Process from '@/components/Process'
import InquiryForm from '@/components/InquiryForm'
import Footer from '@/components/Footer'
import { featuredVehicle } from '@/data/vehicles'
import { getUseCasesByIds, lifestyleImages } from '@/data/occasions'
import { site } from '@/data/site'

/**
 * Landingpage.
 *
 * Das Fahrzeug wird einmal aus `data/vehicles.ts` geladen und an die Sektionen
 * durchgereicht — nirgendwo steht ein Fahrzeug fest im Markup. Kommt ein
 * zweites Fahrzeug hinzu, genügt es, hier auf eine Liste umzustellen.
 */
export default function Home() {
  const vehicle = featuredVehicle
  // Es werden nur die Anlässe gezeigt, für die dieses Fahrzeug angeboten wird.
  const useCases = getUseCasesByIds(vehicle.availableUses)

  return (
    <>
      <Navigation variant="overlay" />

      <main id="inhalt">
        <Hero vehicle={vehicle} />
        <VehicleShowcase vehicle={vehicle} />
        <Occasions useCases={useCases} />
        <Lifestyle vehicle={vehicle} images={lifestyleImages} />
        <Process />
        <InquiryForm vehicle={vehicle} />
      </main>

      <Footer />

      {/* Strukturierte Daten — hilft Google, das Angebot korrekt einzuordnen. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AutoRental',
            name: site.name,
            description: site.description,
            url: site.url,
            email: site.contact.email,
            telephone: site.contact.phone,
            areaServed: site.contact.city,
            makesOffer: {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Car',
                name: vehicle.name,
                brand: { '@type': 'Brand', name: vehicle.make },
                modelDate: String(vehicle.year),
                vehicleSeatingCapacity: 2,
                vehicleTransmission: 'Manuell',
              },
            },
          }),
        }}
      />
    </>
  )
}
