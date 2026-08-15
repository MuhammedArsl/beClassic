import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import VehicleShowcase from '@/components/VehicleShowcase'
import Occasions from '@/components/Occasions'
import InquiryForm from '@/components/InquiryForm'
import Footer from '@/components/Footer'
import { featuredVehicle } from '@/data/vehicles'
import { getUseCasesByIds, lifestyleImages } from '@/data/occasions'
import { site } from '@/data/site'

/**
 * Landingpage.
 *
 * AUFBAU — drei Sektionen, mehr nicht:
 *   Hero      Das Fahrzeug im Bild, ein Satz, ein Knopf.
 *   01        Das Fahrzeug — Bild, vier Eckdaten, ein Absatz.
 *   02        Vermietung — wofür, in Stichworten, dann Bilder.
 *   03        Anfrage — Formular, Ablauf und Kontakt daneben.
 *
 * Zuvor waren es sechs Sektionen: „Anlässe“ und „Erlebnis“ sagten
 * dasselbe zweimal und stecken jetzt in 02; der „Ablauf“ stand als eigener
 * Abschnitt zwischen Besucher und Formular und steht nun daneben.
 *
 * Das Fahrzeug wird einmal aus `data/vehicles.ts` geladen und an die
 * Sektionen durchgereicht — nirgendwo steht ein Fahrzeug fest im Markup.
 * Kommt ein zweites hinzu, genügt es, hier auf eine Liste umzustellen.
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
        <VehicleShowcase vehicle={vehicle} variant="kompakt" />
        <Occasions useCases={useCases} images={lifestyleImages} />
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
            areaServed: { '@type': 'Country', name: 'Österreich' },
            address: {
              '@type': 'PostalAddress',
              streetAddress: site.contact.address.street,
              postalCode: site.contact.address.zip,
              addressLocality: site.contact.address.city,
              addressCountry: 'AT',
            },
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
