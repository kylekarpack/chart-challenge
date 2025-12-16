import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Chart Challenge',
  description: 'A Next.js chart challenge application',
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

