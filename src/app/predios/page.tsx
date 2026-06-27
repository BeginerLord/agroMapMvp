import { readFileSync } from "fs"
import { join } from "path"
import PredioCard from "@/components/PredioCard"
import bitacoraData from "@/data/bitacora.json"
import Link from "next/link"
import { PlusIcon, MapPinIcon, ClipboardDocumentListIcon, BuildingOffice2Icon } from "@heroicons/react/24/outline"

// Leer en cada request para reflejar predios recién creados
export const dynamic = "force-dynamic"

export const metadata = {
  title: "AgroMap-Cereté · Predios",
  description: "Gestión georreferenciada de predios agrícolas en Cereté",
}

function getPredios() {
  const path = join(process.cwd(), "src", "data", "predios.json")
  return JSON.parse(readFileSync(path, "utf-8")) as Array<{
    id: string
    nombre: string
    descripcion: string
    imagen: string
    ubicacion: { lat: number; lng: number }
  }>
}

export default function PrediosPage() {
  const prediosData = getPredios()
  const totalActividades = bitacoraData.length
  const prediosActivos = prediosData.length

  const stats = [
    {
      icon: <MapPinIcon className="w-5 h-5" />,
      value: prediosActivos,
      label: prediosActivos === 1 ? "Predio registrado" : "Predios registrados",
    },
    {
      icon: <ClipboardDocumentListIcon className="w-5 h-5" />,
      value: totalActividades,
      label: totalActividades === 1 ? "Actividad en bitácora" : "Actividades en bitácora",
    },
    {
      icon: <BuildingOffice2Icon className="w-5 h-5" />,
      value: "Cereté",
      label: "Municipio focalizado",
    },
  ]

  return (
    <div className="animate-fade-in space-y-8">

      {/* Banner principal */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-agro-pastel via-agro-white to-agro-beige px-4 py-6 sm:px-8 sm:py-10">
        <div className="absolute -top-8 -right-8 w-56 h-56 rounded-full bg-agro-green/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 w-40 h-40 rounded-full bg-agro-yellow/15 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold text-agro-olive uppercase tracking-widest mb-1">
              Municipio de Cereté · Córdoba
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Predios agrícolas
            </h1>
            <p className="text-muted-foreground mt-2 max-w-md text-sm leading-relaxed">
              Monitoreo georreferenciado de cultivos periurbanos para fortalecer
              la seguridad alimentaria estudiantil.
            </p>
          </div>

          <Link
            href="/predios/nuevo"
            className="agro-btn-primary inline-flex items-center gap-2 self-start sm:self-auto shrink-0"
          >
            <PlusIcon className="w-4 h-4" />
            Nuevo predio
          </Link>
        </div>

        {/* Stats */}
        <div className="relative mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {stats.map(({ icon, value, label }) => (
            <div
              key={label}
              className="bg-white/70 backdrop-blur-sm border border-agro-sand/60 rounded-2xl px-4 py-3 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-agro-pastel text-agro-olive flex items-center justify-center shrink-0">
                {icon}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-foreground text-lg leading-none">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid */}
      {prediosData.length > 0 ? (
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Todos los predios
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {prediosData.map((predio) => {
              const actividades = bitacoraData.filter((b) => b.predioId === predio.id).length
              return (
                <PredioCard
                  key={predio.id}
                  id={predio.id}
                  nombre={predio.nombre}
                  descripcion={predio.descripcion}
                  imagen={predio.imagen}
                  lat={predio.ubicacion.lat}
                  lng={predio.ubicacion.lng}
                  actividadesCount={actividades}
                />
              )
            })}
          </div>
        </div>
      ) : (
        <div className="agro-card p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-agro-pastel mx-auto mb-4 flex items-center justify-center">
            <MapPinIcon className="w-8 h-8 text-agro-olive" />
          </div>
          <p className="text-foreground font-semibold mb-1">Sin predios registrados</p>
          <p className="text-muted-foreground text-sm mb-4">
            Comienza registrando tu primer predio agrícola.
          </p>
          <Link href="/predios/nuevo" className="agro-btn-primary inline-flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            Registrar predio
          </Link>
        </div>
      )}
    </div>
  )
}
