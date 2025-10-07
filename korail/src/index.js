import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './global.css'  // ✅ 전역 스타일 불러오기
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
