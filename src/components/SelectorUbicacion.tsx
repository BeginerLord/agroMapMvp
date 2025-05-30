"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface SelectorUbicacionProps {
  lat: number
  lng: number
  onUbicacionChange: (lat: number, lng: number) => void
}

// Extensión para manipular _getIconUrl
interface LeafletIconPrototypeFix extends L.Icon.Default {
  _getIconUrl?: () => string
}

export default function SelectorUbicacion({ lat, lng, onUbicacionChange }: SelectorUbicacionProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const [isMapReady, setIsMapReady] = useState(false)
  const [latInput, setLatInput] = useState(lat.toString())
  const [lngInput, setLngInput] = useState(lng.toString())

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Fix Leaflet icon issues
    if (typeof window !== "undefined") {
      delete (L.Icon.Default.prototype as LeafletIconPrototypeFix)._getIconUrl

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      })
    }

    // Coordenadas iniciales (Colombia si no hay selección)
    const initialLat = lat || 4.570868
    const initialLng = lng || -74.297333
    
    // Initialize map
    const map = L.map(mapRef.current).setView([initialLat, initialLng], 8)
    mapInstanceRef.current = map

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)

    // Create the marker
    const marker = L.marker([initialLat, initialLng], {
      draggable: true
    }).addTo(map)
    markerRef.current = marker

    // Handle marker drag events
    marker.on('dragend', function() {
      const position = marker.getLatLng()
      setLatInput(position.lat.toFixed(6))
      setLngInput(position.lng.toFixed(6))
      onUbicacionChange(position.lat, position.lng)
    })

    // Handle map click events
    map.on('click', function(e) {
      const latLng = e.latlng
      if (markerRef.current) {
        markerRef.current.setLatLng(latLng)
      }
      setLatInput(latLng.lat.toFixed(6))
      setLngInput(latLng.lng.toFixed(6))
      onUbicacionChange(latLng.lat, latLng.lng)
    })

    setIsMapReady(true)

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markerRef.current = null
      }
    }
  }, [])

  // Update marker position if props change
  useEffect(() => {
    if (markerRef.current && mapInstanceRef.current && isMapReady) {
      markerRef.current.setLatLng([lat, lng])
      mapInstanceRef.current.setView([lat, lng], 14)
    }
  }, [lat, lng, isMapReady])

  // Función para manejar cambios manuales en las coordenadas
  const handleCoordinateChange = () => {
    try {
      const newLat = parseFloat(latInput)
      const newLng = parseFloat(lngInput)
      
      // Validar que sean números válidos y estén en rangos correctos
      if (!isNaN(newLat) && !isNaN(newLng) && 
          newLat >= -90 && newLat <= 90 && 
          newLng >= -180 && newLng <= 180) {
        
        if (markerRef.current && mapInstanceRef.current) {
          markerRef.current.setLatLng([newLat, newLng])
          mapInstanceRef.current.setView([newLat, newLng], 14)
        }
        
        onUbicacionChange(newLat, newLng)
      }
    } catch (error) {
      console.error("Coordenadas inválidas", error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="w-full rounded-lg overflow-hidden border border-gray-300">
        <div ref={mapRef} className="w-full h-[300px]"></div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="latitud" className="block text-sm font-medium text-gray-700 mb-1">
            Latitud
          </label>
          <input
            type="text"
            id="latitud"
            value={latInput}
            onChange={(e) => setLatInput(e.target.value)}
            onBlur={handleCoordinateChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Ej: 4.570868"
          />
        </div>
        <div>
          <label htmlFor="longitud" className="block text-sm font-medium text-gray-700 mb-1">
            Longitud
          </label>
          <input
            type="text"
            id="longitud"
            value={lngInput}
            onChange={(e) => setLngInput(e.target.value)}
            onBlur={handleCoordinateChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Ej: -74.297333"
          />
        </div>
      </div>
    </div>
  )
}