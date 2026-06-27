import { readFileSync } from "fs"
import { join } from "path"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeftIcon,
  MapPinIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline"

import BitacoraItem from "@/components/BitacoraItem"
import GaleriaImagenes from "@/components/GaleriaImagenes"
import MapaInteractivoSection from "@/components/MapSection"
import AddBitacoraModal from "@/components/AddBitacoraModal"

export const dynamic = "force-dynamic"

type Predio = {
  id: string
  nombre: string
  descripcion: string
  imagen: string
  imagen2?: string
  galeria?: string[]
  ubicacion: { lat: number; lng: number }
}

type EntradaBitacora = {
  id: string
  predioId: string
  fechaISO: string
  actividad: string
  comentario: string
  foto: string
}

function getPredios(): Predio[] {
  return JSON.parse(readFileSync(join(process.cwd(), "src", "data", "predios.json"), "utf-8"))
}

function getBitacora(): EntradaBitacora[] {
  return JSON.parse(readFileSync(join(process.cwd(), "src", "data", "bitacora.json"), "utf-8"))
}

export async function generateStaticParams() {
  return getPredios().map((predio) => ({ id: predio.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const predio = getPredios().find((p) => p.id === id)
  if (!predio) return { title: "Predio no encontrado · AgroMap-Cereté" }
  return {
    title: `${predio.nombre} · AgroMap-Cereté`,
    description: predio.descripcion,
  }
}

export default async function PredioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const predio = getPredios().find((p) => p.id === id)
  if (!predio) notFound()

  const bitacoraPredio = getBitacora()
    .filter((item) => item.predioId === id)
    .sort((a, b) => new Date(b.fechaISO).getTime() - new Date(a.fechaISO).getTime())

  const imagenesGaleria = predio.galeria?.length
    ? predio.galeria
    : [
        "/placeholder.svg?height=400&width=300&text=Vista+aérea",
        "/placeholder.svg?height=300&width=400&text=Cultivo+principal",
        "/placeholder.svg?height=500&width=350&text=Instalaciones",
      ]

  return (
    <div className="animate-fade-in -mt-2">

      {/* Back */}
      <Link
        href="/predios"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-agro-olive transition-colors font-medium mb-5"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Volver a predios
      </Link>

      {/* Hero */}
      <div className="relative w-full h-72 md:h-96 rounded-3xl overflow-hidden mb-6 shadow-lg">
        <Image
          src={predio.imagen || "/placeholder.svg"}
          alt={predio.nombre}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="flex items-center gap-1 bg-white/15 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium border border-white/20">
              <span className="w-1.5 h-1.5 rounded-full bg-agro-green inline-block" />
              Activo
            </span>
            <span className="flex items-center gap-1 bg-white/15 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full border border-white/20">
              <ClipboardDocumentListIcon className="w-3.5 h-3.5" />
              {bitacoraPredio.length} {bitacoraPredio.length === 1 ? "actividad" : "actividades"}
            </span>
            <span className="flex items-center gap-1 bg-white/15 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full border border-white/20">
              <PhotoIcon className="w-3.5 h-3.5" />
              {imagenesGaleria.length} {imagenesGaleria.length === 1 ? "foto" : "fotos"}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight drop-shadow-sm">
            {predio.nombre}
          </h1>
        </div>
      </div>

      {/* Descripción + meta */}
      <div className="agro-card p-6 mb-6">
        <p className="text-foreground/80 leading-relaxed text-base max-w-3xl mb-5">
          {predio.descripcion}
        </p>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5 bg-agro-pastel text-agro-olive rounded-xl px-3 py-1.5 text-sm font-medium">
            <MapPinIcon className="w-4 h-4" />
            {predio.ubicacion.lat.toFixed(5)}, {predio.ubicacion.lng.toFixed(5)}
          </div>
          <div className="flex items-center gap-1.5 bg-agro-sand/50 text-foreground/60 rounded-xl px-3 py-1.5 text-sm">
            <CalendarDaysIcon className="w-4 h-4" />
            Actualizado: {new Date().toLocaleDateString("es-CO")}
          </div>
        </div>
      </div>

      {/* Mapa + Info (2 columnas) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <div className="lg:col-span-2 agro-card p-5">
          <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <MapPinIcon className="w-4 h-4 text-agro-olive" />
            Ubicación del predio
          </h2>
          <MapaInteractivoSection lat={predio.ubicacion.lat} lng={predio.ubicacion.lng} nombre={predio.nombre} />
        </div>

        <div className="agro-card p-5 flex flex-col gap-4">
          <h2 className="text-base font-semibold text-foreground">Información del predio</h2>
          <InfoRow label="Estado">
            <span className="flex items-center gap-1.5 text-sm font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Activo
            </span>
          </InfoRow>
          <InfoRow label="Latitud">
            <span className="text-sm font-mono text-foreground/80">{predio.ubicacion.lat.toFixed(6)}</span>
          </InfoRow>
          <InfoRow label="Longitud">
            <span className="text-sm font-mono text-foreground/80">{predio.ubicacion.lng.toFixed(6)}</span>
          </InfoRow>
          <InfoRow label="Actividades">
            <span className="text-sm font-semibold text-agro-olive">{bitacoraPredio.length}</span>
          </InfoRow>
          <InfoRow label="Galería">
            <span className="text-sm font-semibold text-agro-olive">{imagenesGaleria.length} fotos</span>
          </InfoRow>
          <InfoRow label="Municipio">
            <span className="text-sm text-foreground/80">Cereté, Córdoba</span>
          </InfoRow>
        </div>
      </div>

      {/* Galería */}
      <div className="agro-card p-5 mb-6">
        <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <PhotoIcon className="w-4 h-4 text-agro-olive" />
          Galería de imágenes
          <span className="text-xs font-normal text-muted-foreground ml-1">
            ({imagenesGaleria.length} fotos)
          </span>
        </h2>
        <GaleriaImagenes images={imagenesGaleria} />
      </div>

      {/* Bitácora */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-5">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <ClipboardDocumentListIcon className="w-4 h-4 text-agro-olive" />
            Bitácora de actividades
            {bitacoraPredio.length > 0 && (
              <span className="text-xs font-normal text-muted-foreground bg-agro-pastel/60 px-2.5 py-1 rounded-full">
                {bitacoraPredio.length} {bitacoraPredio.length === 1 ? "registro" : "registros"}
              </span>
            )}
          </h2>

          {/* Botón para añadir actividad */}
          <AddBitacoraModal predioId={id} />
        </div>

        {bitacoraPredio.length > 0 ? (
          <div className="relative">
            <div className="absolute left-[19px] top-2 bottom-2 w-px bg-agro-sand hidden sm:block" />
            <div className="space-y-3">
              {bitacoraPredio.map((item, i) => (
                <BitacoraItem
                  key={item.id}
                  id={item.id}
                  predioId={item.predioId}
                  fechaISO={item.fechaISO}
                  actividad={item.actividad}
                  comentario={item.comentario}
                  foto={item.foto}
                  isFirst={i === 0}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="agro-card p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-agro-pastel/60 mx-auto mb-4 flex items-center justify-center">
              <ClipboardDocumentListIcon className="w-7 h-7 text-agro-olive/50" />
            </div>
            <p className="text-foreground font-medium mb-1">Sin actividades registradas</p>
            <p className="text-muted-foreground text-sm">
              Usa el botón <span className="font-medium text-agro-olive">Añadir actividad</span> para registrar la primera entrada.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-agro-sand/60 pb-3 last:border-0 last:pb-0">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
      {children}
    </div>
  )
}
