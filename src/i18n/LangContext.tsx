import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Lang, Translations } from './types'
import { en } from './en'
import { es } from './es'

const TRANSLATIONS: Record<Lang, Translations> = { en, es }
const LS_KEY = 'lang'

function readLang(): Lang {
  try {
    const stored = localStorage.getItem(LS_KEY)
    if (stored === 'en' || stored === 'es') return stored
  } catch {}
  return navigator.language.startsWith('es') ? 'es' : 'en'
}

interface LangContextValue {
  lang:   Lang
  toggle: () => void
  t:      Translations
}

const LangContext = createContext<LangContextValue | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(readLang)

  useEffect(() => {
    try { localStorage.setItem(LS_KEY, lang) } catch {}
    document.documentElement.lang = lang
  }, [lang])

  const toggle = () => setLang(l => l === 'en' ? 'es' : 'en')

  return (
    <LangContext.Provider value={{ lang, toggle, t: TRANSLATIONS[lang] }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}
