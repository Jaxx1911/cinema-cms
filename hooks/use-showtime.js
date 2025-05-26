import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getShowtimes, getShowtimeById, checkShowtimeAvailable, createShowtime, updateShowtime, deleteShowtime, checkAllShowtimeAvailable, createShowtimes } from "@/services/showtime-service"

export const useGetShowtimes = (movieId, cinemaId, screenId, startDate, endDate) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["showtimes", movieId, cinemaId, screenId, startDate, endDate],
    queryFn: () => getShowtimes(movieId, cinemaId, screenId, startDate, endDate),
    enabled: !!cinemaId,
  })
  return {
    data: data?.body || null,
    isLoading: isLoading,
    error: error?.message || null,
  }
}

export const useGetShowtimeById = (id) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["showtime", id],
    queryFn: () => getShowtimeById(id),
    enabled: !!id,
  })
  return {
    data: data?.body || null,
    isLoading: isLoading,
    error: error?.message || null,
  }
}

export const useCheckShowtimeAvailable = () => {
  const { mutate, isLoading, error } = useMutation({
    mutationFn: ({ movieId, roomId, startTime, showtimeId }) => 
      checkShowtimeAvailable(movieId, roomId, startTime, showtimeId),
  })
  
  return {
    checkShowtimeAvailable: mutate,
    isLoading,
    error: error?.message || null,
  }
}

export const useCheckAllShowtimeAvailable = () => {
  const { mutate, isLoading, error } = useMutation({
    mutationFn: ({ showtimes }) => checkAllShowtimeAvailable(showtimes),
  })
  
  return {
    checkAllShowtimeAvailable: mutate,
    isLoading,
    error: error?.message || null,
  }
}

export const useCreateShowtime = () => {
  const queryClient = useQueryClient()
  
  const { mutate, isLoading, error } = useMutation({
    mutationFn: (showtimeData) => createShowtime(showtimeData),
    onSuccess: () => {
      // Invalidate và refetch danh sách showtimes
      queryClient.invalidateQueries({ queryKey: ["showtimes"] })
    }
  })
  
  return {
    createShowtime: mutate,
    isLoading,
    error: error?.message || null,
  }
}

export const useCreateShowtimes = () => {
  const { mutate, isLoading, error } = useMutation({
    mutationFn: (showtimesData) => createShowtimes(showtimesData),
  })
  
  return {
    createShowtimes: mutate,
    isLoading,
    error: error?.message || null,
  }
}



export const useUpdateShowtime = () => {
  const queryClient = useQueryClient()
  
  const { mutate, isLoading, error } = useMutation({
    mutationFn: ({ id, showtimeData }) => updateShowtime(id, showtimeData),
    onSuccess: (data, variables) => {
      // Invalidate và refetch danh sách showtimes và showtime cụ thể
      queryClient.invalidateQueries({ queryKey: ["showtimes"] })
      queryClient.invalidateQueries({ queryKey: ["showtime", variables.id] })
    }
  })
  
  return {
    updateShowtime: mutate,
    isLoading,
    error: error?.message || null,
  }
}

export const useDeleteShowtime = () => {
  const queryClient = useQueryClient()
  
  const { mutate, isLoading, error } = useMutation({
    mutationFn: (id) => deleteShowtime(id),
    onSuccess: () => {
      // Invalidate và refetch danh sách showtimes
      queryClient.invalidateQueries({ queryKey: ["showtimes"] })
    }
  })
  
  return {
    deleteShowtime: mutate,
    isLoading,
    error: error?.message || null,
  }
}

