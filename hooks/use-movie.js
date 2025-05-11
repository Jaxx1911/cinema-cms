import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getMovies, getMovieById, createMovie, updateMovie, resumeMovie, stopMovie } from "@/services/movie-service"

export const useGetMovies = (page = 1, limit = 10) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["movies", page, limit],
    queryFn: () => getMovies(page, limit),
  })

  return { 
    data: data?.body || { data: [], total_count: 0 }, 
    isLoading, 
    error: error?.message || null,
    refetch: (newPage, newLimit) => refetch({ queryKey: ["movies", newPage, newLimit] }),
  }
}

export const useGetMovieById = (id) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieById(id),
    enabled: !!id,
  })

  return { 
    data: data?.body || null, 
    isLoading, 
    error: error?.message || null 
  }
}

export const useCreateMovie = () => {
  const { data, isLoading, error, mutate } = useMutation({
    mutationFn: (formData) => createMovie(formData),
  })

  return {
    data: data?.body || null,
    isLoading,
    error: error?.message || null,
    mutate: mutate,
  }
}

export const useUpdateMovie = () => {
  const queryClient = useQueryClient()
  const { data, isLoading, error, mutate } = useMutation({
    mutationFn: ({ id, formData }) => updateMovie(id, formData),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["movies"] })
      queryClient.invalidateQueries({ queryKey: ["movie"] })
    },
  })

  return {
    data: data?.body || null,
    isLoading,
    error: error?.message || null,
    mutate: mutate,
  }
}

export const useStopMovie = () => {
  const { data, isLoading, error, mutate } = useMutation({
    mutationFn: (id) => stopMovie(id),
  })

  return {
    data: data?.body || null,
    isLoading,
    error: error?.message || null,
    mutate: mutate,
  }
}

export const useResumeMovie = () => {
  const { data, isLoading, error, mutate } = useMutation({
    mutationFn: (id) => resumeMovie(id),
  })

  return {
    data: data?.body || null,
    isLoading,
    error: error?.message || null,
    mutate: mutate,
  }
}

