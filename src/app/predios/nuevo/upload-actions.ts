"use server"

import { writeFile } from "fs/promises"
import { join } from "path"
import { randomUUID } from "crypto"

export async function subirImagen(formData: FormData) {
  try {
    const file = formData.get("file") as File

    if (!file) {
      return { success: false, message: "No se seleccionó ningún archivo" }
    }

    // Validar tipo de archivo
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        message: "Tipo de archivo no válido. Solo se permiten: JPG, PNG, WEBP",
      }
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        message: "El archivo es demasiado grande. Máximo 5MB",
      }
    }

    // Generar nombre único para el archivo
    const fileExtension = file.name.split(".").pop()
    const uniqueFileName = `${randomUUID()}.${fileExtension}`

    // Crear la ruta donde se guardará el archivo
    const uploadDir = join(process.cwd(), "public", "uploads", "predios")
    const filePath = join(uploadDir, uniqueFileName)

    // Convertir el archivo a buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Crear directorio si no existe
    const fs = require("fs")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    // Guardar el archivo
    await writeFile(filePath, buffer)

    // Devolver la ruta pública del archivo
    const publicPath = `/uploads/predios/${uniqueFileName}`

    return {
      success: true,
      message: "Imagen subida correctamente",
      path: publicPath,
    }
  } catch (error) {
    console.error("Error al subir imagen:", error)
    return {
      success: false,
      message: "Error interno del servidor al subir la imagen",
    }
  }
}

export async function subirImagenPrincipal(formData: FormData) {
  // Reutilizar la misma lógica pero para imagen principal
  return await subirImagen(formData)
}
