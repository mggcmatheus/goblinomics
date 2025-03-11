import 'primereact/resources/themes/viva-dark/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import './global.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRouter from './router'
import { Layout } from '@renderer/components/layout/Layout'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Layout>
      <AppRouter />
    </Layout>
  </React.StrictMode>
)
