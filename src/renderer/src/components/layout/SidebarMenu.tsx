import { Ripple } from 'primereact/ripple'
import { FC, useRef, useState } from 'react'

type SidebarMenuItemProps = {
  title: string
  icon: string
  items?: { icon: string; label: string }[]
}

export const SidebarMenu: FC = () => {
  return (
    <div className="overflow-y-auto">
      <ul className="list-none p-3 m-0">
        <SidebarMenuItem title="Dashboard" icon="pi pi-home" />
        <SidebarMenuItem
          title="Cadastros"
          icon="pi pi-chevron-down"
          items={[
            { icon: 'pi pi-folder', label: 'Ações' },
            { icon: 'pi pi-folder', label: 'Fundos' },
            { icon: 'pi pi-folder', label: 'BDRs' }
          ]}
        />
      </ul>
    </div>
  )
}

export const SidebarMenuItem: FC<SidebarMenuItemProps> = ({ title, icon, items }) => {
  const [isOpen, setIsOpen] = useState(false)
  const contentRef = useRef<HTMLUListElement>(null)

  const toggleMenu = (): void => {
    setIsOpen((prev) => !prev)
  }

  if (!items || items.length === 0) {
    return (
      <li>
        <a
          className="p-ripple p-3 flex align-items-center text-gray-300 cursor-pointer hover:bg-bluegray-700 transition-duration-150 transition-colors"
          style={{ borderRadius: '30px' }}
        >
          <i className={`${icon} mr-2`}></i>
          <span className="font-medium">{title}</span>
          <Ripple />
        </a>
      </li>
    )
  }

  return (
    <li>
      <div
        className="p-ripple p-3 flex align-items-center justify-content-between text-gray-300 cursor-pointer"
        onClick={toggleMenu}
      >
        <span className="font-medium">{title}</span>
        <i className={`${icon} transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
        <Ripple />
      </div>
      <ul
        ref={contentRef}
        className={`list-none p-0 m-0 overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        {items.map((item, index) => (
          <SidebarSubMenuItem key={index} {...item} />
        ))}
      </ul>
    </li>
  )
}

type SidebarSubMenuItemProps = {
  icon: string
  label: string
}

export const SidebarSubMenuItem: FC<SidebarSubMenuItemProps> = ({ icon, label }) => {
  return (
    <li>
      <a
        className="p-ripple flex align-items-center cursor-pointer p-3 text-gray-300 hover:bg-bluegray-700 transition-duration-150 transition-colors"
        style={{ borderRadius: '30px' }}
      >
        <i className={`${icon} mr-2`}></i>
        <span className="font-medium">{label}</span>
        <Ripple />
      </a>
    </li>
  )
}
