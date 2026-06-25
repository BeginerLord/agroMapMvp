"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { readFileSync, writeFileSync } from "fs"
import { join } from "path"

const PREDIOS_PATH = join(process.cwd(), "src", "data", "predios.json")

function leerPredios() {
  return JSON.parse(readFileSync(PREDIOS_PATH, "utf-8")) as Array<Record<string, unknown>>
}

export async function registrarPredio(
  prevState: { success: boolean; message: string } | null,
  formData: FormData
) {
  const nombre = (formData.get("nombre") as string)?.trim()
  const descripcion = (formData.get("descripcion") as string)?.trim()
  const lat = Number.parseFloat(formData.get("lat") as string)
  const lng = Number.parseFloat(formData.get("lng") as string)
  const imagen = formData.get("imagen") as string
  const galeria = (formData.getAll("galeria") as string[]).filter((img) => img.trim() !== "")

  // Validaciones
  if (!nombre) {
    return { success: false, message: "El nombre del predio es obligatorio" }
  }
  if (!descripcion) {
    return { success: false, message: "La descripción es obligatoria" }
  }
  if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) {
    return { success: false, message: "Debes seleccionar la ubicación del predio en el mapa" }
  }
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return { success: false, message: "Las coordenadas seleccionadas no son válidas" }
  }

  // Leer predios actuales y generar ID correlativo
  const predios = leerPredios()
  const maxId = predios.reduce((max, p) => {
    const n = parseInt(p.id as string)
    return isNaN(n) ? max : Math.max(max, n)
  }, 0)
  const nuevoId = (maxId + 1).toString()

  const nuevoPredio = {
    id: nuevoId,
    nombre,
    descripcion,
    ubicacion: { lat, lng },
    imagen: imagen || "/placeholder.svg?height=200&width=300",
    imagen2: "",
    galeria,
  }

  // Persistir en predios.json
  predios.push(nuevoPredio)
  writeFileSync(PREDIOS_PATH, JSON.stringify(predios, null, 2), "utf-8")

  revalidatePath("/predios")
  revalidatePath(`/predios/${nuevoId}`)

  redirect(`/predios/${nuevoId}`)
}
