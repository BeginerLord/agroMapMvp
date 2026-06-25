"use server"

import { readFileSync, writeFileSync } from "fs"
import { join } from "path"
import { revalidatePath } from "next/cache"

const BITACORA_PATH = join(process.cwd(), "src", "data", "bitacora.json")

type EntradaBitacora = {
  id: string
  predioId: string
  fechaISO: string
  actividad: string
  comentario: string
  foto: string
}

export async function agregarBitacora(
  prevState: { success: boolean; message: string } | null,
  formData: FormData
) {
  const predioId = (formData.get("predioId") as string)?.trim()
  const actividad = (formData.get("actividad") as string)?.trim()
  const comentario = (formData.get("comentario") as string)?.trim()
  const foto = (formData.get("foto") as string) || "/placeholder.svg"

  if (!predioId) return { success: false, message: "ID de predio inválido" }
  if (!actividad) return { success: false, message: "El nombre de la actividad es obligatorio" }
  if (!comentario) return { success: false, message: "El comentario es obligatorio" }

  const bitacora: EntradaBitacora[] = JSON.parse(readFileSync(BITACORA_PATH, "utf-8"))

  const maxId = bitacora.reduce((max, b) => {
    const n = parseInt(b.id)
    return isNaN(n) ? max : Math.max(max, n)
  }, 0)

  const nueva: EntradaBitacora = {
    id: (maxId + 1).toString(),
    predioId,
    fechaISO: new Date().toISOString(),
    actividad,
    comentario,
    foto,
  }

  bitacora.push(nueva)
  writeFileSync(BITACORA_PATH, JSON.stringify(bitacora, null, 2), "utf-8")

  revalidatePath(`/predios/${predioId}`)

  return { success: true, message: "Actividad registrada correctamente" }
}
