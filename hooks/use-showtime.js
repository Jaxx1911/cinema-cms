import { useQuery } from "@tanstack/react-query"
import { getShowtimes } from "@/services/showtime-service"

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
