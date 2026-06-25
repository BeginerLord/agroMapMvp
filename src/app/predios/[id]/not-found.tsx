import Link from "next/link"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-sm mx-auto px-4 animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-agro-pastel mx-auto mb-6 flex items-center justify-center">
          <span className="text-3xl font-bold text-agro-olive">404</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Predio no encontrado</h2>
        <p className="text-muted-foreground mb-8 text-sm">
          El predio que buscas no existe o fue eliminado del sistema.
        </p>
        <Link
          href="/predios"
          className="agro-btn-primary inline-flex items-center gap-2"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Volver a predios
        </Link>
      </div>
    </div>
  )
}
