import type { Metadata, Viewport } from "next"
import { Vazirmatn } from "next/font/google"

export const dynamic = "force-dynamic"
export const revalidate = 0

const vazir = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  weight: ["400", "500", "700"]
})

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
}

export const metadata: Metadata = {
  title: "HamAI",
  description: "HamAI voice assistant progressive web app",
  applicationName: "HamAI",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "HamAI"
  },
  formatDetection: {
    telephone: false
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/icons/icon-72x72.png",
    apple: "/icons/icon-192x192.png"
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable}>
      <body className={vazir.className}>
        {children}
      </body>
    </html>
  )
}
