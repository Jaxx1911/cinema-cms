import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscount,
} from '@/services/discount-service'

export const useDiscounts = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['discounts'],
    queryFn: getDiscounts,
  })

  return {
    data: data?.body,
    isLoading,
    error: error?.message || null
  }
}

export const useDiscount = (id) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['discount', id],
    queryFn: () => getDiscountById(id),
    enabled: !!id,  
  })

  return {
    data: data?.body,
    isLoading,
    error: error?.message || null
  }
}

export const useCreateDiscount = () => {
  const queryClient = useQueryClient()
  const { mutate, isLoading, error } = useMutation({
    mutationFn: createDiscount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discounts'] })
    },
  })

  return {
    createDiscount: mutate,
    isLoading,
    error: error?.message || null
  }
}

export const useUpdateDiscount = () => {
  const queryClient = useQueryClient()
  const { mutate, isLoading, error } = useMutation({
    mutationFn: ({ id, data }) => updateDiscount(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discounts'] })
    },
  })

  return {
    updateDiscount: mutate,
    isLoading,
    error: error?.message || null
  }
}

export const useDeleteDiscount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteDiscount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discounts'] })
    },
  })
} 