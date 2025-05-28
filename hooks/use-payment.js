import { useQuery, useMutation } from "@tanstack/react-query"
import { getPaymentsByCinema, acceptAllPayments, getAllPayments } from "../services/payment-service"

export const usePaymentsByCinema = (cinemaId, startDate, endDate) => {
  return useQuery({
    queryKey: ["payments", cinemaId, startDate, endDate],
    queryFn: () => getPaymentsByCinema(cinemaId, startDate, endDate),
    enabled: !!cinemaId && !!startDate && !!endDate,
  })
}

export const useAllPayments = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["all-payments", page, limit],
    queryFn: () => getAllPayments(page, limit),
  })
}

export const useAcceptAllPayments = () => {
  return useMutation({
    mutationFn: () => acceptAllPayments(),
  })
}
