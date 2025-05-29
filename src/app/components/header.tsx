import Link from "next/link"
import Image from "next/image"

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/agromap.svg" alt="AgroMap Logo" width={32} height={32} className="w-8 h-8" />
            <span className="font-bold text-xl text-primary">AgroMap</span>
          </Link>

          <nav className="flex space-x-8">
            <Link href="/home" className="text-slate-600 hover:text-primary transition-colors font-medium">
              Inicio
            </Link>
            <Link href="/predios" className="text-slate-600 hover:text-primary transition-colors font-medium">
              Predios
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
