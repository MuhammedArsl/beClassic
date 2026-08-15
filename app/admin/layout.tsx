import type { Metadata } from 'next'

/**
 * Rahmen des Dashboards.
 *
 * Das Dashboard nutzt dasselbe Farb- und Schriftsystem wie die Website
 * (siehe app/globals.css), ist aber dichter gesetzt — hier wird gearbeitet,
 * nicht gestöbert.
 */

export const metadata: Metadata = {
  title: 'Dashboard',
  // Ein Verwaltungsbereich hat in Suchmaschinen nichts verloren.
  robots: { index: false, follow: false },
}

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen bg-cream">{children}</div>
}
