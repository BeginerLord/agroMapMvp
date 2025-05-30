"use client"

import type React from "react"

import { useState, useRef } from "react"
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { subirImagenPrincipal } from "@/app/predios/nuevo/upload-actions"

interface SubirImagenProps {
  label: string
  onImagenSubida: (ruta: string) => void
  imagenActual?: string
  className?: string
}

export default function SubirImagen({ label, onImagenSubida, imagenActual, className }: SubirImagenProps) {
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState("")
  const [preview, setPreview] = useState(imagenActual || "")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError("")
    setSubiendo(true)

    try {
      // Crear preview local
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)

      // Subir archivo al servidor
      const formData = new FormData()
      formData.append("file", file)

      const result = await subirImagenPrincipal(formData)

      if (result.success && result.path) {
        onImagenSubida(result.path)
        // Limpiar preview local y usar la ruta del servidor
        URL.revokeObjectURL(previewUrl)
        setPreview(result.path)
      } else {
        setError(result.message || "Error al subir la imagen")
        setPreview("")
      }
    } catch (error) {
      setError("Error al procesar la imagen")
      setPreview("")
    } finally {
      setSubiendo(false)
    }
  }

  const limpiarImagen = () => {
    setPreview("")
    setError("")
    onImagenSubida("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>

      {!preview ? (
        <div className="mt-2">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={subiendo}
                className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {subiendo ? "Subiendo..." : "Seleccionar imagen"}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            </div>
            <p className="mt-2 text-xs text-gray-500">PNG, JPG, WEBP hasta 5MB</p>
          </div>
        </div>
      ) : (
        <div className="mt-2 relative">
          <img
            src={preview || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <button
            type="button"
            onClick={limpiarImagen}
            className="absolute top-2 right-2 bg-white/80 hover:bg-white border border-gray-300 p-1 rounded-md transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}
