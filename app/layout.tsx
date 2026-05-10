import "./globals.css";
import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const vazir = Vazirmatn({
  subsets: ["arabic"],
});
export const metadata: Metadata = {
  title: "HamAI",
  description: "HamAI Assistant",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa">
      <body className={vazir.className}>
        {children}
      </body>
          </html>
  );
}