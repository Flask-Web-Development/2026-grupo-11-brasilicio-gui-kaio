'use client'

import { useState } from 'react'

const NAV_LINKS = [
  { label: 'Início', href: '/' },
  { label: 'Posts', href: '/blog' },
  { label: 'WIP', href: '#' },
  { label: 'Sobre', href: '#' },
  { label: 'Login', href: '/auth' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="relative h-full bg-[#0B3D2E]">
      <div className="grid grid-cols-3 px-2 sm:px-6 h-full w-full items-center place-content-center">
        {/* Logo + título */}
        <div className="flex items-center h-full gap-3 col-span-2">
          <a href="#" className='min-w-12'>
            <img
              src="https://ead.ifrn.edu.br/portal/wp-content/uploads/2023/02/ifrn-logo.png"
              alt="Logo Instituto Federal do Pará"
              className="size-12 rounded-xl bg-white p-1 shadow-md hover:bg-gray-200 transition-colors"
            />
          </a>
          <div className="flex flex-col leading-none">
            <span className="cursor-default text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4A017]">
              Instituto Federal do Rio Grande do Norte
            </span>
            <h1 className="cursor-default mt-1 text-lg font-semibold tracking-tight text-white sm:text-2xl">
              Blog IF-PAR
            </h1>
          </div>
        </div>

        <nav className="hidden items-center justify-end gap-5 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-semibold text-emerald-100/80 transition-colors hover:text-[#D4A017]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 justify-end">
          <button
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex rounded-full p-2 text-white transition-colors hover:bg-white/10 md:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-6">
              {menuOpen ? (
                <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <nav className="flex flex-col border-t border-white/10 bg-[#0B3D2E] px-4 py-3 md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-emerald-100/80 hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}

    </header>
  )
}