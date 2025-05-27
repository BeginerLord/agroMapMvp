import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import Header from "./components/header"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

export const metadata = {
  title: "AgroMap MVP - Cultivando seguridad alimentaria",
  description: "Sistema de monitoreo agrícola para el municipio de Cereté",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.className}>
      <body className="bg-gray-50 text-slate-800 antialiased">
        <Header />
        <main className="mx-auto max-w-7xl p-4">{children}</main>
      </body>
    </html>
  )
}
