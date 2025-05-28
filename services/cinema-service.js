"use client"

import axios from "axios"

const baseQuery = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

export const getCinemas = async () => {
  const response = await baseQuery.get("/cinema/list")
  return response.data
}

export const getScreensByCinema = async (cinemaId) => {
  const response = await baseQuery.get(`/room/cinema/${cinemaId}`)
  return response.data
} 

export const getCinemaById = async (id) => {
    const response = await baseQuery.get(`/cinema/${id}`)
    return response.data
}
export const updateCinema = async (id, cinema) => {
  baseQuery.defaults.headers.common["Content-Type"] = "multipart/form-data"
  console.log(cinema)
  const response = await baseQuery.putForm(`/cinema/${id}`, cinema)
  return response.data
}
export const deleteCinema = async (id) => {
  const response = await baseQuery.delete(`/cinema/${id}`)
  return response.data
}
export const createCinema = async (cinema) => {
  const response = await baseQuery.post("/cinema", cinema);
  return response.data;
};
