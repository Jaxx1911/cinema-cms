"use client"
import { useQuery, useMutation } from "@tanstack/react-query"
import { getRooms, getRoomById } from "@/services/room-service"
export function useGetRooms () {
  const { data, isLoading, error } = useQuery({
    queryKey: ["room"],
    queryFn: getRooms,
  })
  return { 
    data: data?.body || [], 
    isLoading, 
    error: error?.message || null 
  }
}
export const useGetRoomById = (id) => {
    const { data, isLoading, error } = useQuery({
      queryKey: ["room", id],
      queryFn: () => getRoomById(id),
      enabled: !!id,
    })
    return { 
      data: data?.body || null, 
      isLoading, 
      error: error?.message || null 
    }
  }
export const useGetSeatsByRoomId = (id) => {
    const { data, isLoading, error } = useQuery({
      queryKey: ["seats", id],
      queryFn: () => getSeatsByRoomId(id),
      enabled: !!id,
    })
    return { 
      data: data?.body || null, 
      isLoading, 
      error: error?.message || null 
    }
  }