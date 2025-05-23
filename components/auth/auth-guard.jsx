"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"

export function AuthGuard({ children }) {
  const { token, isLoading } = useAuth()
  const [showContent, setShowContent] = useState(false)

  // Hiệu ứng fade-in khi đăng nhập thành công
  useEffect(() => {
    if (token) {
      setShowContent(true)
    } else {
      setShowContent(false)
    }
  }, [token])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Overlay che mờ khi chưa đăng nhập */}
      {!token && <div className="fixed inset-0 z-40 bg-white/80 backdrop-blur-sm transition-opacity duration-300"></div>}

      {/* Nội dung chính của ứng dụng */}
      <div
        className={`transition-opacity duration-300 ${showContent ? "opacity-100" : "pointer-events-none opacity-30"}`}
      >
        {children}
      </div>
    </div>
  )
}
