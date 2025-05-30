import { forwardRef, type InputHTMLAttributes } from "react"

interface BasicInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

const BasicInput = forwardRef<HTMLInputElement, BasicInputProps>(({ className = "", ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
      {...props}
    />
  )
})

BasicInput.displayName = "BasicInput"

export default BasicInput
