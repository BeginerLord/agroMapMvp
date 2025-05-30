"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function registrarPredio(
  prevState: { success: boolean; message: string } | null,
  formData: FormData
) {
  // Simular delay de procesamiento
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Extraer datos del formulario
  const nombre = formData.get("nombre") as string
  const descripcion = formData.get("descripcion") as string
  const lat = Number.parseFloat(formData.get("lat") as string)
  const lng = Number.parseFloat(formData.get("lng") as string)
  const imagen = formData.get("imagen") as string

  // Obtener imágenes de galería (pueden ser múltiples)
  const galeria = formData.getAll("galeria") as string[]

  // Validaciones básicas
  if (!nombre || !descripcion || !lat || !lng) {
    return {
      success: false,
      message: "Todos los campos obligatorios deben ser completados",
    }
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return {
      success: false,
      message: "Las coordenadas no son válidas",
    }
  }

  // Generar nuevo ID (en una app real, esto vendría de la base de datos)
  const nuevoId = (Math.floor(Math.random() * 1000) + 100).toString()

  // En una aplicación real, aquí guardarías en la base de datos
  const nuevoPredio = {
    id: nuevoId,
    nombre,
    descripcion,
    ubicacion: { lat, lng },
    imagen: imagen || "/placeholder.svg?height=200&width=300",
    galeria: galeria.filter((img) => img.trim() !== ""),
  }

  console.log("Nuevo predio registrado:", nuevoPredio)

  // Revalidar la página de predios para mostrar el nuevo predio
  revalidatePath("/predios")

  // Redirigir al nuevo predio
  redirect(`/predios/${nuevoId}`)
}