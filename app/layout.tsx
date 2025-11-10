import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Janus Forge - AI Debate Platform',
  description: 'Multi-AI debate orchestrator for comparing different AI platform responses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
