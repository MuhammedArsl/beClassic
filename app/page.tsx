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

      {/*
        Strukturierte Daten — so liest Google, was hier angeboten wird.

        Ausgeliefert wird ein @graph mit drei verbundenen Knoten statt eines
        einzelnen: das Unternehmen (AutoRental, eine Unterart von
        LocalBusiness), die Website und das Fahrzeug. Über die `@id` weiß
        Google, dass alle drei dasselbe Haus betreffen — bei drei losen
        Objekten muss es das raten.

        Der Ortsbezug steht bewusst mehrfach drin (areaServed, address,
        geo): Danach entscheidet sich, ob die Seite bei „Oldtimer mieten
        Wien" überhaupt in die lokale Auswahl kommt.
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'AutoRental',
                '@id': `${site.url}/#unternehmen`,
                name: site.name,
                description: site.description,
                url: site.url,
                email: site.contact.email,
                telephone: site.contact.phone,
                image: `${site.url}${vehicle.heroImage.src}`,
                // Ohne Straße — die echte Geschäftsanschrift steht noch aus,
                // und eine erfundene wäre schlimmer als keine.
                address: {
                  '@type': 'PostalAddress',
                  addressLocality: site.contact.address.city,
                  addressRegion: 'Wien',
                  addressCountry: 'AT',
                },
                // Wien als Mittelpunkt (Stephansdom). Der Punkt ordnet das
                // Angebot geografisch ein, ohne eine Anschrift zu behaupten.
                geo: {
                  '@type': 'GeoCoordinates',
                  latitude: 48.2082,
                  longitude: 16.3738,
                },
                // Zuerst die Stadt, dann das Land: Wien ist der Markt, das
                // übrige Österreich wird beliefert.
                areaServed: [
                  { '@type': 'City', name: 'Wien' },
                  { '@type': 'Country', name: 'Österreich' },
                ],
                currenciesAccepted: 'EUR',
                ...(site.social.instagram ? { sameAs: [site.social.instagram] } : {}),
                makesOffer: {
                  '@type': 'Offer',
                  availableAtOrFrom: { '@type': 'City', name: 'Wien' },
                  priceCurrency: 'EUR',
                  itemOffered: { '@id': `${site.url}/#fahrzeug` },
                },
              },
              {
                '@type': 'WebSite',
                '@id': `${site.url}/#website`,
                url: site.url,
                name: site.name,
                inLanguage: 'de-AT',
                publisher: { '@id': `${site.url}/#unternehmen` },
              },
              {
                '@type': 'Car',
                '@id': `${site.url}/#fahrzeug`,
                name: vehicle.name,
                brand: { '@type': 'Brand', name: vehicle.make },
                model: vehicle.model,
                modelDate: String(vehicle.year),
                vehicleSeatingCapacity: 2,
                vehicleTransmission: 'Manuell',
                bodyType: 'Roadster',
                image: `${site.url}${vehicle.heroImage.src}`,
              },
            ],
          }),
        }}
      />
    </>
  )
}
