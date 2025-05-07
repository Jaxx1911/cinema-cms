import axios from "axios"

const baseQuery = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

export const getMovies = async (page = 1, limit = 10) => {
  const response = await baseQuery.get(`/movie/list?page=${page}&limit=${limit}`)
  return response.data
}

export const getMovieById = async (id) => {
  const response = await baseQuery.get(`/movie/${id}`)
  return response.data
}

export const createMovie = async (movie) => {
  baseQuery.defaults.headers.common["Content-Type"] = "multipart/form-data"
  const response = await baseQuery.postForm("/movie", movie)
  return response.data
}

export const updateMovie = async (id, movie) => {
  baseQuery.defaults.headers.common["Content-Type"] = "multipart/form-data"
  console.log(movie)
  const response = await baseQuery.putForm(`/movie/${id}`, movie)
  return response.data
}

