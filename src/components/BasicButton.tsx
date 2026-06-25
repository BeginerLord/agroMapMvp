"use client"

import type { ReactNode } from "react"

interface BasicButtonProps {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: "button" | "submit"
  variant?: "default" | "outline"
  className?: string
}

export default function BasicButton({
  children,
  onClick,
  disabled = false,
  type = "button",
  variant = "default",
  className = "",
}: BasicButtonProps) {
  const base = "inline-flex items-center justify-center font-semibold rounded-xl px-6 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-agro-olive/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
  const variants = {
    default: "bg-agro-olive hover:bg-agro-green text-white shadow-sm hover:shadow-md",
    outline: "border-2 border-agro-olive text-agro-olive hover:bg-agro-pastel bg-transparent",
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
