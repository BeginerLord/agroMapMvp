"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import loginData from "@/data/login.json"

export default function LoginForm() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

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
        const user = loginData.login.find(
            (u) => u.username === username && u.password === password
        )

        if (!user) {
            setError("Usuario o contraseña incorrectos")
            setIsLoading(false)
            return
        }

        // Login exitoso: redirige al contenido principal
        router.push("/home")
        setIsLoading(false)
    }

    return (
        <div
            className="flex items-center justify-center min-h-screen"
            // ...existing code...
            style={{
                backgroundImage: "url('/gif.gif')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "100vw 100vh", // Ocupa todo el viewport
            }}
        // ...existing code...
        >
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
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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