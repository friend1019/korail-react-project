import { NavLink } from 'react-router-dom'
import 'styles/Menu.css'
import { Home, BookOpen, PhoneCall, Map, Settings } from 'lucide-react'

export default function Menu() {
  return (
    <nav className="bottom-menu">
      <NavLink to="/" end className="menu-item">
        <Home size={22} />
        <span>홈</span>
      </NavLink>

      <NavLink to="/manual" className="menu-item">
        <BookOpen size={22} />
        <span>매뉴얼</span>
      </NavLink>

      <NavLink to="/report" className="menu-item report">
        <PhoneCall size={24} />
        <span>119 신고</span>
      </NavLink>

      <NavLink to="/map" className="menu-item">
        <Map size={22} />
        <span>지도</span>
      </NavLink>

      <NavLink to="/settings" className="menu-item">
        <Settings size={22} />
        <span>설정</span>
      </NavLink>
    </nav>
  )
}
