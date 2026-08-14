import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // Die Platzhalterbilder in /public/images sind SVGs. Sobald echte Fotos
    // (JPG/WebP) hinterlegt sind, koennen die naechsten drei Zeilen entfallen.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

export default nextConfig
