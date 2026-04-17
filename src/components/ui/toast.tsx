'use client'

import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

export type ToastVariant = 'success' | 'error' | 'warning'

interface ToastProps {
  message: string
  variant: ToastVariant
  duration?: number
  onClose?: () => void
}

const variantClasses: Record<ToastVariant, string> = {
  success: 'bg-green-50 border-green-200 text-green-900',
  error: 'bg-red-50 border-red-200 text-red-900',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
}

const iconClasses: Record<ToastVariant, string> = {
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-yellow-600',
}

export function Toast({ message, variant, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  return (
    <div
      className={`
        fixed bottom-4 right-4 max-w-sm
        border rounded-lg p-4
        flex items-start gap-3
        shadow-lg animate-in fade-in slide-in-from-bottom-4
        ${variantClasses[variant]}
      `}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex-1 text-sm">{message}</div>
      <button
        onClick={() => {
          setIsVisible(false)
          onClose?.()
        }}
        className={`shrink-0 ${iconClasses[variant]} hover:opacity-70 transition-opacity`}
        aria-label="Fechar notificação"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
