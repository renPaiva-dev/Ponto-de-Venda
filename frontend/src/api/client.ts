import axios from "axios"

const AUTH_STORAGE_KEY = "pos_auth"

export const client = axios.create({
  baseURL: "http://localhost:5000",
})

client.interceptors.request.use((config) => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY)
  if (raw) {
    const { jwt } = JSON.parse(raw) as { jwt: string }
    config.headers.Authorization = `Bearer ${jwt}`
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      if (window.location.pathname !== "/login") {
        window.location.assign("/login")
      }
    }
    return Promise.reject(error)
  },
)

export { AUTH_STORAGE_KEY }
