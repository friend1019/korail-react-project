import Menu from 'components/Menu'
import { Outlet, useLocation } from 'react-router-dom'
import 'styles/Layout.css'

export default function Layout() {
  const location = useLocation()
  const isMapPage = location.pathname.startsWith('/map')

  return (
    <div className="app-shell">
      <main className={`app-content${isMapPage ? ' app-content--full' : ''}`}>
        <Outlet />
      </main>
      <Menu />
    </div>
  )
}
