
import { useQuery } from "@tanstack/react-query"
import { getStatisticCombo, getStatisticMovie, getStatisticCinema } from "@/services/statistic-service"

export const useStatisticCombo = (startDate, endDate) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["statistic-combo", startDate, endDate],
    queryFn: () => getStatisticCombo(startDate, endDate),
    enabled: !!startDate && !!endDate,
  })
  return { data, isLoading, error }
}

export const useStatisticMovie = (startDate, endDate) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["statistic-movie", startDate, endDate],
    queryFn: () => getStatisticMovie(startDate, endDate),
    enabled: !!startDate && !!endDate,
  })
  return { data, isLoading, error }
}

export const useStatisticCinema = (startDate, endDate) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["statistic-cinema", startDate, endDate],
    queryFn: () => getStatisticCinema(startDate, endDate),
    enabled: !!startDate && !!endDate,
  })
  return { data, isLoading, error }
}