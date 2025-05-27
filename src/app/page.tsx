import Link from "next/link"
import Image from "next/image"
import { MapPinIcon, BookOpenIcon, ChartBarIcon } from "@heroicons/react/24/outline"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-white min-h-screen flex items-center justify-center -mt-4">
        <div className="text-center space-y-8 max-w-4xl mx-auto px-4">
          <div className="flex justify-center mb-8">
            <Image
              src="/agroMap.png"
              alt="AgroMap Logo"
              width={120}
              height={120}
              className="w-24 h-24 md:w-30 md:h-30"
            />
          </div>

          <h1 className="font-bold text-5xl md:text-7xl text-primary leading-tight">AgroMap-Cereté</h1>

          <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto">Cultivando seguridad alimentaria</p>

          <div className="pt-6">
            <Link
              href="/predios"
              className="inline-block bg-primary hover:bg-primary-light text-white rounded-2xl px-8 py-3 shadow-lg transition-colors font-semibold text-lg"
            >
              Ver predios
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">¿Cual es tu interes?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 - Cultivos */}
            <div className="bg-white rounded-lg border-2 border-primary-light p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <ChartBarIcon className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Cultivos</h3>
              <p className="text-slate-600">Monitoreo del estado y desarrollo de los diferentes cultivos</p>
            </div>

            {/* Card 2 - Bitácora */}
            <div className="bg-white rounded-lg border-2 border-primary-light p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <BookOpenIcon className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Bitácora</h3>
              <p className="text-slate-600">Registro detallado de actividades y eventos del predio agrícola</p>
            </div>

            {/* Card 3 - Geolocalización */}
            <div className="bg-white rounded-lg border-2 border-primary-light p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <MapPinIcon className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Geolocalización</h3>
              <p className="text-slate-600">Ubicación precisa y mapeo de predios dentro del municipio</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="text-center">
          <p className="text-slate-600">© Universidad de Cartagena 2025</p>
        </div>
      </footer>
    </div>
  )
}
