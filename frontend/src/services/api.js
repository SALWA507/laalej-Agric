
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    Accept: 'application/json',
  },
})

export async function fetchProducts(params = {}) {
  const response = await api.get('/products', { params })
  return response.data
}

export async function fetchCategories() {
  const response = await api.get('/categories')
  return response.data
}

export async function fetchProduct(id) {
  const response = await api.get(`/products/${id}`)
  return response.data
}

export default api
