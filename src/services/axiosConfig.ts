import axios, { RawAxiosRequestHeaders } from "axios"
import Cookies from "js-cookie"
import toast from "react-hot-toast"
import { baseUrl } from "@/lib/constants"

// Create an Axios instance with the base URL
const axiosInstance = axios.create({ baseURL: baseUrl })

// Set common headers for the Axios instance
const setHeaders = (commonHeaders: RawAxiosRequestHeaders) => {
  axiosInstance.defaults.headers.common = commonHeaders
}

// Add request and response interceptors
axiosInstance.interceptors.request.use(
  (config) => {
    if (
      config.url &&
      config.headers &&
      !config.url.includes("login") &&
      !config.url.includes("signup")
    ) {
      const userInfo = Cookies.get("userInfo")

      if (userInfo) {
        const { accessToken, userId } = JSON.parse(userInfo)
        // eslint-disable-next-line no-param-reassign
        config.headers.Authorization = `Bearer ${accessToken}`

        if (userId) {
          Object.assign(config, {
            params: {
              ...(config.params || {}),
              user_id: userId,
            },
          })
        }
      }
    }
    const element = document.getElementById("circles-with-bar-loader")
    if (element) {
      element.style.display = "flex"
    }

    return config
  },
  (error) => Promise.reject(error),
)

axiosInstance.interceptors.response.use(
  (response) => {
    const element = document.getElementById("circles-with-bar-loader")
    if (element) {
      element.style.display = "none"
    }
    return response
  },
  (error) => {
    const element = document.getElementById("circles-with-bar-loader")
    if (element) {
      element.style.display = "none"
    }

    if (error?.response?.status === 401) {
      toast.error("Your session has expired")
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setTimeout(() => {
        const win: Window = window
        win.location = "/login"
      }, 2000)
    }

    return Promise.reject(error)
  },
)

export { axiosInstance, setHeaders }
