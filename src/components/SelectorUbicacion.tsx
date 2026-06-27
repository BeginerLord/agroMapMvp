"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { MapPinIcon, ArrowPathIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline"

interface SelectorUbicacionProps {
  lat: number
  lng: number
  onUbicacionChange: (lat: number, lng: number) => void
}

interface LeafletIconPrototypeFix extends L.Icon.Default {
  _getIconUrl?: () => string
}

// Vista inicial: Colombia centrada
const DEFAULT_LAT = 8.757
const DEFAULT_LNG = -75.883
const DEFAULT_ZOOM = 11

export default function SelectorUbicacion({ lat, lng, onUbicacionChange }: SelectorUbicacionProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const [isMapReady, setIsMapReady] = useState(false)
  const [latInput, setLatInput] = useState(lat || 0 ? lat.toString() : "")
  const [lngInput, setLngInput] = useState(lng || 0 ? lng.toString() : "")

  // Estados de geolocalización
  const [geoStatus, setGeoStatus] = useState<"idle" | "loading" | "error">("idle")
  const [geoError, setGeoError] = useState("")

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    if (typeof window !== "undefined") {
      delete (L.Icon.Default.prototype as LeafletIconPrototypeFix)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      })
    }

    const initialLat = lat || DEFAULT_LAT
    const initialLng = lng || DEFAULT_LNG

    const map = L.map(mapRef.current).setView([initialLat, initialLng], DEFAULT_ZOOM)
    mapInstanceRef.current = map

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map)

    // Solo agregar marker si ya hay coordenadas seleccionadas
    if (lat && lng) {
      const marker = L.marker([lat, lng], { draggable: true }).addTo(map)
      markerRef.current = marker
      bindMarkerEvents(marker)
    }

    map.on("click", (e) => {
      const { lat: clickLat, lng: clickLng } = e.latlng
      placeMarker(clickLat, clickLng)
    })

    setIsMapReady(true)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markerRef.current = null
      }
    }
  }, [])

  function bindMarkerEvents(marker: L.Marker) {
    marker.on("dragend", () => {
      const pos = marker.getLatLng()
      setLatInput(pos.lat.toFixed(6))
      setLngInput(pos.lng.toFixed(6))
      onUbicacionChange(pos.lat, pos.lng)
    })
  }

  function placeMarker(newLat: number, newLng: number) {
    const map = mapInstanceRef.current
    if (!map) return

    if (markerRef.current) {
      markerRef.current.setLatLng([newLat, newLng])
    } else {
      const marker = L.marker([newLat, newLng], { draggable: true }).addTo(map)
      markerRef.current = marker
      bindMarkerEvents(marker)
    }

    setLatInput(newLat.toFixed(6))
    setLngInput(newLng.toFixed(6))
    onUbicacionChange(newLat, newLng)
  }

  function handleCoordinateChange() {
    const newLat = parseFloat(latInput)
    const newLng = parseFloat(lngInput)
    if (isNaN(newLat) || isNaN(newLng)) return
    if (newLat < -90 || newLat > 90 || newLng < -180 || newLng > 180) return

    mapInstanceRef.current?.setView([newLat, newLng], 14)
    placeMarker(newLat, newLng)
  }

  // ── Geolocalización ──────────────────────────────────────────
  function usarMiUbicacion() {
    if (!navigator.geolocation) {
      setGeoStatus("error")
      setGeoError("Tu navegador no soporta geolocalización.")
      return
    }

    setGeoStatus("loading")
    setGeoError("")

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        mapInstanceRef.current?.setView([latitude, longitude], 16)
        placeMarker(latitude, longitude)
        setGeoStatus("idle")
      },
      (err) => {
        setGeoStatus("error")
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError("Permiso de ubicación denegado. Actívalo en la configuración del navegador.")
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setGeoError("No se pudo determinar tu ubicación. Intenta de nuevo.")
        } else {
          setGeoError("Tiempo de espera agotado. Intenta de nuevo.")
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  return (
    <div className="space-y-3">

      {/* Botón de geolocalización */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Haz clic en el mapa o usa tu ubicación actual
        </p>
        <button
          type="button"
          onClick={usarMiUbicacion}
          disabled={geoStatus === "loading"}
          className={`
            inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg
            border transition-all duration-200 disabled:cursor-not-allowed
            ${geoStatus === "loading"
              ? "border-agro-olive/30 bg-agro-pastel/50 text-agro-olive/60"
              : geoStatus === "error"
                ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                : "border-agro-olive/40 bg-agro-pastel/60 text-agro-olive hover:bg-agro-pastel hover:border-agro-olive"
            }
          `}
        >
          {geoStatus === "loading" ? (
            <>
              <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />
              Obteniendo…
            </>
          ) : (
            <>
              <MapPinIcon className="w-3.5 h-3.5" />
              Usar mi ubicación
            </>
          )}
        </button>
      </div>

      {/* Error de geolocalización */}
      {geoStatus === "error" && geoError && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-xs text-red-700">
          <ExclamationTriangleIcon className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{geoError}</span>
        </div>
      )}

      {/* Mapa */}
      <div className="isolate relative w-full rounded-2xl overflow-hidden border border-agro-sand shadow-sm">
        <div ref={mapRef} className="w-full h-72" />
        {/* Hint superpuesto si no hay marker */}
        {isMapReady && !latInput && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none">
            <span className="bg-white/90 backdrop-blur-sm text-xs text-muted-foreground px-3 py-1.5 rounded-full shadow-sm border border-agro-sand/60">
              Haz clic para marcar la ubicación
            </span>
          </div>
        )}
      </div>

      {/* Inputs de coordenadas */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="latitud" className="agro-label">Latitud</label>
          <input
            type="text"
            id="latitud"
            value={latInput}
            onChange={(e) => setLatInput(e.target.value)}
            onBlur={handleCoordinateChange}
            className="agro-input font-mono text-sm"
            placeholder="Ej: 8.879202"
          />
        </div>
        <div>
          <label htmlFor="longitud" className="agro-label">Longitud</label>
          <input
            type="text"
            id="longitud"
            value={lngInput}
            onChange={(e) => setLngInput(e.target.value)}
            onBlur={handleCoordinateChange}
            className="agro-input font-mono text-sm"
            placeholder="Ej: -75.767344"
          />
        </div>
      </div>
    </div>
  )
}
