import type { Metadata } from 'next'
import './globals.css'
import Navigation from '../components/Navigation'

export const metadata: Metadata = {
  title: 'Janus Forge - AI-Moderated Debate Platform',
  description: 'Guide conversations between multiple AI systems. Human-controlled moderation and interactive debates.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  )
}
