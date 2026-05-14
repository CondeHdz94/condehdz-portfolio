import type { ReactNode } from 'react'

export function CaseSection({ children }: { children: ReactNode }) {
  return (
    <section className="case-section">
      <div className="case-section-inner">{children}</div>
    </section>
  )
}

export function CaseLabel({ num, children }: { num: string; children: ReactNode }) {
  return (
    <p className="case-label reveal">
      <span className="case-label-num">{num}</span>
      {children}
    </p>
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
