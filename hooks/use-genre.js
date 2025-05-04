import { getGenres } from "@/services/genre-service"
import { useQuery } from "@tanstack/react-query"

export function useGetGenres() {
    const { data, error, isLoading } = useQuery({
        queryKey: ["genres"],
        queryFn: getGenres,
    })
    return { 
        data: data?.body || [], 
        isLoading, 
        error: error?.message || null 
      }
}


