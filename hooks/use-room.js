"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { 
  getRooms, 
  getRoomById, 
  createRoom, 
  updateRoom, 
  getSeatsByRoomId 
} from "@/services/room-service"

export function useGetRooms(cinemaId) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["rooms", cinemaId],
    queryFn: () => getRooms(cinemaId),
    enabled: !!cinemaId,
  })

  return { 
    data: data?.body || [], 
    isLoading, 
    error: error?.message || null 
  }
}

export function useGetRoomById(id) {
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
  const { data, isLoading, error, mutate } = useMutation({
    mutationFn: ({ id, roomData }) => updateRoom(id, roomData),
  })

  return {
    data: data?.body || null,
    isLoading,
    error: error?.message || null,
    mutate,
  }
}


