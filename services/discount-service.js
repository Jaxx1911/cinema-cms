import axios from 'axios';

const baseQuery = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/api",
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getDiscounts = async () => {
  const response = await baseQuery.get('/discount/list')
  return response.data
}

export const getDiscountById = async (id) => {
  const response = await baseQuery.get(`/discount/${id}`)
  return response.data
}

export const createDiscount = async (data) => {
  const response = await baseQuery.post('/discount', data)
  return response.data
}

export const updateDiscount = async (id, data) => {
  const response = await baseQuery.put(`/discount/${id}`, data)
  return response.data
}

export const deleteDiscount = async (id) => {
  const response = await baseQuery.delete(`/discount/${id}`)
  return response.data
} 