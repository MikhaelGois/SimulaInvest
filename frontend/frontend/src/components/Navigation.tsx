'use client'

import Link from 'next/link'
import { useState } from 'react'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="font-bold text-xl text-blue-400">
            SimulaInvest
          </Link>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>

          <div className={`${isOpen ? 'block' : 'hidden'} md:flex gap-6 md:gap-8`}>
            <Link
              href="/"
              className="block md:inline hover:text-blue-400 transition"
            >
              Home
            </Link>
            <Link
              href="/descobrir"
              className="block md:inline hover:text-blue-400 transition"
            >
              Descobrir
            </Link>
            <Link
              href="/simulador"
              className="block md:inline hover:text-blue-400 transition"
            >
              Simulador
            </Link>
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="block md:inline hover:text-blue-400 transition"
            >
              API Docs
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
