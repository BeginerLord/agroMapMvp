"use client"

import React, { useState } from "react"
import Image from "next/image"
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"

interface GaleriaImagenesProps {
  images: string[]
  onImageClick?: () => void
}

export default function GaleriaImagenes({
  images,
  onImageClick,
}: GaleriaImagenesProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const openLightbox = (index: number) => {
    onImageClick?.()
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => setLightboxOpen(false)
  const nextImage = () => setCurrentImageIndex((p) => (p + 1) % images.length)
  const prevImage = () => setCurrentImageIndex((p) => (p - 1 + images.length) % images.length)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeLightbox()
    if (e.key === "ArrowRight") nextImage()
    if (e.key === "ArrowLeft") prevImage()
  }

  if (!images.length) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-primary-light">
        <p className="text-slate-600">No hay imágenes disponibles para este predio.</p>
      </div>
    )
  }

  return (
    <>
      {/* Galería Masonry */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="break-inside-avoid cursor-pointer group"
            onClick={() => openLightbox(idx)}
          >
            <div className="relative overflow-hidden rounded-2xl bg-white border border-primary-light shadow-sm hover:shadow-md transition-all duration-300">
              <Image
                src={img.startsWith("/") ? img : `/${img}`}
                alt={`Imagen ${idx + 1}`}
                width={400}
                height={300}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-white" />
          </button>

          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prevImage() }}
              className="absolute left-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-colors"
            >
              <ChevronLeftIcon className="w-6 h-6 text-white" />
            </button>
          )}

          <div
            className="relative max-w-4xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={
                images[currentImageIndex].startsWith("/")
                  ? images[currentImageIndex]
                  : `/${images[currentImageIndex]}`
              }
              alt={`Imagen ${currentImageIndex + 1}`}
              width={800}
              height={600}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>

          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); nextImage() }}
              className="absolute right-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-colors"
            >
              <ChevronRightIcon className="w-6 h-6 text-white" />
            </button>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-20 rounded-full px-3 py-1">
              <span className="text-white text-sm">
                {currentImageIndex + 1} / {images.length}
              </span>
            </div>
          )}
        </div>
      )}
    </>
  )
}
