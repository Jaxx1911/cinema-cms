import axios from "axios"

const baseQuery = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

export const getMovies = async () => {
  const response = await baseQuery.get("/movie/list")
  return response.data
}

export const getMovieById = async (id) => {
  const response = await baseQuery.get(`/movie/${id}`)
  return response.data
}




