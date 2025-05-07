// @/services/cinema-service.ts hoặc .js
import axios from "axios"

const baseQuery = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

export const getCinemas = async () => {
  const response = await baseQuery.get(`/cinema/list`)
  return response.data
}
export const getCinemaById = async (id) => {
    const response = await baseQuery.get(`/cinema/${id}`)
    return response.data
}