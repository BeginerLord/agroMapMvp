"use client"

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"
import { useMemo } from "react"

interface MapaInteractivoProps {
  lat: number
  lng: number
  nombre: string
}

const containerStyle = {
  width: "100%",
  height: "400px",
}

export default function MapaInteractivo({ lat, lng, nombre }: MapaInteractivoProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  })

  const center = useMemo(
    () => ({
      lat: lat,
      lng: lng,
    }),
    [lat, lng],
  )

  if (!isLoaded) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-2xl shadow border flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-2">Cargando mapa...</p>
          {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
            <p className="text-red-500 text-sm">API key de Google Maps no configurada</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-96 rounded-2xl shadow border overflow-hidden">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={16}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        <Marker
          position={center}
          title={nombre}
          icon={{
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#168821">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            `),
          }}
        />
      </GoogleMap>
    </div>
  )
}
