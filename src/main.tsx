import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import TJCase from './cases/taylor-johnson/TJCase.tsx'
import SistelCase from './cases/sistel/SistelCase.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/case/taylor-johnson" element={<TJCase />} />
        <Route path="/case/sistel" element={<SistelCase />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
