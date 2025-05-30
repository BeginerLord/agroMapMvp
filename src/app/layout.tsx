import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import ConditionalHeader from "./components/ConditionalHeader"


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
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
          integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
          crossOrigin=""
        />
      </head>
      <body className="">
        <ConditionalHeader />
        <main className="">{children}</main>
      </body>
    </html>
  )
}