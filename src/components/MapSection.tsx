"use client"

import dynamic from "next/dynamic"

const MapaInteractivo = dynamic(() => import("@/components/MapaInteractivo"), { ssr: false })

interface MapaSectionProps {
  lat: number
  lng: number
  nombre: string
}

export default function MapaInteractivoSection({ lat, lng, nombre }: MapaSectionProps) {
  return <MapaInteractivo lat={lat} lng={lng} nombre={nombre} />
}
