export const metadata = {
  title: "Nuevo Predio · AgroMap-Cereté",
  description: "Formulario para registrar un nuevo predio en el sistema AgroMap",
}

export interface NuevoPredioData {
  nombre: string
  descripcion: string
  lat: number
  lng: number
  imagen: string
  galeria: string[]
}

import FormWrapper from "./FormWrapper"

export default function NuevoPredioPage() {
  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Registrar nuevo predio</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Completa la información del predio agrícola para añadirlo al sistema.
        </p>
      </div>
      <FormWrapper />
    </div>
  )
}
