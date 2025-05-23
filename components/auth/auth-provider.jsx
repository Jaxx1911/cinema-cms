"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { LoginDialog } from "@/components/auth/login-dialog"

// Tạo context để quản lý trạng thái đăng nhập
export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)

  // Kiểm tra trạng thái đăng nhập khi component được tải
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken")
    if (storedToken) {
      try {
        setToken(storedToken)
      } catch (error) {
        console.error("Error parsing token:", error)
        localStorage.removeItem("accessToken")
      }
    }
    setIsLoading(false)
  }, [])

  // Tự động hiển thị dialog đăng nhập khi chưa đăng nhập
  useEffect(() => {
    if (!isLoading && !token) {
      setIsLoginDialogOpen(true)
    }
  }, [isLoading, token])

  const logout = () => {
    setToken(null)
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("accessExpiredAt")
    localStorage.removeItem("refreshExpiredAt")
    setIsLoginDialogOpen(true)
  }

  const openLoginDialog = () => {
    setIsLoginDialogOpen(true)
  }

  const closeLoginDialog = () => {
    // Chỉ cho phép đóng dialog nếu đã đăng nhập
    if (token) {
      setIsLoginDialogOpen(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        isLoading,
        logout,
        openLoginDialog,
      }}
    >
      {children}
      <LoginDialog isOpen={isLoginDialogOpen} onClose={closeLoginDialog} forceOpen={!token} />
    </AuthContext.Provider>
  )
}

// Hook để sử dụng AuthContext
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
