"use client"

import { useState, useActionState, useEffect, useRef } from "react"
import {
  PlusIcon,
  XMarkIcon,
  ClipboardDocumentListIcon,
  CameraIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline"
import { agregarBitacora } from "@/app/predios/[id]/bitacora-actions"
import { subirImagen } from "@/app/predios/nuevo/upload-actions"

const initialState = { success: false, message: "" }

export default function AddBitacoraModal({ predioId }: { predioId: string }) {
  const [open, setOpen] = useState(false)
  const [state, formAction, pending] = useActionState(agregarBitacora, initialState)
  const [fotoPath, setFotoPath] = useState("")
  const [fotoPreview, setFotoPreview] = useState("")
  const [uploadingFoto, setUploadingFoto] = useState(false)
  const [actividad, setActividad] = useState("")
  const [comentario, setComentario] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (state?.success) {
      const t = setTimeout(() => {
        setOpen(false)
        resetForm()
      }, 1500)
      return () => clearTimeout(t)
    }
  }, [state])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  function resetForm() {
    setFotoPath("")
    setFotoPreview("")
    setActividad("")
    setComentario("")
  }

  async function processFile(file: File) {
    if (!file.type.startsWith("image/")) return
    setFotoPreview(URL.createObjectURL(file))
    setUploadingFoto(true)
    const fd = new FormData()
    fd.append("file", file)
    const res = await subirImagen(fd)
    if (res.success && res.path) setFotoPath(res.path)
    setUploadingFoto(false)
  }

  function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="agro-btn-primary inline-flex items-center gap-1.5 text-sm"
      >
        <PlusIcon className="w-4 h-4" />
        Añadir actividad
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div className="bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl shadow-2xl max-h-[95vh] overflow-hidden flex flex-col animate-slide-up">

            {/* ── Header ─────────────────────────────────── */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-agro-sand shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-agro-pastel flex items-center justify-center">
                  <ClipboardDocumentListIcon className="w-5 h-5 text-agro-olive" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground text-sm leading-none">Nueva actividad</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Registra una actividad en la bitácora</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-agro-sand/60 flex items-center justify-center transition-colors text-muted-foreground"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>

            {/* ── Estado de éxito ─────────────────────────── */}
            {state?.success ? (
              <div className="flex-1 flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-agro-pastel flex items-center justify-center mb-4">
                  <CheckCircleIcon className="w-8 h-8 text-agro-olive" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">¡Actividad registrada!</h3>
                <p className="text-sm text-muted-foreground">La bitácora ha sido actualizada correctamente.</p>
              </div>
            ) : (
              /* ── Formulario ─────────────────────────────── */
              <form action={formAction} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                <input type="hidden" name="predioId" value={predioId} />
                <input type="hidden" name="foto" value={fotoPath} />

                {/* Actividad */}
                <div>
                  <label className="agro-label">
                    Nombre de la actividad <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="actividad"
                    required
                    value={actividad}
                    onChange={(e) => setActividad(e.target.value)}
                    placeholder="Ej: Siembra de maíz, Aplicación de fertilizante…"
                    className="agro-input"
                  />
                </div>

                {/* Comentario */}
                <div>
                  <label className="agro-label">
                    Descripción detallada <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="comentario"
                    required
                    rows={4}
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Describe la actividad: condiciones del terreno, cantidad de insumos, observaciones…"
                    className="w-full px-4 py-2.5 border border-agro-sand rounded-xl bg-white
                               focus:outline-none focus:ring-2 focus:ring-agro-olive/40 focus:border-agro-olive
                               transition-all duration-200 placeholder:text-muted-foreground text-foreground
                               resize-none text-sm leading-relaxed"
                  />
                </div>

                {/* Foto — zona de carga */}
                <div>
                  <label className="agro-label">Foto de la actividad (opcional)</label>

                  {fotoPreview ? (
                    /* Preview */
                    <div className="relative rounded-2xl overflow-hidden h-40 border border-agro-sand">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" />
                      {uploadingFoto && (
                        <div className="absolute inset-0 bg-agro-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                          <div className="w-6 h-6 border-2 border-agro-olive border-t-transparent rounded-full animate-spin" />
                          <span className="text-xs text-agro-olive font-medium">Subiendo imagen…</span>
                        </div>
                      )}
                      {!uploadingFoto && (
                        <button
                          type="button"
                          onClick={() => { setFotoPath(""); setFotoPreview("") }}
                          className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                        >
                          <XMarkIcon className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {fotoPath && !uploadingFoto && (
                        <div className="absolute bottom-2 left-2 bg-agro-olive/90 text-white text-xs px-2 py-0.5 rounded-full">
                          ✓ Cargada
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Drop zone */
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      className={`
                        flex flex-col items-center justify-center gap-2 h-32 rounded-2xl border-2 border-dashed
                        cursor-pointer transition-all duration-200
                        ${dragOver
                          ? "border-agro-olive bg-agro-pastel/40 scale-[1.01]"
                          : "border-agro-sand bg-agro-white hover:border-agro-olive/50 hover:bg-agro-pastel/20"
                        }
                      `}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${dragOver ? "bg-agro-olive text-white" : "bg-agro-pastel text-agro-olive"}`}>
                        <CameraIcon className="w-5 h-5" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground/70">
                          {dragOver ? "Suelta la imagen aquí" : "Arrastra o haz clic para subir"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG, WEBP · Máx. 5 MB</p>
                      </div>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFoto}
                    className="hidden"
                  />
                </div>

                {/* Error */}
                {state?.message && !state.success && (
                  <div className="rounded-xl px-4 py-3 text-sm bg-red-50 text-red-700 border border-red-200">
                    {state.message}
                  </div>
                )}

                {/* Footer del form */}
                <div className="flex items-center justify-between pt-1 pb-1">
                  <p className="text-xs text-muted-foreground">
                    <span className="text-red-400">*</span> Campos obligatorios
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="agro-btn-outline text-sm py-2 px-4"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={pending || uploadingFoto}
                      className="agro-btn-primary text-sm py-2 px-5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                    >
                      {pending ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Guardando…
                        </>
                      ) : "Registrar"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
