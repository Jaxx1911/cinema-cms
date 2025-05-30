"use client"

import axios from "axios"

const baseQuery = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

export const getCinemas = async () => {
  const response = await baseQuery.get("/cinema/list")
  return response.data
}

export const getScreensByCinema = async (cinemaId) => {
  const response = await baseQuery.get(`/room/cinema/${cinemaId}?status=active`)
  return response.data
} 

export const getCinemaById = async (id) => {
    const response = await baseQuery.get(`/cinema/${id}`)
    return response.data
}
export const updateCinema = async (id, cinema) => {
  console.log("updateCinema service called with id:", id, "cinema:", cinema)
  const response = await baseQuery.put(`/cinema/${id}`, cinema)
  console.log("updateCinema service response:", response.data)
  return response.data
}
export const deleteCinema = async (id) => {
  const response = await baseQuery.delete(`/cinema/${id}`)
  return response.data
}
export const createCinema = async (cinema) => {
  console.log("createCinema service called with:", cinema)
  const response = await baseQuery.post("/cinema", cinema);
  console.log("createCinema service response:", response.data)
  return response.data;
};
