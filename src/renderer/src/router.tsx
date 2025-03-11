import { HashRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/login'
import { ReactNode } from 'react'
import DashboardPage from '@renderer/pages/dashboard'

const AppRouter = (): ReactNode => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </HashRouter>
  )
}

export default AppRouter
