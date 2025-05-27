import dayjs from "dayjs"
import "dayjs/locale/es"

// Configurar dayjs en español
dayjs.locale("es")

interface BitacoraItemProps {
  id: string
  predioId: string
  fechaISO: string
  actividad: string
  comentario: string
  foto: string
}

export default function BitacoraItem({ fechaISO, actividad, comentario, foto }: BitacoraItemProps) {
  // Formatear fecha usando dayjs
  const fechaFormateada = dayjs(fechaISO).format("DD MMM YYYY")

  return (
    <div className="flex items-center gap-4 bg-white border-l-4 border-primary rounded-r-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Imagen a la izquierda */}
      <div className="flex-shrink-0">
        <img
          src={foto || "/placeholder.svg"}
          alt={actividad}
          className="w-24 h-24 rounded-lg object-cover border border-gray-200"
        />
      </div>

      {/* Contenido a la derecha */}
      <div className="flex-1 min-w-0">
        {/* Actividad */}
        <h3 className="font-semibold text-primary text-lg mb-2">{actividad}</h3>

        {/* Comentario */}
        <p className="text-slate-600 line-clamp-3 mb-2 leading-relaxed">{comentario}</p>

        {/* Fecha */}
        <span className="text-xs text-slate-500 uppercase tracking-wide">{fechaFormateada}</span>
      </div>
    </div>
  )
}
