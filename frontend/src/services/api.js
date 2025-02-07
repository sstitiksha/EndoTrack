import axios from "axios"

// Point to your backend server
const API = axios.create({
  baseURL: "https://endotrack.onrender.com"
})

// Attach JWT token if available
API.interceptors.request.use(config => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default API
