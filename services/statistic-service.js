import axios from "axios"

const baseQuery = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/api",
    headers: {
      "Content-Type": "application/json",
    },
  })

export const getStatisticCombo = async (startDate, endDate) => {
  const response = await baseQuery.get("/statistic/combo", {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  })
  return response.data
}

export const getStatisticMovie = async (startDate, endDate) => {
  const response = await baseQuery.get("/statistic/movie-revenue", {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  })
  return response.data
}

export const getStatisticCinema = async (startDate, endDate) => {
  const response = await baseQuery.get("/statistic/cinema-revenue", {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  })
  return response.data
}
