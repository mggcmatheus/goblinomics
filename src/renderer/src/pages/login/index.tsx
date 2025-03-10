import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

const LoginPage = (): ReactNode => {
  return (
    <div>
      <h1>Login</h1>
      <Link to="/dashboard">Entrar</Link>
    </div>
  )
}

export default LoginPage
