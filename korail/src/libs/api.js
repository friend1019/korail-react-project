import axios from 'axios'

const baseURL = process.env.REACT_APP_API_BASE_URL?.trim()

if (!baseURL) {
  console.warn('API base URL가 설정되지 않았습니다. .env 파일을 확인하세요.')
}

const client = axios.create({
  baseURL: baseURL || undefined,
  withCredentials: false, // 로그인 없음
  timeout: 10000,
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
