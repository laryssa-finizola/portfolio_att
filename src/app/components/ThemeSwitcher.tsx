'use client'

import { useTheme } from 'next-themes'
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if(!mounted) return null

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-full bg-gray-detail dark:bg-gray-dark-detail text-text-light dark:text-text-dark"
    >
      {theme === 'dark' ? (
        <SunIcon className="h-5 w-5 text-lavender" />
      ) : (
        <MoonIcon className="h-5 w-5 text-lavender" />
      )}
    </button>
  )
}