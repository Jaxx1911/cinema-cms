import axios from "axios"

const baseQuery = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

export const getRooms = async (cinemaId) => {
  const response = await baseQuery.get(`/room/cinema/${cinemaId}`)
  return response.data
}

export const getRoomById = async (id) => {
  const response = await baseQuery.get(`/room/${id}`)
  return response.data
}

export const createRoom = async (data) => {
  const response = await baseQuery.post(`/room`, data)
  return response.data
}

export const updateRoom = async (id, data) => {
  const response = await baseQuery.put(`/room/${id}`, data)
  return response.data
}

export const getSeatsByRoomId = async (id) => {
  const response = await baseQuery.get(`/seat/room/${id}`)
  return response.data
}

export const deleteRoom = async (id) => {
  const response = await baseQuery.delete(`/room/${id}`)
  return response.data
}
