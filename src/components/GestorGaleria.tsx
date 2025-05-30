"use client"

import type React from "react"

import { useState, useRef } from "react"
import { PlusIcon, XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline"
import { subirImagen } from "@/app/predios/nuevo/upload-actions"

interface GestorGaleriaProps {
  imagenes: string[]
  onNuevaImagen?: (imagen: File) => Promise<void>
  onEliminarImagen?: (index: number) => void
  onImagenesChange?: (imagenes: string[]) => void
}

export default function GestorGaleria({ 
  imagenes, 
  onNuevaImagen, 
  onEliminarImagen, 
  onImagenesChange 
}: GestorGaleriaProps) {
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setError("")
    setSubiendo(true)

    try {
      // If we're using the onNuevaImagen prop, delegate to it
      if (onNuevaImagen) {
        for (let i = 0; i < files.length; i++) {
          await onNuevaImagen(files[i])
        }
      } 
      // Otherwise use the original implementation with onImagenesChange
      else if (onImagenesChange) {
        const nuevasImagenes = [...imagenes]

        // Procesar cada archivo seleccionado
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          const formData = new FormData()
          formData.append("file", file)

          const result = await subirImagen(formData)

          if (result.success && result.path) {
            nuevasImagenes.push(result.path)
          } else {
            setError((prev) => prev + (prev ? ", " : "") + `${file.name}: ${result.message}`)
          }
        }

        onImagenesChange(nuevasImagenes)
      }

      // Limpiar input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      setError("Error al procesar las imágenes")
    } finally {
      setSubiendo(false)
    }
  }

  const eliminarImagen = (index: number) => {
    if (onEliminarImagen) {
      // Use the provided handler
      onEliminarImagen(index)
    } else if (onImagenesChange) {
      // Or use the original implementation
      const nuevasImagenes = imagenes.filter((_, i) => i !== index)
      onImagenesChange(nuevasImagenes)
    }
  }

  return (
    <div className="space-y-4">
      {/* Lista de imágenes actuales */}
      {imagenes.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-slate-700">Imágenes de la galería ({imagenes.length}):</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imagenes.map((imagen, index) => (
              <div key={index} className="relative group">
                <img
                  src={imagen || "/placeholder.svg"}
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => eliminarImagen(index)}
                  className="absolute top-1 right-1 bg-white/80 hover:bg-white text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity border border-gray-300 p-1 rounded-md"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
                <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">{index + 1}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Área para agregar nuevas imágenes */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
        <PhotoIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={subiendo}
            className="bg-primary text-white hover:bg-primary-light px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            {subiendo ? "Subiendo..." : "Agregar imágenes"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Selecciona una o múltiples imágenes (PNG, JPG, WEBP hasta 5MB cada una)
        </p>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}