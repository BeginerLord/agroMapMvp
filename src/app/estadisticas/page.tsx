import { readFileSync } from "fs"
import { join } from "path"
import EstadisticasDashboard from "./EstadisticasDashboard"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Estadísticas · AgroMap-Cereté",
  description: "Monitoreo del estado y desarrollo de cultivos de ciclo corto",
}

type Predio = {
  id: string
  nombre: string
  descripcion: string
  imagen: string
  ubicacion: { lat: number; lng: number }
}

type EntradaBitacora = {
  id: string
  predioId: string
  fechaISO: string
  actividad: string
  comentario: string
  foto: string
}

function getPredios(): Predio[] {
  return JSON.parse(readFileSync(join(process.cwd(), "src", "data", "predios.json"), "utf-8"))
}

function getBitacora(): EntradaBitacora[] {
  return JSON.parse(readFileSync(join(process.cwd(), "src", "data", "bitacora.json"), "utf-8"))
}

export default function EstadisticasPage() {
  const predios = getPredios()
  const bitacora = getBitacora()
  return <EstadisticasDashboard predios={predios} bitacora={bitacora} />
}
