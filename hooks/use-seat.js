"use client"

import { useQuery } from "@tanstack/react-query"
import { getSeatsByRoomId } from "@/services/seat_service"

export function useGetSeatsByRoomId(id) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["seats", id],
    queryFn: () => getSeatsByRoomId(id),
    enabled: !!id,
  })

  return { 
    data: data?.body || [], 
    isLoading, 
    error: error?.message || null 
  }
} 