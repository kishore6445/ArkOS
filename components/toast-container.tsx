"use client"

import { Toaster } from "sonner"

export function ToastContainer() {
  return (
    <Toaster
      position="bottom-right"
      richColors
      theme="light"
      toastOptions={{
        duration: 4000,
        classNames: {
          toast: "animate-slide-in-right",
          success: "bg-green-50 border-green-200 text-green-900",
          error: "bg-red-50 border-red-200 text-red-900",
          warning: "bg-amber-50 border-amber-200 text-amber-900",
          info: "bg-blue-50 border-blue-200 text-blue-900",
        },
      }}
    />
  )
}
