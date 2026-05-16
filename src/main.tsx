import { StrictMode, useEffect, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

const TJCase    = lazy(() => import('./cases/taylor-johnson/TJCase.tsx'))
const SistelCase = lazy(() => import('./cases/sistel/SistelCase.tsx'))

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
        <Route path="/case/taylor-johnson" element={<Suspense fallback={null}><TJCase /></Suspense>} />
        <Route path="/case/sistel" element={<Suspense fallback={null}><SistelCase /></Suspense>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
