import Link from "next/link"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Predio no encontrado</h2>
        <p className="text-slate-600 mb-8">El predio que buscas no existe o ha sido eliminado del sistema.</p>
        <Link
          href="/predios"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-xl transition-colors font-medium"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Volver a predios
        </Link>
      </div>
    </div>
  )
}
