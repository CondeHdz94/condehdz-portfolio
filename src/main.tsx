import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import TJCase from './cases/taylor-johnson/TJCase.tsx'
import SistelCase from './cases/sistel/SistelCase.tsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])
  return null
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/case/taylor-johnson" element={<TJCase />} />
        <Route path="/case/sistel" element={<SistelCase />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
