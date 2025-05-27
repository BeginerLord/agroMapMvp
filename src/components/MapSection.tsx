"use client";

import dynamic from "next/dynamic";

// Dynamically import MapaInteractivo with SSR disabled
const MapaInteractivo = dynamic(
  () => import("@/components/MapaInteractivo"),
  { ssr: false }
);

interface MapaSectionProps {
  lat: number;
  lng: number;
  nombre: string;
}

export default function MapaSection({ lat, lng, nombre }: MapaSectionProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-primary mb-4">Ubicación</h2>
      <MapaInteractivo lat={lat} lng={lng} nombre={nombre} />
    </div>
  );
}