import { useState } from 'react'
import { CATEGORIES, SKILLS } from '../content/skills'
import { SkillIcon } from './SkillIcon'

export function SkillsLedger() {
  const [activeId, setActiveId] = useState<string | null>(null)

  const hoveredSkill = activeId ? (SKILLS.find(s => s.id === activeId) ?? null) : null

  const grouped = CATEGORIES.map((cat, i) => ({
    ...cat,
    num: String(i + 1).padStart(2, '0'),
    items: SKILLS.filter(s => s.cat === cat.id),
  }))

  return (
    <div className="ledger">
      {grouped.map((group, gi) => {
        const activeNote = hoveredSkill?.cat === group.id ? hoveredSkill : null
        return (
          <section
            key={group.id}
            className="ledger-group reveal"
            style={{ transitionDelay: `${0.06 + gi * 0.06}s` }}
          >
            <header className="ledger-group-head">
              <span className="ledger-group-num">{group.num}</span>
              <h3 className="ledger-group-title">{group.title}</h3>
              <p className="ledger-group-hint">{group.hint}</p>
            </header>

            <div className="ledger-body">
              <div className="ledger-chips">
                {group.items.map((skill, si) => (
                  <button
                    key={skill.id}
                    type="button"
                    className="ledger-chip"
                    data-tier={skill.tier}
                    style={{ animationDelay: `${150 + si * 35}ms` }}
                    aria-label={`${skill.name}, ${skill.years} años`}
                    onMouseEnter={() => setActiveId(skill.id)}
                    onMouseLeave={() => setActiveId(null)}
                    onFocus={() => setActiveId(skill.id)}
                    onBlur={() => setActiveId(null)}
                  >
                    <SkillIcon name={skill.icon} size={14} />
                    <span>{skill.name}</span>
                    <span className="ledger-chip-years">{skill.years}y</span>
                  </button>
                ))}
              </div>

              <div
                className={`ledger-note-slot${activeNote ? '' : ' is-idle'}`}
                aria-live="polite"
                aria-atomic="true"
              >
                {activeNote && (
                  <>
                    <span className="ledger-note-name">{activeNote.name}</span>
                    <span className="ledger-note-sep">·</span>
                    <span className="ledger-note-text">{activeNote.note}</span>
                  </>
                )}
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}
