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
  const baseClasses =
    "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
  const variantClasses =
    variant === "outline"
      ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500"
      : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {children}
    </button>
  )
}
