'use client'

import { useState } from 'react'

const MENU_ITEMS = [
  {
    label: 'Início',
    href: '#',
    icon: (
      <path d="M3 11.5 12 4l9 7.5M5 10v10h5v-6h4v6h5V10" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    label: 'Artigos',
    href: '#',
    icon: (
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h9L20 8.5V18.5A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5v-13ZM14 4v4.5H18.5M8 12h8M8 15.5h8" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    label: 'Categorias',
    href: '#',
    icon: (
      <path d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    label: 'Sobre',
    href: '#',
    icon: (
      <path d="M12 2 2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
]

export default function TabBar() {
  const [active, setActive] = useState(0)

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 bg-[#0B3D2E]"
      aria-label="Submenu"
    >
      {MENU_ITEMS.map((item, i) => {
        const isActive = active === i
        return (
          <a
            key={item.label}
            href={item.href}
            onClick={() => setActive(i)}
            className="flex flex-col items-center justify-center gap-1 py-2.5 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={isActive ? 2.2 : 1.8}
              className={`size-5 transition-colors ${
                isActive ? 'text-[#D4A017]' : 'text-emerald-100/60'
              }`}
            >
              {item.icon}
            </svg>
            <span
              className={`text-[11px] font-medium transition-colors ${
                isActive ? 'text-[#D4A017]' : 'text-emerald-100/60'
              }`}
            >
              {item.label}
            </span>
          </a>
        )
      })}
    </nav>
  )
}