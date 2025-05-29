import axios from "axios"

const baseQuery = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

export const login = async (email, password) => {
  const response = await baseQuery.post("/auth/login/admin", { email, password })
  return response.data
}

export const refreshToken = async (refresh_token) => {
  const response = await baseQuery.post("/auth/refresh", { refresh_token })
  return response.data
}

export const getUserProfile = async () => {
  const accessToken = localStorage.getItem("accessToken")
  const response = await baseQuery.get("/user/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

