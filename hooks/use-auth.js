"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { login, refreshToken, getUserProfile } from "@/services/auth-service"
import { CheckCircle2, XCircle } from "lucide-react"
export function useLogin() {
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { mutate, isLoading, error } = useMutation({
    mutationFn: ({ email, password }) => login(email, password),
    onSuccess: (data) => {
      // Store tokens
      localStorage.setItem("accessToken", data.body.token.access_token)
      localStorage.setItem("refreshToken", data.body.token.refresh_token)
      localStorage.setItem("accessExpiredAt", data.body.token.access_expired_at)
      localStorage.setItem("refreshExpiredAt", data.body.token.refresh_expired_at)

      // Invalidate and refetch user profile
      queryClient.invalidateQueries({ queryKey: ["user"] })

      toast({
        title: "Thành công",
        icon: <CheckCircle2 className="h-4 w-4" color="green" />,
        description: "Đăng nhập thành công",
      })

      router.refresh()
      // Add full page reload after a short delay to ensure data is updated
      setTimeout(() => {
        window.location.reload()
      }, 100)
    },
    onError: (error) => {
      let description = ""
      if (error?.response?.status === 401) {
        description = "Thông tin không chính xác"
      } else if (error?.response?.status === 403) {
        description = "Người dùng không có quyền truy cập trang này"
      } else if (error?.response?.status === 404) {
        description = "Email không tồn tại"
      } else {
        description = "Có lỗi xảy ra khi đăng nhập"
      }
      toast({
        title: "Lỗi",
        description: description,
        icon: <XCircle className="h-5 w-5 text-red-500" />,
      })
    },
  })

  return {
    login: mutate,
    isLoading,
    error: error?.message || null,
  }
}

export function useUser() {
  const { toast } = useToast()

  const { data, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: getUserProfile,
    retry: (failureCount, error) => {
      if (error?.response?.status === 401) {
        return false // Don't retry on 401
      }
      return failureCount < 3 // Retry up to 3 times for other errors
    },
    onError: (error) => {
      if (error?.response?.status !== 401) {
        toast({
          title: "Lỗi",
          description: error.response.error || "Có lỗi xảy ra khi lấy thông tin người dùng",
          variant: "destructive",
          icon: <XCircle className="h-5 w-5 text-red-500" />,
        })
      }
    },
  })

  return {
    user: data?.body || null,
    isLoading,
    error: error?.message || null,
  }
}

export function useRefreshToken() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { mutate, isLoading, error } = useMutation({
    mutationFn: (refresh_token) => refreshToken(refresh_token),
    onSuccess: (data) => {
      // Update tokens
      localStorage.setItem("accessToken", data.body.access_token)
      localStorage.setItem("refreshToken", data.body.refresh_token)
      localStorage.setItem("accessExpiredAt", data.body.access_expired_at)
      localStorage.setItem("refreshExpiredAt", data.body.refresh_expired_at)

      // Invalidate and refetch user profile
      queryClient.invalidateQueries({ queryKey: ["user"] })
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi xảy ra khi làm mới token",
        variant: "destructive",
      })
    },
  })

  return {
    refreshToken: mutate,
    isLoading,
    error: error?.message || null,
  }
}

export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const logout = () => {
    // Clear tokens
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("accessExpiredAt")
    localStorage.removeItem("refreshExpiredAt")

    // Clear queries
    queryClient.clear()

    // Redirect to login
    router.push("/login")
  }

  return { logout }
}


