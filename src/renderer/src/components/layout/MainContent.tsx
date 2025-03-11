import React, { FC } from 'react'

type MainContentProps = {
  children: React.ReactNode
}

export const MainContent: FC<MainContentProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-column relative flex-auto">
      <div className="pl-3 pr-3 flex flex-column flex-auto">
        <div className=" border-round flex-auto border-white-alpha-10">{children}</div>
      </div>
    </div>
  )
}
