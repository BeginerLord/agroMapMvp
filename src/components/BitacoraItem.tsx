import dayjs from "dayjs"
import "dayjs/locale/es"
import relativeTime from "dayjs/plugin/relativeTime"
import Image from "next/image"

dayjs.locale("es")
dayjs.extend(relativeTime)

interface BitacoraItemProps {
  id: string
  predioId: string
  fechaISO: string
  actividad: string
  comentario: string
  foto: string
  isFirst?: boolean
}

export default function BitacoraItem({ fechaISO, actividad, comentario, foto, isFirst }: BitacoraItemProps) {
  const fechaFormateada = dayjs(fechaISO).format("DD MMM YYYY")
  const fechaRelativa = dayjs(fechaISO).fromNow()

  return (
    <div className="flex gap-4">
      {/* Dot de timeline (visible solo sm+) */}
      <div className="hidden sm:flex flex-col items-center shrink-0 pt-1">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 z-10 ${
          isFirst
            ? "bg-agro-olive border-agro-olive text-white"
            : "bg-white border-agro-sand text-muted-foreground"
        }`}>
          <span className="text-xs font-bold">{dayjs(fechaISO).format("DD")}</span>
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 bg-white border border-agro-sand rounded-2xl p-4 hover:shadow-card hover:border-agro-olive/25 transition-all duration-200 flex gap-4">
        {/* Imagen */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-agro-sand shrink-0">
          <Image
            src={foto || "/placeholder.svg"}
            alt={actividad}
            fill
            className="object-cover"
          />
        </div>

        {/* Texto */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-semibold text-foreground text-sm leading-tight">{actividad}</h3>
            <div className="text-right shrink-0">
              <p className="text-xs font-medium text-agro-olive bg-agro-pastel/60 px-2 py-0.5 rounded-md whitespace-nowrap">
                {fechaFormateada}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5 text-right">{fechaRelativa}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{comentario}</p>
        </div>
      </div>
    </div>
  )
}
