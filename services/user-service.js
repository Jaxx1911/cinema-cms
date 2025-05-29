import axios from "axios"

const baseQuery = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
    headers: {
      "Content-Type": "application/json",
    },
  })

// Get list of users with pagination and filters
export const getUsers = async (page = 1, limit = 10, searchTerm = "", roleFilter = "all") => {
  const accessToken = localStorage.getItem("accessToken")
  const response = await baseQuery.get(`/user?page=${page}&limit=${limit}&name=${searchTerm}&role=${roleFilter}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

// Get user by ID
export const getUserById = async (id) => {
  const accessToken = localStorage.getItem("accessToken")
  const response = await baseQuery.get(`/user/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

// Create new user
export const createUser = async (userData) => {
  const accessToken = localStorage.getItem("accessToken")
  const response = await baseQuery.post("/user", userData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

// Update user
export const updateUser = async (id, userData) => {
  const accessToken = localStorage.getItem("accessToken")
  const response = await baseQuery.put(`/user/${id}`, userData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

// Delete user
export const deleteUser = async (id) => {
  const accessToken = localStorage.getItem("accessToken")
  const response = await baseQuery.delete(`/user/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

// Get user profile (current logged in user)
export const getUserProfile = async () => {
  const accessToken = localStorage.getItem("accessToken")
  const response = await baseQuery.get("/user/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

