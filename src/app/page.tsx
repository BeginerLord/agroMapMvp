"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import loginData from "@/data/login.json"

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Verificar si ya está autenticado al cargar la página
  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  // Controlar el scroll del body para el login
  useEffect(() => {
    if (!isAuthenticated) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isAuthenticated])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const username = formData.get("username") as string
    const password = formData.get("password") as string

    if (!username || !password) {
      setError("Usuario y contraseña son requeridos")
      setIsLoading(false)
      return
    }

    // Simular delay de autenticación
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Verificar credenciales
    const user = loginData.login.find((u) => u.username === username && u.password === password)

    if (!user) {
      setError("Usuario o contraseña incorrectos")
      setIsLoading(false)
      return
    }

    // Login exitoso
    localStorage.setItem("isAuthenticated", "true")
    setIsAuthenticated(true)
    setIsLoading(false)
  }

  // Si no está autenticado, mostrar login
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-gray-50 flex items-center justify-center p-4 overflow-hidden z-50">
        <div className="w-full max-w-md">
          {/* Logo y título */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image src="/agromap.svg" alt="AgroMap Logo" width={64} height={64} className="w-16 h-16" />
            </div>
            <h1 className="text-3xl font-bold text-primary">AgroMap</h1>
          </div>

          {/* Formulario de login */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-center text-primary">Iniciar Sesión</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Usuario */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Usuario
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Ingresa tu usuario"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    autoComplete="username"
                  />
                </div>

                {/* Contraseña */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingresa tu contraseña"
                      required
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                          />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Mensaje de error */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                {/* Botón de login */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary-light text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Si está autenticado, mostrar contenido original (sin botón de cerrar sesión)
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
                <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Cultivos</h3>
              <p className="text-slate-600">Monitoreo del estado y desarrollo de los diferentes cultivos</p>
            </div>

            {/* Card 2 - Bitácora */}
            <div className="bg-white rounded-lg border-2 border-primary-light p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Bitácora</h3>
              <p className="text-slate-600">Registro detallado de actividades y eventos del predio agrícola</p>
            </div>

            {/* Card 3 - Geolocalización */}
            <div className="bg-white rounded-lg border-2 border-primary-light p-6 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    </>
  )
}