import axios from 'axios';

const baseQuery = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/api",
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getCombos = async () => {
  const response = await baseQuery.get('/combo')
  return response.data
}

export const getComboById = async (id) => {
  const response = await baseQuery.get(`/combo/${id}`)
  return response.data
}

export const createCombo = async (data) => {
  baseQuery.defaults.headers.common["Content-Type"] = "multipart/form-data"
  const response = await baseQuery.postForm('/combo', data)
  return response.data
}

export const updateCombo = async (id, data) => {
  baseQuery.defaults.headers.common["Content-Type"] = "multipart/form-data"
  const response = await baseQuery.putForm(`/combo/${id}`, data)
  return response.data
}

export const deleteCombo = async (id) => {
  const response = await baseQuery.delete(`/combo/${id}`)
  return response.data
}
