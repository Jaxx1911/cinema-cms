"use client"
import { useQuery, useMutation } from "@tanstack/react-query"
import { getCinemas, getCinemaById, updateCinema, deleteCinema, createCinema } from "@/services/cinema-service"

export function useGetCinemas () {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cinema"],
    queryFn: () => getCinemas(),
  })

  return { 
    data: data?.body || [], 
    isLoading, 
    error: error?.message || null 
  }
}

export const useGetCinemaById = (id) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["cinema", id],
    queryFn: () => getCinemaById(id),
    enabled: !!id,
  })

  return { 
    data: data?.body || null, 
    isLoading, 
    error: error?.message || null,
    refetch
  }
}

export const useUpdateCinema = () => {
  const { data, isLoading, error, mutate } = useMutation({
    mutationFn: ({ id, cinema }) => updateCinema(id, cinema),
  })

  return {
    data: data?.body || null,
    isLoading,
    error: error?.message || null,
    mutate,
  }
}
  
export const useCreateCinema = () => {
  const { data, isLoading, error, mutate } = useMutation({
    mutationFn: (cinema) => createCinema(cinema),
  });

  return {
    data: data?.body || null,
    isLoading,
    error: error?.message || null,
    mutate,
  };
};
  