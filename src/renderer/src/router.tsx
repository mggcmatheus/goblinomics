import { HashRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/login'
import { FC } from 'react'
import DashboardPage from '@renderer/pages/dashboard'
import StockIndexPage from '@renderer/pages/registration/stock'

const AppRouter: FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/registration/stocks" element={<StockIndexPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </HashRouter>
  )
}

export default AppRouter
