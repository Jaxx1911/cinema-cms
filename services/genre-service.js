import axios from "axios"

const baseQuery = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/api",
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getGenres = async () => {
  const response = await baseQuery.get("/genre")
  return response.data
}

