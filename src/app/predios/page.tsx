import PredioCard from "@/components/PredioCard"
import prediosData from "@/data/predios.json"
import Link from "next/link"
import { PlusIcon } from "@heroicons/react/24/outline"

export const metadata = {
  title: "Predios Registrados - AgroMap MVP",
  description: "Listado de predios agrícolas registrados en el sistema AgroMap",
}

export default function PrediosPage() {
  return (
    <div className="py-8">
      {/* Título principal y botón de nuevo predio */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-primary">Predios registrados</h1>
        <Link href="/predios/nuevo" className="bg-primary hover:bg-primary-dark text-white 
          font-medium px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
          <PlusIcon className="w-5 h-5" />
          Nuevo predio
        </Link>
      </div>

      {/* Grid de predios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {prediosData.map((predio) => (
          <PredioCard
            key={predio.id}
            id={predio.id}
            nombre={predio.nombre}
            descripcion={predio.descripcion}
            imagen={predio.imagen}
            imagen2={predio.imagen2}
          />
        ))}
      </div>

      {/* Mensaje si no hay predios */}
      {prediosData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600 text-lg">No hay predios registrados aún.</p>
        </div>
      )}
    </div>
  )
}