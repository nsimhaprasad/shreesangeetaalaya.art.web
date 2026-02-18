import { useCallback, useEffect, useState } from 'react'

const THEME_KEY = 'ssa-theme'

const getSystemTheme = () => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const getStoredTheme = () => {
  if (typeof window === 'undefined') return null
  const value = window.localStorage.getItem(THEME_KEY)
  return value === 'light' || value === 'dark' ? value : null
}

export default function useTheme() {
  const [theme, setTheme] = useState(() => getStoredTheme() || getSystemTheme())

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.style.colorScheme = theme
    window.localStorage.setItem(THEME_KEY, theme)

    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#0f1729' : '#f5ede1')
    }
  }, [theme])

  useEffect(() => {
    if (getStoredTheme()) return undefined

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (event) => setTheme(event.matches ? 'dark' : 'light')

    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, setTheme, toggleTheme }
}
