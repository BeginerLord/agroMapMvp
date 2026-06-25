"use client"

import { useState } from "react"
import Image from "next/image"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts"
import {
  ChartBarIcon,
  MapPinIcon,
  ClipboardDocumentListIcon,
  ArrowLeftIcon,
  CalendarDaysIcon,
  SparklesIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline"

// ── Tipos ─────────────────────────────────────────────────────
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

// ── Categorización de actividades ─────────────────────────────
const CATEGORIAS: { label: string; keywords: string[]; color: string }[] = [
  { label: "Preparación",  keywords: ["arado", "preparac", "labranz", "nivelac", "terreno"],  color: "#C4A882" },
  { label: "Siembra",      keywords: ["siembra", "plantac", "trasplant", "semilla"],           color: "#7BA05B" },
  { label: "Nutrición",    keywords: ["fertiliz", "abono", "nutricion", "compost", "orgánico"],color: "#8FBF6B" },
  { label: "Riego",        keywords: ["riego", "canal", "agua", "irrigac"],                   color: "#87BDD8" },
  { label: "Control",      keywords: ["control", "plaga", "biolog", "insect", "fung"],        color: "#DDECCF" },
  { label: "Mantenimiento",keywords: ["deshierbe", "maleza", "limpieza", "poda", "manten"],   color: "#B5D5C5" },
  { label: "Análisis",     keywords: ["analisis", "análisis", "suelo", "muestra", "pH"],      color: "#DEB887" },
  { label: "Cosecha",      keywords: ["cosecha", "recolect", "harvest"],                      color: "#F4D35E" },
]

function categorizarActividad(actividad: string): string {
  const a = actividad.toLowerCase()
  for (const cat of CATEGORIAS) {
    if (cat.keywords.some((k) => a.includes(k))) return cat.label
  }
  return "Otros"
}

function colorCategoria(label: string): string {
  return CATEGORIAS.find((c) => c.label === label)?.color ?? "#D0C0A8"
}

// ── Helpers de datos ──────────────────────────────────────────
function getMonthlyData(bitacora: EntradaBitacora[]) {
  const result = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const label = d.toLocaleDateString("es-CO", { month: "short" })
    const count = bitacora.filter((b) => {
      const bd = new Date(b.fechaISO)
      return bd.getFullYear() === d.getFullYear() && bd.getMonth() === d.getMonth()
    }).length
    result.push({ mes: label, actividades: count })
  }
  return result
}

function getCategoryData(bitacora: EntradaBitacora[]) {
  const counts: Record<string, number> = {}
  bitacora.forEach((b) => {
    const cat = categorizarActividad(b.actividad)
    counts[cat] = (counts[cat] || 0) + 1
  })
  return Object.entries(counts).map(([name, value]) => ({ name, value }))
}

const ETAPAS = ["Preparación", "Siembra", "Desarrollo", "Cosecha"]
const ETAPA_CATEGORIAS: Record<string, string[]> = {
  Preparación: ["Preparación", "Análisis"],
  Siembra: ["Siembra"],
  Desarrollo: ["Nutrición", "Riego", "Control", "Mantenimiento"],
  Cosecha: ["Cosecha"],
}

function getEtapaActual(bitacora: EntradaBitacora[]): number {
  const categorias = new Set(bitacora.map((b) => categorizarActividad(b.actividad)))
  let ultima = -1
  ETAPAS.forEach((etapa, i) => {
    if (ETAPA_CATEGORIAS[etapa].some((c) => categorias.has(c))) ultima = i
  })
  return ultima
}

function diasDesde(fechaISO: string): number {
  return Math.floor((Date.now() - new Date(fechaISO).getTime()) / 86400000)
}

// ── Tooltip personalizado ─────────────────────────────────────
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-agro-sand rounded-xl px-3 py-2 shadow-card text-sm">
      <p className="font-medium text-foreground">{label}</p>
      <p className="text-agro-olive">{payload[0].value} actividades</p>
    </div>
  )
}

function CustomPieTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-agro-sand rounded-xl px-3 py-2 shadow-card text-sm">
      <p className="font-medium text-foreground">{payload[0].name}</p>
      <p className="text-agro-olive">{payload[0].value} {payload[0].value === 1 ? "registro" : "registros"}</p>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────
export default function EstadisticasDashboard({
  predios,
  bitacora,
}: {
  predios: Predio[]
  bitacora: EntradaBitacora[]
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const predio = predios.find((p) => p.id === selectedId) ?? null
  const bitacoraPredio = bitacora.filter((b) => b.predioId === selectedId)

  // ── Vista: Selector de predio ─────────────────────────────
  if (!predio) {
    return (
      <div className="animate-fade-in space-y-8">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-agro-pastel via-agro-white to-agro-beige px-8 py-10">
          <div className="absolute -top-8 -right-8 w-56 h-56 rounded-full bg-agro-green/15 blur-3xl pointer-events-none" />
          <p className="text-xs font-semibold text-agro-olive uppercase tracking-widest mb-1">
            Monitoreo de cultivos · AgroMap-Cereté
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Estadísticas</h1>
          <p className="text-muted-foreground mt-2 max-w-lg text-sm leading-relaxed">
            Visualiza el estado y desarrollo de los cultivos de ciclo corto registrados
            en cada predio agrícola.
          </p>
        </div>

        {/* Selector */}
        <div>
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Selecciona un predio
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {predios.map((p) => {
              const count = bitacora.filter((b) => b.predioId === p.id).length
              const ultima = bitacora
                .filter((b) => b.predioId === p.id)
                .sort((a, b) => new Date(b.fechaISO).getTime() - new Date(a.fechaISO).getTime())[0]
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className="agro-card overflow-hidden text-left group hover:scale-[1.01] transition-transform duration-200"
                >
                  <div className="relative h-36 overflow-hidden">
                    <Image
                      src={p.imagen || "/placeholder.svg"}
                      alt={p.nombre}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span className="absolute bottom-3 left-3 text-white font-bold text-base drop-shadow">
                      {p.nombre}
                    </span>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <ClipboardDocumentListIcon className="w-4 h-4" />
                      {count} {count === 1 ? "actividad" : "actividades"}
                    </div>
                    {ultima && (
                      <span className="text-xs text-muted-foreground">
                        Hace {diasDesde(ultima.fechaISO)} días
                      </span>
                    )}
                    <span className="agro-btn-primary text-xs py-1.5 px-3">Ver →</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // ── Vista: Dashboard del predio seleccionado ──────────────
  const monthlyData = getMonthlyData(bitacoraPredio)
  const categoryData = getCategoryData(bitacoraPredio)
  const etapaActual = getEtapaActual(bitacoraPredio)
  const ultimaActividad = [...bitacoraPredio].sort(
    (a, b) => new Date(b.fechaISO).getTime() - new Date(a.fechaISO).getTime()
  )

  const kpis = [
    {
      label: "Actividades",
      value: bitacoraPredio.length,
      sub: "registradas",
      icon: <ClipboardDocumentListIcon className="w-5 h-5" />,
      color: "bg-agro-pastel text-agro-olive",
    },
    {
      label: "Última actividad",
      value: ultimaActividad[0] ? `${diasDesde(ultimaActividad[0].fechaISO)}d` : "—",
      sub: "días atrás",
      icon: <CalendarDaysIcon className="w-5 h-5" />,
      color: "bg-agro-beige text-amber-700",
    },
    {
      label: "Categorías",
      value: categoryData.length,
      sub: "tipos distintos",
      icon: <SparklesIcon className="w-5 h-5" />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Etapa actual",
      value: etapaActual >= 0 ? ETAPAS[etapaActual] : "Sin datos",
      sub: "del ciclo",
      icon: <ChartBarIcon className="w-5 h-5" />,
      color: "bg-green-50 text-green-700",
    },
  ]

  return (
    <div className="animate-fade-in space-y-6">

      {/* Header del predio */}
      <div>
        <button
          onClick={() => setSelectedId(null)}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-agro-olive transition-colors font-medium mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Cambiar predio
        </button>

        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-agro-sand shrink-0">
            <Image src={predio.imagen || "/placeholder.svg"} alt={predio.nombre} fill className="object-cover" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{predio.nombre}</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPinIcon className="w-3.5 h-3.5" />
              {predio.ubicacion.lat.toFixed(4)}, {predio.ubicacion.lng.toFixed(4)}
            </p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, sub, icon, color }) => (
          <div key={label} className="agro-card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
              {icon}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-foreground text-lg leading-none truncate">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{label}</p>
              <p className="text-[10px] text-muted-foreground/70">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Ciclo del cultivo */}
      <div className="agro-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <SparklesIcon className="w-4 h-4 text-agro-olive" />
          Ciclo del cultivo
        </h2>
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {ETAPAS.map((etapa, i) => {
            const done = i <= etapaActual
            const current = i === etapaActual
            return (
              <div key={etapa} className="flex items-center gap-1 shrink-0">
                <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium transition-all ${
                  current
                    ? "bg-agro-olive text-white border-agro-olive shadow-md"
                    : done
                      ? "bg-agro-pastel text-agro-olive border-agro-olive/30"
                      : "bg-white text-muted-foreground border-agro-sand"
                }`}>
                  {done && !current && <CheckCircleIcon className="w-3.5 h-3.5 shrink-0" />}
                  <span>{etapa}</span>
                </div>
                {i < ETAPAS.length - 1 && (
                  <div className={`w-6 h-0.5 shrink-0 ${i < etapaActual ? "bg-agro-olive/40" : "bg-agro-sand"}`} />
                )}
              </div>
            )
          })}
        </div>
        {etapaActual < 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            Registra actividades en la bitácora para ver el progreso del ciclo.
          </p>
        )}
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Actividades por mes */}
        <div className="lg:col-span-2 agro-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
            <ChartBarIcon className="w-4 h-4 text-agro-olive" />
            Actividades por mes
          </h2>
          <p className="text-xs text-muted-foreground mb-4">Últimos 6 meses</p>
          {bitacoraPredio.length === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke="#EADBC8" vertical={false} />
                <XAxis
                  dataKey="mes"
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  width={24}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#DDECCF", radius: 8 }} />
                <Bar dataKey="actividades" fill="#7BA05B" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Distribución de categorías */}
        <div className="agro-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-1">Distribución</h2>
          <p className="text-xs text-muted-foreground mb-2">Por tipo de actividad</p>
          {categoryData.length === 0 ? (
            <EmptyChart />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, i) => (
                      <Cell key={i} fill={colorCategoria(entry.name)} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Leyenda manual */}
              <div className="space-y-1.5 mt-1">
                {categoryData.map((entry) => (
                  <div key={entry.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: colorCategoria(entry.name) }}
                      />
                      <span className="text-foreground/70">{entry.name}</span>
                    </div>
                    <span className="font-medium text-foreground">{entry.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Actividades recientes */}
      <div className="agro-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <ClipboardDocumentListIcon className="w-4 h-4 text-agro-olive" />
          Actividades recientes
        </h2>
        {ultimaActividad.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No hay actividades registradas para este predio.
          </p>
        ) : (
          <div className="space-y-2">
            {ultimaActividad.slice(0, 5).map((item) => {
              const cat = categorizarActividad(item.actividad)
              return (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-agro-pastel/20 transition-colors">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: colorCategoria(cat) }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.actividad}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.comentario}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs bg-agro-pastel/60 text-agro-olive px-2 py-0.5 rounded-md font-medium">
                      {cat}
                    </span>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(item.fechaISO).toLocaleDateString("es-CO", { day: "2-digit", month: "short" })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyChart() {
  return (
    <div className="h-[180px] flex flex-col items-center justify-center text-center">
      <ChartBarIcon className="w-8 h-8 text-agro-sand mb-2" />
      <p className="text-xs text-muted-foreground">Sin datos suficientes</p>
    </div>
  )
}
