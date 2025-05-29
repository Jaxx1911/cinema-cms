import axios from "axios"

const baseQuery = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
})
export const getSeatsByRoomId = async (id) => {
    const response = await baseQuery.get(`/seat/room/${id}`)
    return response.data
  }