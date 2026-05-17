import "./globals.css"
import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "HamAI",
  description: "HamAI Assistant",

  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192.png"
  },

  manifest: "/manifest.webmanifest"
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa">
      <body>{children}</body>
    </html>
  )
}
