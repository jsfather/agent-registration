import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://stage-api.sanaap.co'
const INSURANCE_CODE = import.meta.env.VITE_INSURANCE_CODE || 'DEY'

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v2/app/${INSURANCE_CODE}`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const baseApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => {
    if (response.data?.response !== undefined) {
      return {
        ...response,
        data: response.data.response,
      }
    }
    return response
  },
  (error) => {
    if (error.response?.data?.error_details?.fa_details) {
      error.message = error.response.data.error_details.fa_details
    }
    return Promise.reject(error)
  }
)

baseApiClient.interceptors.response.use(
  (response) => {
    if (response.data?.response !== undefined) {
      return {
        ...response,
        data: response.data.response,
      }
    }
    return response
  },
  (error) => {
    if (error.response?.data?.error_details?.fa_details) {
      error.message = error.response.data.error_details.fa_details
    }
    return Promise.reject(error)
  }
)

export { INSURANCE_CODE }
