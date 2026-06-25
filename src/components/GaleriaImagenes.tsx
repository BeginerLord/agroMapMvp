"use client"

import React, { useState } from "react"
import Image from "next/image"
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"

interface GaleriaImagenesProps {
  images: string[]
  onImageClick?: () => void
}

export default function GaleriaImagenes({ images, onImageClick }: GaleriaImagenesProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openLightbox = (index: number) => {
    onImageClick?.()
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  const close = () => setLightboxOpen(false)
  const next = () => setCurrentIndex((p) => (p + 1) % images.length)
  const prev = () => setCurrentIndex((p) => (p - 1 + images.length) % images.length)

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") close()
    if (e.key === "ArrowRight") next()
    if (e.key === "ArrowLeft") prev()
  }

  const src = (img: string) => (img.startsWith("/") ? img : `/${img}`)

  if (!images.length) {
    return (
      <div className="rounded-2xl border border-agro-sand bg-agro-pastel/20 p-10 text-center text-muted-foreground text-sm">
        No hay imágenes disponibles para este predio.
      </div>
    )
  }

  return (
    <>
      {/* Grid responsivo */}
      <div className="columns-2 sm:columns-3 gap-3 space-y-3">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="break-inside-avoid cursor-pointer group"
            onClick={() => openLightbox(idx)}
          >
            <div className="relative overflow-hidden rounded-xl border border-agro-sand/60 bg-agro-sand/20 shadow-sm hover:shadow-card transition-all duration-300">
              <Image
                src={src(img)}
                alt={`Imagen ${idx + 1}`}
                width={400}
                height={300}
                className="w-full h-auto object-cover transition-transform duration-400 group-hover:scale-105"
              />
              {/* Overlay hover */}
              <div className="absolute inset-0 bg-agro-olive/0 group-hover:bg-agro-olive/10 transition-colors duration-300 rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={close}
          onKeyDown={handleKey}
          tabIndex={0}
        >
          {/* Cerrar */}
          <button
            onClick={close}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>

          {/* Anterior */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
          )}

          {/* Imagen */}
          <div
            className="relative max-w-5xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src(images[currentIndex])}
              alt={`Imagen ${currentIndex + 1}`}
              width={1200}
              height={900}
              className="max-w-full max-h-[88vh] object-contain rounded-2xl"
            />
          </div>

          {/* Siguiente */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 transition-colors"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          )}

          {/* Contador */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </>
  )
}
