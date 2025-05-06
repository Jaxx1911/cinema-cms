import { useQuery, useMutation } from "@tanstack/react-query"
import { getMovies, getMovieById, createMovie } from "@/services/movie-service"

export const useGetMovies = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["movies"],
    queryFn: getMovies,
  })

  return { 
    data: data?.body || [], 
    isLoading, 
    error: error?.message || null 
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

