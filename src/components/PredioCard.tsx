import Link from "next/link"
import Image from "next/image"

interface PredioCardProps {
  id: string
  nombre: string
  descripcion: string
  imagen: string
  ubicacion: {
    lat: number
    lng: number
  }
}

export default function PredioCard({ id, nombre, descripcion, imagen, ubicacion }: PredioCardProps) {
  // URL para Google Maps Static API con marcador verde
  const mapUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${ubicacion.lat},${ubicacion.lng}&zoom=15&size=340x150&markers=color:green%7C${ubicacion.lat},${ubicacion.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    : null

  return (
    <div className="rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Imagen principal */}
      <div className="relative h-48 w-full">
        <Image src={imagen || "/placeholder.svg"} alt={nombre} fill className="rounded-t-2xl object-cover" />
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Nombre del predio */}
        <h3 className="font-bold text-primary text-lg mb-2">{nombre}</h3>

        {/* Descripción */}
        <p className="text-slate-600 text-sm line-clamp-2 mb-4 leading-relaxed">{descripcion}</p>

        {/* Mapa miniatura */}
        <div className="mb-4">
          <img
            src={mapUrl || "/placeholder.svg?height=150&width=340&text=Mapa"}
            alt={`Ubicación de ${nombre}`}
            className="w-full h-32 object-cover rounded-lg border border-gray-200"
            onError={(e) => {
              // Fallback si hay error cargando el mapa
              e.currentTarget.src = `/placeholder.svg?height=150&width=340&text=Mapa+de+${encodeURIComponent(nombre)}`
            }}
          />
        </div>

        {/* Botón ver detalle */}
        <Link
          href={`/predios/${id}`}
          className="block w-full bg-primary hover:bg-primary-light text-white text-center py-2 px-4 rounded-xl transition-colors duration-200 font-medium"
        >
          Ver detalle
        </Link>
      </div>
    </div>
  )
}
