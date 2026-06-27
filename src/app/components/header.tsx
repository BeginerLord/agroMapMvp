"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"

const navLinks = [
  { href: "/predios", label: "Predios" },
  { href: "/estadisticas", label: "Estadísticas" },
  { href: "/home", label: "Acerca de" },
]

export default function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="bg-agro-white border-b border-agro-sand sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/predios" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-agro-pastel flex items-center justify-center group-hover:bg-agro-green/30 transition-colors">
              <Image
                src="/agroMap.svg"
                alt="AgroMap Logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-base text-agro-olive">AgroMap</span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-wide uppercase">Cereté</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(href + "/")
              return (
                <Link
                  key={href}
                  href={href}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${active
                      ? "bg-agro-pastel text-agro-olive"
                      : "text-foreground/70 hover:text-agro-olive hover:bg-agro-pastel/60"
                    }
                  `}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-agro-pastel/60 transition-colors text-foreground/70"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menú"
          >
            {mobileOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-agro-sand bg-agro-white px-4 py-3 space-y-1">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/")
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`
                  block px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${active
                    ? "bg-agro-pastel text-agro-olive"
                    : "text-foreground/70 hover:text-agro-olive hover:bg-agro-pastel/60"
                  }
                `}
              >
                {label}
              </Link>
            )
          })}
        </div>
      )}
    </header>
  )
}
