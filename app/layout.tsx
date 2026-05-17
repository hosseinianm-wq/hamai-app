import "./globals.css"
import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "HamAI - دستیار هوشمند",
  description: "پروژه HamAI برای مدیریت هوشمند",
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192.png",
  },
  manifest: "/manifest.webmanifest",
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl"> {/* dir="rtl" اضافه شد */}
      <body>{children}</body>
    </html>
  )
}
