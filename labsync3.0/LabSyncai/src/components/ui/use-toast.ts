import { useEffect, useState } from "react"

type ToastProps = {
  title?: string
  description?: string
  type?: "default" | "success" | "error" | "warning"
  duration?: number
}

type Toast = {
  id: string
  title?: string
  description?: string
  type: "default" | "success" | "error" | "warning"
  duration: number
}

type ToastActionType = {
  toast: (props: ToastProps) => void
  dismiss: (id: string) => void
  dismissAll: () => void
}

const useToast = (): ToastActionType => {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const timers = toasts.map((toast) => {
      return setTimeout(() => {
        dismiss(toast.id)
      }, toast.duration)
    })

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [toasts])

  const toast = (props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prevToasts) => [
      ...prevToasts,
      {
        id,
        title: props.title,
        description: props.description,
        type: props.type || "default",
        duration: props.duration || 5000,
      },
    ])
    return id
  }

  const dismiss = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  const dismissAll = () => {
    setToasts([])
  }

  return {
    toast,
    dismiss,
    dismissAll,
  }
}

export { useToast }
export type { ToastProps }