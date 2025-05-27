"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface MapaInteractivoProps {
  lat: number
  lng: number
  nombre: string
}

// Extensión para manipular _getIconUrl
interface LeafletIconPrototypeFix extends L.Icon.Default {
  _getIconUrl?: () => string
}

export default function MapaInteractivo({ lat, lng, nombre }: MapaInteractivoProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    if (typeof window !== "undefined") {
      // Eliminar _getIconUrl de forma segura
      delete (L.Icon.Default.prototype as LeafletIconPrototypeFix)._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      });
    }

    const map = L.map(mapRef.current).setView([lat, lng], 16);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const marker = L.marker([lat, lng])
      .addTo(map)
      .bindPopup(nombre);

    marker.openPopup();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, nombre]);

  return (
    <div className="w-full h-96 rounded-2xl shadow border overflow-hidden">
      <div ref={mapRef} className="w-full h-full"></div>
    </div>
  );
}
