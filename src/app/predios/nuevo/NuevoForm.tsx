"use client"

import { useState, useActionState } from "react"
import dynamic from "next/dynamic"
import { registrarPredio } from "./actions"
import { subirImagen, subirImagenPrincipal } from "./upload-actions"
import BasicButton from "@/components/BasicButton"
import BasicInput from "@/components/BasicInput"
import GestorGaleria from "@/components/GestorGaleria"

const SelectorUbicacion = dynamic(() => import("@/components/SelectorUbicacion"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-48 rounded-xl border border-agro-sand bg-agro-pastel/30 text-muted-foreground text-sm">
      Cargando mapa…
    </div>
  ),
})

const initialState = { success: false, message: "" }

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="agro-card p-6">
      <h2 className="font-semibold text-foreground text-base mb-4 pb-3 border-b border-agro-sand">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

export default function NuevoForm() {
  const [state, formAction] = useActionState(registrarPredio, initialState)
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [imagenPrincipal, setImagenPrincipal] = useState("")
  const [galeriaImagenes, setGaleriaImagenes] = useState<string[]>([])
  const [ubicacion, setUbicacion] = useState({ lat: 0, lng: 0 })
  const [loading, setLoading] = useState(false)

  async function handleImagenPrincipal(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length === 0) return
    setLoading(true)
    const formData = new FormData()
    formData.append("file", event.target.files[0])
    const response = await subirImagenPrincipal(formData)
    if (response.success && response.path) {
      setImagenPrincipal(response.path)
    } else {
      alert(response.message || "Error al subir imagen")
    }
    setLoading(false)
  }

  async function handleNuevaImagenGaleria(imagen: File) {
    setLoading(true)
    const formData = new FormData()
    formData.append("file", imagen)
    const response = await subirImagen(formData)
    if (response.success && response.path) {
      setGaleriaImagenes([...galeriaImagenes, response.path])
    } else {
      alert(response.message || "Error al subir imagen")
    }
    setLoading(false)
  }

  function handleUbicacionChange(lat: number, lng: number) {
    setUbicacion({ lat, lng })
  }

  function handleEliminarImagen(index: number) {
    const nuevas = [...galeriaImagenes]
    nuevas.splice(index, 1)
    setGaleriaImagenes(nuevas)
  }

  return (
    <form action={formAction} className="space-y-5">
      {/* Hidden fields */}
      <input type="hidden" name="imagen" value={imagenPrincipal} />
      {galeriaImagenes.map((img, i) => (
        <input key={i} type="hidden" name="galeria" value={img} />
      ))}
      <input type="hidden" name="lat" value={ubicacion.lat} />
      <input type="hidden" name="lng" value={ubicacion.lng} />

      {/* Información básica */}
      <FormSection title="Información básica">
        <div>
          <label htmlFor="nombre" className="agro-label">Nombre del predio</label>
          <BasicInput
            name="nombre"
            id="nombre"
            placeholder="Ej: Finca Los Olivos"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="descripcion" className="agro-label">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows={3}
            className="w-full px-4 py-2.5 border border-agro-sand rounded-xl bg-white
                       focus:outline-none focus:ring-2 focus:ring-agro-olive/40 focus:border-agro-olive
                       transition-all duration-200 placeholder:text-muted-foreground text-foreground resize-none"
            placeholder="Describe brevemente este predio"
            required
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>
      </FormSection>

      {/* Ubicación */}
      <FormSection title="Ubicación GPS *">
        {ubicacion.lat === 0 && ubicacion.lng === 0 ? (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg mb-2">
            Haz clic sobre el mapa para marcar la ubicación del predio.
          </p>
        ) : (
          <p className="text-xs text-agro-olive font-medium bg-agro-pastel/60 px-3 py-1.5 rounded-lg inline-block mb-2">
            ✓ Coordenadas: {ubicacion.lat.toFixed(6)}, {ubicacion.lng.toFixed(6)}
          </p>
        )}
        <SelectorUbicacion lat={0} lng={0} onUbicacionChange={handleUbicacionChange} />
      </FormSection>

      {/* Imagen principal */}
      <FormSection title="Imagen principal">
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImagenPrincipal}
            className="block w-full text-sm text-muted-foreground
                       file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                       file:text-sm file:font-semibold file:bg-agro-olive file:text-white
                       hover:file:bg-agro-green file:transition-colors file:cursor-pointer"
          />
          {imagenPrincipal && (
            <div className="mt-3 relative rounded-xl overflow-hidden">
              <img
                src={imagenPrincipal}
                alt="Vista previa"
                className="w-full max-h-64 object-cover"
              />
              <button
                type="button"
                onClick={() => setImagenPrincipal("")}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </FormSection>

      {/* Galería */}
      <FormSection title="Galería de imágenes">
        <GestorGaleria
          imagenes={galeriaImagenes}
          onNuevaImagen={handleNuevaImagenGaleria}
          onEliminarImagen={handleEliminarImagen}
        />
      </FormSection>

      {/* Estado */}
      {state?.message && (
        <div className={`rounded-xl p-4 text-sm font-medium ${
          state.success
            ? "bg-agro-pastel text-agro-olive border border-agro-green/40"
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {state.message}
        </div>
      )}

      {/* Enviar */}
      <div className="flex justify-end pt-2">
        <BasicButton type="submit" disabled={loading}>
          {loading ? "Procesando…" : "Registrar predio"}
        </BasicButton>
      </div>
    </form>
  )
}
