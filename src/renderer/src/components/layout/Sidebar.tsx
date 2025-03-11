import { SidebarHeader } from '@renderer/components/layout/SidebarHeader'
import { SidebarMenu } from '@renderer/components/layout/SidebarMenu'
import { FC } from 'react'

export const Sidebar: FC = () => {
  return (
    <div
      className="h-screen hidden lg:block flex-shrink-0 absolute lg:static left-0 top-0 z-1 border-right-1 select-none animation-duration-300 animation-ease-in-out border-white-alpha-10"
      style={{
        width: '280px',
        backgroundImage: 'linear-gradient(60deg, #29323c 0%, #2f3844 100%)'
      }}
    >
      <div className="flex flex-column h-full">
        <SidebarHeader />
        <SidebarMenu />
      </div>
    </div>
  )
}
