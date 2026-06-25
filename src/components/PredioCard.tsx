"use client"

import Link from "next/link"
import Image from "next/image"
import { MapPinIcon, ClipboardDocumentListIcon, ArrowRightIcon } from "@heroicons/react/24/outline"

interface PredioCardProps {
  id: string
  nombre: string
  descripcion: string
  imagen: string
  lat?: number
  lng?: number
  actividadesCount?: number
  /** @deprecated usar lat/lng directamente */
  imagen2?: string
  onImageClick?: () => void
}

export default function PredioCard({
  id,
  nombre,
  descripcion,
  imagen,
  lat,
  lng,
  actividadesCount = 0,
  onImageClick,
}: PredioCardProps) {
  return (
    <div className="group agro-card overflow-hidden flex flex-col">
      {/* Imagen principal con overlay */}
      <div
        className="relative h-52 w-full overflow-hidden shrink-0 cursor-pointer"
        onClick={onImageClick}
      >
        <Image
          src={imagen || "/placeholder.svg"}
          alt={nombre}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Gradiente inferior */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Badge de coordenadas sobre la imagen */}
        {lat !== undefined && lng !== undefined && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
            <MapPinIcon className="w-3 h-3" />
            {lat.toFixed(3)}, {lng.toFixed(3)}
          </div>
        )}

        {/* Badge de actividades */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-agro-olive/90 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium">
          <ClipboardDocumentListIcon className="w-3 h-3" />
          {actividadesCount} {actividadesCount === 1 ? "actividad" : "actividades"}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-foreground text-lg leading-tight mb-2">{nombre}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed flex-1 mb-5">
          {descripcion}
        </p>

        <Link
          href={`/predios/${id}`}
          className="agro-btn-primary flex items-center justify-center gap-2 text-sm"
        >
          Ver detalle
          <ArrowRightIcon className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
