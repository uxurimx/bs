import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SaaS Starter App',
    short_name: 'SaaS App',
    description: 'Una plantilla SaaS progresiva y eficiente.',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b', // Coincide con tu dark mode (Zinc 950)
    theme_color: '#09090b',
    icons: [
      {
        src: './icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: './icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}