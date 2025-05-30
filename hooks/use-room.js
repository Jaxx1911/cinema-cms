"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { 
  getRooms, 
  getRoomById, 
  createRoom, 
  updateRoom, 
  getSeatsByRoomId,
  deleteRoom
} from "@/services/room-service"

export function useGetRooms(cinemaId) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["rooms", cinemaId],
    queryFn: () => getRooms(cinemaId),
    enabled: !!cinemaId,
  })

  return { 
    data: data?.body || [], 
    isLoading, 
    error: error?.message || null,
    refetch
  }
}

export function useGetRoomById(id) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["room", id],
    queryFn: () => getRoomById(id),
    enabled: !!id,
  })

  return { 
    data: data?.body || null, 
    isLoading, 
    error: error?.message || null,
    refetch
  }
}

export const useCreateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
};

export function useUpdateRoom() {
  const queryClient = useQueryClient();
  const { data, isLoading, error, mutate } = useMutation({
    mutationFn: ({ id, roomData }) => updateRoom(id, roomData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  })

  return {
    data: data?.body || null,
    isLoading,
    error: error?.message || null,
    mutate,
  }
}

export function useDeleteRoom() {
  const queryClient = useQueryClient();
  const { data, isLoading, error, mutate } = useMutation({
    mutationFn: ({ id }) => deleteRoom(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  })

  return {
    data: data?.body || null,
    isLoading,
    error: error?.message || null,
    mutate,
  }
}
