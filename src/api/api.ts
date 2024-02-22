import axios from 'axios'

const app = axios.create({
  baseURL: import.meta.env.VITE_HOST_API_URL
})

export default app