"use client"

import dynamic from 'next/dynamic'

const DynamicNuevoForm = dynamic(() => import('./NuevoForm'), { 
  ssr: false,
  loading: () => <div className="p-4 text-center">Cargando formulario...</div>
})

export default function FormWrapper() {
  return <DynamicNuevoForm />
}