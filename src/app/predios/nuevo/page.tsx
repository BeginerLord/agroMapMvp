export const metadata = {
  title: "Registrar Nuevo Predio - AgroMap MVP",
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

import FormWrapper from './FormWrapper'

export default function NuevoPredioPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-semibold text-primary mb-8">Registrar Nuevo Predio</h1>
      <FormWrapper />
    </div>
  )
}