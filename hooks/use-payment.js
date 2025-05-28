import { useQuery, useMutation } from "@tanstack/react-query"
import { getPaymentsByCinema, acceptAllPayments } from "../services/payment-service"

export const usePaymentsByCinema = (cinemaId, startDate, endDate) => {
  return useQuery({
    queryKey: ["payments", cinemaId, startDate, endDate],
    queryFn: () => getPaymentsByCinema(cinemaId, startDate, endDate),
    enabled: !!cinemaId && !!startDate && !!endDate,
  })
}

export const useAcceptAllPayments = () => {
  return useMutation({
    mutationFn: () => acceptAllPayments(),
  })
}
