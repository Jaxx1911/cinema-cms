import axios from "axios"

const baseQuery = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
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

export const getAllPayments = async (page = 1, limit = 10) => {
  const token = localStorage.getItem("accessToken")
  const response = await baseQuery.get(`/payment/list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
      limit,
    },
  })
  return response.data
}

export const acceptAllPayments = async () => {
  const response = await baseQuery.post(`/payment/accept-all`)
  return response.data
}
