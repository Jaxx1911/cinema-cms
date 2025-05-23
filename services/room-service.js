
import axios from "axios"

const baseQuery = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

export const getRooms = async () => {
  const response = await baseQuery.get(`/room`)
  return response.data
}
export const getRoomById = async (id) => {
    const response = await baseQuery.get(`/room/${id}`)
    return response.data
}
export const getSeatsByRoomId = async (id) => {
    const response = await baseQuery.get(`/seat/room/${id}`)
    return response.data
}
