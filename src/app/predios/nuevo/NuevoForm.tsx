"use client"

import { useState, useActionState } from "react"
import { registrarPredio } from "./actions" // Updated import path
import { subirImagen, subirImagenPrincipal } from "./upload-actions"
import BasicButton from "@/components/BasicButton"
import BasicInput from "@/components/BasicInput"
import SelectorUbicacion from "@/components/SelectorUbicacion"
import GestorGaleria from "@/components/GestorGaleria"

const initialState = {
  success: false,
  message: "",
}

export default function NuevoForm() {
  const [state, formAction] = useActionState(registrarPredio, initialState)
  const [imagenPrincipal, setImagenPrincipal] = useState("")
  const [galeriaImagenes, setGaleriaImagenes] = useState<string[]>([])
  const [ubicacion, setUbicacion] = useState({ lat: 0, lng: 0 })
  const [loading, setLoading] = useState(false)

  // Manejar carga de imagen principal
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

  // Manejar carga de imagen para galería
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

  // Actualizar ubicación desde el selector de mapa
  function handleUbicacionChange(lat: number, lng: number) {
    setUbicacion({ lat, lng })
  }

  // Eliminar imagen de galería
  function handleEliminarImagen(index: number) {
    const nuevasImagenes = [...galeriaImagenes]
    nuevasImagenes.splice(index, 1)
    setGaleriaImagenes(nuevasImagenes)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <form action={formAction} className="space-y-6">
        {/* Campos ocultos para las imágenes y ubicación */}
        <input type="hidden" name="imagen" value={imagenPrincipal} />
        {galeriaImagenes.map((img, i) => (
          <input key={i} type="hidden" name="galeria" value={img} />
        ))}
        <input type="hidden" name="lat" value={ubicacion.lat} />
        <input type="hidden" name="lng" value={ubicacion.lng} />

        {/* Información básica */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">Información básica</h2>
          
          <div className="form-group">
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del predio
            </label>
            <BasicInput
              name="nombre"
              id="nombre"
              placeholder="Ej: Finca Los Olivos"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md 
                          focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Describe brevemente este predio"
              required
            />
          </div>
        </div>

        {/* Selector de ubicación */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">Ubicación</h2>
          <SelectorUbicacion
            lat={0}
            lng={0}
            onUbicacionChange={handleUbicacionChange}
          />
        </div>

        {/* Imagen principal */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">Imagen principal</h2>
          
          <div className="space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImagenPrincipal}
              className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary file:text-white
                        hover:file:bg-primary-dark"
            />
            
            {imagenPrincipal && (
              <div className="mt-2 relative">
                <img
                  src={imagenPrincipal}
                  alt="Vista previa"
                  className="w-full max-h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setImagenPrincipal("")}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Galería de imágenes */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">Galería de imágenes</h2>
          <GestorGaleria
            imagenes={galeriaImagenes}
            onNuevaImagen={handleNuevaImagenGaleria}
            onEliminarImagen={handleEliminarImagen}
          />
        </div>

        {/* Mensaje de estado */}
        {state?.message && (
          <div className={`p-4 rounded-md ${state.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {state.message}
          </div>
        )}

        {/* Botón de envío */}
        <div className="flex justify-end">
          <BasicButton type="submit" disabled={loading}>
            {loading ? "Procesando..." : "Registrar predio"}
          </BasicButton>
        </div>
      </form>
    </div>
  )
}