import { useState, useEffect } from 'react'

const LS_KEY = 'theme'

function readPreference(): boolean {
  try {
    const stored = localStorage.getItem(LS_KEY)
    if (stored !== null) return stored === 'dark'
  } catch {}
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function useDarkMode() {
  const [dark, setDark] = useState(readPreference)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try { localStorage.setItem(LS_KEY, dark ? 'dark' : 'light') } catch {}
  }, [dark])

  const toggle = () => {
    document.documentElement.classList.add('dark-transitioning')
    setTimeout(() => document.documentElement.classList.remove('dark-transitioning'), 420)
    setDark(d => !d)
  }

  return { dark, toggle }
}
