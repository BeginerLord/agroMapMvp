"use client"

import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
    return (
        <>
            {/* Hero Section */}
            <section className="bg-white min-h-screen flex items-center justify-center -mt-4">
                <div className="text-center space-y-8 max-w-4xl mx-auto px-4">
                    <div className="flex justify-center mb-8">
                        <Image
                            src="/agromap.svg"
                            alt="AgroMap Logo"
                            width={120}
                            height={120}
                            className="w-24 h-24 md:w-30 md:h-30"
                        />
                    </div>

                    <h1 className="font-bold text-5xl md:text-7xl text-primary leading-tight">AgroMap-Cereté</h1>

                    <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto">
                        Cultivando seguridad alimentaria
                    </p>

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
                    <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">¿Cual es tu interés?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1 - Cultivos */}
                        <div className="bg-white rounded-lg border-2 border-primary-light p-6 text-center hover:shadow-lg transition-shadow">
                            <div className="flex justify-center mb-4">
                                <svg
                                    className="w-12 h-12 text-primary"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-3">Cultivos</h3>
                            <p className="text-slate-600">
                                Monitoreo del estado y desarrollo de los diferentes cultivos
                            </p>
                        </div>

                        {/* Card 2 - Bitácora */}
                        <div className="bg-white rounded-lg border-2 border-primary-light p-6 text-center hover:shadow-lg transition-shadow">
                            <div className="flex justify-center mb-4">
                                <svg
                                    className="w-12 h-12 text-primary"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-3">Bitácora</h3>
                            <p className="text-slate-600">
                                Registro detallado de actividades y eventos del predio agrícola
                            </p>
                        </div>

                        {/* Card 3 - Geolocalización */}
                        <div className="bg-white rounded-lg border-2 border-primary-light p-6 text-center hover:shadow-lg transition-shadow">
                            <div className="flex justify-center mb-4">
                                <svg
                                    className="w-12 h-12 text-primary"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-3">Geolocalización</h3>
                            <p className="text-slate-600">
                                Ubicación precisa y mapeo de predios dentro del municipio
                            </p>
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
        </>
    )
}