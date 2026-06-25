"use client"

import Link from "next/link"
import Image from "next/image"

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    title: "Cultivos",
    desc: "Monitoreo del estado y desarrollo de los diferentes cultivos de ciclo corto.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
    title: "Bitácora",
    desc: "Registro detallado de actividades y eventos del predio agrícola.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Geolocalización",
    desc: "Ubicación precisa y mapeo GPS de predios dentro del municipio.",
  },
]

const stats = [
  { value: "12+", label: "Predios activos" },
  { value: "3", label: "Cultivos monitoreados" },
  { value: "Cereté", label: "Municipio focalizado" },
]

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-agro-pastel via-agro-white to-agro-beige py-20 px-6 mb-12 text-center">
        {/* Decorative blobs */}
        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-agro-green/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-agro-yellow/20 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto space-y-6">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-white shadow-card flex items-center justify-center">
              <Image src="/agromap.svg" alt="AgroMap Logo" width={48} height={48} className="w-12 h-12" />
            </div>
          </div>

          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              AgroMap
              <span className="text-agro-olive"> Cereté</span>
            </h1>
            <p className="mt-3 text-lg md:text-xl text-muted-foreground font-medium">
              Gestión georreferenciada de cultivos periurbanos
            </p>
          </div>

          <p className="text-base text-foreground/70 max-w-xl mx-auto leading-relaxed">
            Monitorea predios agrícolas, registra bitácoras y visualiza coordenadas GPS para
            fortalecer la seguridad alimentaria estudiantil.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/predios" className="agro-btn-primary text-base px-8 py-3">
              Ver predios
            </Link>
            <Link href="/predios/nuevo" className="agro-btn-outline text-base px-8 py-3">
              Registrar predio
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-4 mb-12">
        {stats.map(({ value, label }) => (
          <div key={label} className="agro-card p-6 text-center">
            <p className="text-2xl md:text-3xl font-bold text-agro-olive">{value}</p>
            <p className="text-sm text-muted-foreground mt-1 font-medium">{label}</p>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">¿Qué puedes gestionar?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="agro-card p-6 group cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-agro-pastel text-agro-olive flex items-center justify-center mb-4 group-hover:bg-agro-green/30 transition-colors">
                {icon}
              </div>
              <h3 className="font-semibold text-foreground text-lg mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-agro-sand pt-8 pb-4 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Universidad de Cartagena · AgroMap-Cereté
        </p>
      </footer>
    </div>
  )
}
