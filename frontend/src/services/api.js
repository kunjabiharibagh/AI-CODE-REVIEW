import axios from 'axios'

// Base URL of your backend
const API = axios.create({
  baseURL: 'http://localhost:5000/api'
})

// Add token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Automatically add token to every request
// Reads token from localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ─── Auth API Calls ────────────────────────────────
export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser = (data) => API.post('/auth/login', data)
export const getProfile = () => API.get('/auth/profile')

// ─── Code Review API Call ──────────────────────────
export const reviewCode = (data) => API.post('/code/review', data)
export const getHistory = () => API.get('/code/history')
export const getSingleReview = (id) => API.get(`/code/history/${id}`) 