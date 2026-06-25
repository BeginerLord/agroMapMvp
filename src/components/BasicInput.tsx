import { forwardRef, type InputHTMLAttributes } from "react"

interface BasicInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

const BasicInput = forwardRef<HTMLInputElement, BasicInputProps>(({ className = "", ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`agro-input ${className}`}
      {...props}
    />
  )
})

BasicInput.displayName = "BasicInput"

export default BasicInput
