import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getCombos, getComboById, createCombo, updateCombo, deleteCombo } from "@/services/combo-service"

export const useGetCombos = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["combos"],
    queryFn: () => getCombos(),
  })

  return { 
    data: data?.body || [], 
    isLoading, 
    error: error?.message || null,
    refetch
  }
}

export const useGetComboById = (id) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["combo", id],
    queryFn: () => getComboById(id),
  })

  return {
    data: data?.body,
    isLoading,
    error: error?.message || null,
    refetch
  }
}

export const useCreateCombo = () => {
  const queryClient = useQueryClient()
  const { mutate, isLoading, error } = useMutation({
    mutationFn: (data) => createCombo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["combos"] })
    },
  })

  return {
    createCombo: mutate,
    isLoading,
    error: error?.message || null
  }
}

export const useUpdateCombo = () => {
  const queryClient = useQueryClient()
  const { mutate, isLoading, error } = useMutation({
    mutationFn: ({ id, data }) => updateCombo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["combos"] })
    },
  })

  return {
    updateCombo: mutate,
    isLoading,
    error: error?.message || null
  }
}

export const useDeleteCombo = () => {
  const queryClient = useQueryClient()
  const { mutate, isLoading, error } = useMutation({
    mutationFn: (id) => deleteCombo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["combos"] })
    },
  })

  return {
    deleteCombo: mutate,
    isLoading,
    error: error?.message || null
  }
}


