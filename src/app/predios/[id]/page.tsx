import { notFound } from "next/navigation";
import prediosData from "@/data/predios.json";
import bitacoraData from "@/data/bitacora.json";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

import BitacoraItem from "@/components/BitacoraItem";
import GaleriaImagenes from "@/components/GaleriaImagenes";
import MapaSection from "@/components/MapSection";

export async function generateStaticParams() {
  return prediosData.map((predio) => ({
    id: predio.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const predio = prediosData.find((p) => p.id === resolvedParams.id);

  if (!predio) {
    return {
      title: "Predio no encontrado - AgroMap MVP",
    };
  }

  return {
    title: `${predio.nombre} - AgroMap MVP`,
    description: predio.descripcion,
  };
}

export default async function PredioPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const predio = prediosData.find((p) => p.id === resolvedParams.id);

  if (!predio) {
    notFound();
  }

  const bitacoraPredio = bitacoraData
    .filter((item) => item.predioId === resolvedParams.id)
    .sort((a, b) => new Date(b.fechaISO).getTime() - new Date(a.fechaISO).getTime());

  const imagenesGaleria = predio.galeria || [
    "/placeholder.svg?height=400&width=300&text=Vista+aérea",
    "/placeholder.svg?height=300&width=400&text=Cultivo+principal",
    "/placeholder.svg?height=500&width=350&text=Instalaciones",
    "/placeholder.svg?height=350&width=400&text=Maquinaria",
    "/placeholder.svg?height=400&width=300&text=Cosecha",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mb-6">
        <Link
          href="/predios"
          className="inline-flex items-center gap-2 text-primary hover:text-primary-light transition-colors font-medium"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Volver a predios
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mt-6 mb-4">{predio.nombre}</h1>
        <p className="text-slate-700 text-lg leading-relaxed mb-6">{predio.descripcion}</p>
      </div>

      <MapaSection lat={predio.ubicacion.lat} lng={predio.ubicacion.lng} nombre={predio.nombre} />

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-primary mb-4">Galería de imágenes</h2>
        <GaleriaImagenes images={imagenesGaleria} />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-primary mb-6">Bitácora de actividades</h2>
        {bitacoraPredio.length > 0 ? (
          <div className="space-y-1">
            {bitacoraPredio.map((item) => (
              <BitacoraItem
                key={item.id}
                id={item.id}
                predioId={item.predioId}
                fechaISO={item.fechaISO}
                actividad={item.actividad}
                comentario={item.comentario}
                foto={item.foto}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center shadow-sm">
            <p className="text-slate-600">No hay actividades registradas para este predio.</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
        <h3 className="text-xl font-semibold text-primary mb-4">Información de contacto</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-600">
          <div>
            <p>
              <strong>Coordenadas:</strong>
            </p>
            <p>Latitud: {predio.ubicacion.lat}</p>
            <p>Longitud: {predio.ubicacion.lng}</p>
          </div>
          <div>
            <p>
              <strong>Estado:</strong> Activo
            </p>
            <p>
              <strong>Última actualización:</strong> {new Date().toLocaleDateString("es-ES")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
