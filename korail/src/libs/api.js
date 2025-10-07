import axios from 'axios'

const client = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false, // 로그인 없음
})

// 에러 메시지 일원화
client.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err?.response?.data?.message || err.message
    return Promise.reject(new Error(msg))
  }
)

export async function api(path, options = {}) {
  const res = await client.request({ url: path, method: 'get', ...options })
  return res.data
}
