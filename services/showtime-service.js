"use client"

import axios from "axios"

const baseQuery = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

export const getShowtimes = async (movieId, cinemaId, screenId, startDate, endDate) => {
  const response = await baseQuery.get("/showtime/list", { params: { movie_id: movieId, cinema_id: cinemaId, screen_id: screenId, from_date: startDate, to_date: endDate } })
  return response.data
}
