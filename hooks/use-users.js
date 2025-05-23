"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { getUsers, createUser, updateUser, deleteUser, getUserById } from "@/services/user-service"
import { CheckCircleIcon } from "lucide-react"

export const useUsers = ({ page = 1, limit = 10, search = "", role = "all" } = {}) => {
  const { toast } = useToast()
  
  return useQuery({
    queryKey: ["users", { page: Number(page), limit: Number(limit), search, role }],
    queryFn: () => getUsers(Number(page), Number(limit), search, role),
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi xảy ra khi tải danh sách người dùng",
        variant: "destructive",
      })
    },
  })
}

export function useCreateUser() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { mutate, isLoading, error } = useMutation({
    mutationFn: (userData) => createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast({
        title: "Thành công",
        icon: <CheckCircleIcon className="h-4 w-4" color="green" />,
        description: "Tạo người dùng thành công",
        variant: "default",
      })
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Có lỗi xảy ra khi tạo người dùng",
        variant: "destructive",
      })
    },
  })

  return {
    createUser: mutate,
    isLoading,
    error: error?.message || null,
  }
}

export function useUpdateUser() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { mutate, isLoading, error } = useMutation({
    mutationFn: ({ id, userData }) => updateUser(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast({
        title: "Thành công",
        icon: <CheckCircleIcon className="h-4 w-4" color="green" />,
        description: "Cập nhật người dùng thành công",
        variant: "default",
      })
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Có lỗi xảy ra khi cập nhật người dùng",
        variant: "destructive",
      })
    },
  })

  return {
    updateUser: mutate,
    isLoading,
    error: error?.message || null,
  }
}

export function useDeleteUser() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { mutate, isLoading, error } = useMutation({
    mutationFn: (id) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast({
        title: "Thành công",
        icon: <CheckCircleIcon className="h-4 w-4" color="green" />,
        description: "Xóa người dùng thành công",
        variant: "default",
      })
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Có lỗi xảy ra khi xóa người dùng",
        variant: "destructive",
      })
    },
  })

  return {
    deleteUser: mutate,
    isLoading,
    error: error?.message || null,
  }
}

export function useUser(id) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  })

  return {
    user: data?.body || null,
    isLoading,
    error: error?.message || null,
  }
} 