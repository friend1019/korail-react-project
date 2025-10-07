import Menu from 'components/Menu'
import { Outlet } from 'react-router-dom'
import 'styles/Layout.css'

export default function Layout() {
  return (
    <div className="app-shell">
      <main className="app-content">
        <Outlet />
      </main>
      <Menu />
    </div>
  )
}
