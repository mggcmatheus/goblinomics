import { HashRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/login'
import { ReactNode } from 'react'

const AppRouter = (): ReactNode => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </HashRouter>
  )
}

export default AppRouter
