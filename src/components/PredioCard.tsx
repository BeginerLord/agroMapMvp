"use client"
import Link from "next/link"
import Image from "next/image"

interface PredioCardProps {
  id: string
  nombre: string
  descripcion: string
  imagen: string
  imagen2?: string 

}

export default function PredioCard({ id, nombre, descripcion, imagen,  imagen2 }: PredioCardProps) {
 
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

          {/* Imagen secundaria (reemplaza el mapa) */}
        {imagen2 && imagen2.trim() !== "" && (
          <div className="mb-4">
            <div className="relative h-32 w-full">
              <img
                src={imagen2}
    
                className="w-full h-full object-cover rounded-lg border border-gray-200"
                onError={(e) => {
                  e.currentTarget.src = `/placeholder.svg?height=150&width=340&text=Vista+adicional`;
                }}
              />
            </div>
          </div>
        )}

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