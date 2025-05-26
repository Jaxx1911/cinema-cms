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

export const getShowtimeById = async (id) => {
  const response = await baseQuery.get(`/showtime/${id}`)
  return response.data
}

export const checkShowtimeAvailable = async (movieId, roomId, startTime, showtimeId) => {
  // Format start_time thành dd-MM-yyyy hh:mm
  const date = new Date(startTime);
  const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  
  const payload = {
    movie_id: movieId,
    room_id: roomId,
    start_time: formattedDate,
  }
  
  // Add showtime_id if it exists (for edit mode)
  if (showtimeId) {
    payload.showtime_id = showtimeId
  }
  
  const response = await baseQuery.post(`/showtime/check-availability`, payload)
  return response.data
}

export const checkAllShowtimeAvailable = async (showtimes) => {
  const payload = {
    showtimes: showtimes.map(showtime => ({
      movie_id: showtime.movieId,
      room_id: showtime.screenId,
      start_time: `${String(showtime.startTime.getDate()).padStart(2, '0')}-${String(showtime.startTime.getMonth() + 1).padStart(2, '0')}-${showtime.startTime.getFullYear()} ${String(showtime.startTime.getHours()).padStart(2, '0')}:${String(showtime.startTime.getMinutes()).padStart(2, '0')}`,
    }))
  }


  const response = await baseQuery.post(`/showtime/check-availabilities`, payload)
  return response.data
}

export const createShowtime = async (showtimeData) => {
  // Format start_time và end_time thành dd-MM-yyyy hh:mm
  const startDate = new Date(showtimeData.startTime);
  const endDate = new Date(showtimeData.endTime);
  
  const formattedStartTime = `${String(startDate.getDate()).padStart(2, '0')}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${startDate.getFullYear()} ${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}`;
  const formattedEndTime = `${String(endDate.getDate()).padStart(2, '0')}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${endDate.getFullYear()} ${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;
  
  const payload = {
    movie_id: showtimeData.movieId,
    room_id: showtimeData.screenId,
    start_time: formattedStartTime,
    price: showtimeData.price,
  }
  
  const response = await baseQuery.post('/showtime', payload)
  return response.data
}


export const createShowtimes = async (showtimesData) => {
  const payload = {
    showtimes: showtimesData.map(showtime => ({
      movie_id: showtime.movieId,
      room_id: showtime.screenId,
      start_time: `${String(showtime.startTime.getDate()).padStart(2, '0')}-${String(showtime.startTime.getMonth() + 1).padStart(2, '0')}-${showtime.startTime.getFullYear()} ${String(showtime.startTime.getHours()).padStart(2, '0')}:${String(showtime.startTime.getMinutes()).padStart(2, '0')}`,
      price: showtime.price,  
    }))
  }

  const response = await baseQuery.post('/showtime/batch', payload)
  return response.data
}


export const updateShowtime = async (id, showtimeData) => {
  // Format start_time và end_time thành dd-MM-yyyy hh:mm
  const startDate = new Date(showtimeData.startTime);
  const endDate = new Date(showtimeData.endTime);
  
  const formattedStartTime = `${String(startDate.getDate()).padStart(2, '0')}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${startDate.getFullYear()} ${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}`;
  const formattedEndTime = `${String(endDate.getDate()).padStart(2, '0')}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${endDate.getFullYear()} ${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;
  
  const payload = {
    movie_id: showtimeData.movieId,
    room_id: showtimeData.screenId,
    start_time: formattedStartTime,
    price: showtimeData.price,
  }
  
  const response = await baseQuery.put(`/showtime/${id}`, payload)
  return response.data
}

export const deleteShowtime = async (id) => {
  const response = await baseQuery.delete(`/showtime/${id}`)
  return response.data
}



