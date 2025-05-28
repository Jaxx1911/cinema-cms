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