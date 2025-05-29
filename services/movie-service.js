import axios from "axios"

const baseQuery = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

export const getMovies = async (page = 1, limit = 10, searchTerm = "", statusFilter = "all", tagFilter = "all") => {
  const response = await baseQuery.get(`/movie/list?page=${page}&limit=${limit}&term=${searchTerm}&status=${statusFilter}&tag=${tagFilter}`)
  return response.data
}

export const getMovieById = async (id) => {
  const response = await baseQuery.get(`/movie/${id}`)
  return response.data
}

export const createMovie = async (movie) => {
  const accessToken = localStorage.getItem("accessToken")
  baseQuery.defaults.headers.common["Content-Type"] = "multipart/form-data"
  const response = await baseQuery.postForm("/movie", movie, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export const updateMovie = async (id, movie) => {
  const accessToken = localStorage.getItem("accessToken")
  baseQuery.defaults.headers.common["Content-Type"] = "multipart/form-data"
  const response = await baseQuery.putForm(`/movie/${id}`, movie, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export const stopMovie = async (id) => {
  const accessToken = localStorage.getItem("accessToken")
  const response = await baseQuery.put(`/movie/stop/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export const resumeMovie = async (id) => {
  const accessToken = localStorage.getItem("accessToken")
  const response = await baseQuery.put(`/movie/reshow/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export const getMoviesByStatus = async (status) => {
  const response = await baseQuery.get(`/movie?status=${status}`)
  return response.data
}