import { MainContent } from '@renderer/components/layout/MainContent'
import React, { FC } from 'react'
import { Sidebar } from '@renderer/components/layout/Sidebar'

type LayoutProps = {
  children: React.ReactNode
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div
      className="min-h-screen flex relative lg:static"
      style={{
        backgroundImage: 'linear-gradient(60deg, #29323c 0%, #485563 100%)',
        margin: 0,
        padding: 0
      }}
    >
      <Sidebar />
      <MainContent>{children}</MainContent>
    </div>
  )
}
