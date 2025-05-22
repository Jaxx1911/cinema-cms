"use client"

import { useQuery } from "@tanstack/react-query"
import { getCinemas, getScreensByCinema } from "@/services/cinema-service"

export const useCinemas = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cinemas"],
    queryFn: () => getCinemas(),
  })

  return {
    cinemas: data?.body || [],
    isLoading,
    error: error?.message || null,
  }
}

export const useScreensByCinema = (cinemaId) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["screens", cinemaId],
    queryFn: () => getScreensByCinema(cinemaId),
    enabled: !!cinemaId && cinemaId !== "all", // Chỉ gọi API khi có cinemaId và không phải "all"
  })

  return {
    screens: data?.body || [],
    isLoading,
    error: error?.message || null,
  }
} 