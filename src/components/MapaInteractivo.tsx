"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface MapaInteractivoProps {
  lat: number
  lng: number
  nombre: string
}

export default function MapaInteractivo({ lat, lng, nombre }: MapaInteractivoProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    // Carga de Leaflet solo en el cliente
    if (!mapRef.current || mapInstanceRef.current) return;

    // Añadir iconos de Leaflet (necesario porque Next.js rompe las rutas relativas)
    if (typeof window !== "undefined") {
      // Soluciona el problema de los iconos en Leaflet con Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      });
    }

    // Crear mapa
    const map = L.map(mapRef.current).setView([lat, lng], 16);
    mapInstanceRef.current = map;

    // Añadir capa de OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Añadir marcador
    const marker = L.marker([lat, lng])
      .addTo(map)
      .bindPopup(nombre);
    
    // Mostrar el popup por defecto
    marker.openPopup();

    // Limpieza al desmontar el componente
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