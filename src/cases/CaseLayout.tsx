import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getCaseNav } from './cases.config'

export function CaseSection({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <section id={id} className="case-section">
      <div className="case-section-inner">{children}</div>
    </section>
  )
}

export function CaseLabel({ num, children }: { num: string; children: ReactNode }) {
  return (
    <h2 className="case-label reveal">
      <span className="case-label-num">{num}</span>
      {children}
    </h2>
  )
}

export function SkillTags({ skills, className }: { skills: string[]; className?: string }) {
  return (
    <div className={`case-skill-tags${className ? ` ${className}` : ''}`}>
      {skills.map((s) => (
        <span key={s} className="case-skill-tag">{s}</span>
      ))}
    </div>
  )
}

export function CaseFooterNav() {
  const { pathname } = useLocation()
  const { prev, next } = getCaseNav(pathname)
  return (
    <nav className="case-footer-nav">
      <div>
        {prev && (
          <Link to={prev.path} viewTransition className="case-footer-nav-link case-footer-nav-link--prev">
            ← {prev.title}
          </Link>
        )}
      </div>
      <div>
        {next && (
          <Link to={next.path} viewTransition className="case-footer-nav-link case-footer-nav-link--next">
            {next.title} →
          </Link>
        )}
      </div>
    </nav>
  )
}
