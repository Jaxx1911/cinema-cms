import axios from "axios"

const baseQuery = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/api",
    headers: {
      "Content-Type": "application/json",
    },
  })


export const getPaymentsByCinema = async (cinemaId, startDate, endDate) => {
  const response = await baseQuery.get(`/payment/cinema/${cinemaId}`, {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  })
  return response.data
}

export const acceptAllPayments = async () => {
  const response = await baseQuery.post(`/payment/accept-all`)
  return response.data
}
