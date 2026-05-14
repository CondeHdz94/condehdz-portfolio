import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDarkMode } from '../../hooks/useDarkMode'
import { useLenis } from '../../hooks/useLenis'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { CaseSection, CaseLabel, SkillTags } from '../CaseLayout'
import './SistelCase.css'

export default function SistelCase() {
  const { toggle: toggleDark } = useDarkMode()
  const [toggleAnim, setToggleAnim] = useState(false)
  useLenis()
  useScrollReveal()

  const handleThemeToggle = () => {
    toggleDark()
    setToggleAnim(true)
    setTimeout(() => setToggleAnim(false), 420)
  }

  return (
    <div className="case-page case-page--sistel">

      {/* Nav */}
      <header className="case-nav">
        <Link to="/" viewTransition className="case-nav-back">← Camilo Conde</Link>
        <span className="case-nav-title">Sistel · 2017–2018</span>
        <button
          className="theme-toggle"
          onClick={handleThemeToggle}
          aria-label="Toggle dark mode"
        >
          <span className={`toggle-icon${toggleAnim ? ' is-spinning' : ''}`} aria-hidden="true">●</span>
        </button>
      </header>

      {/* Hero */}
      <section className="case-hero">
        <div className="case-hero-inner">
          <p className="case-eyebrow reveal">
            Sistel Ltda. · Web Course Developer · 2017–2018
          </p>
          <h1 className="case-headline reveal reveal-delay-1">
            Turning training scripts into interactive learning experiences.
          </h1>
          <p className="case-subhead reveal reveal-delay-2">
            Corporate knowledge that lived in slide decks and procedure manuals — rebuilt as
            HTML5 modules with branching scenarios, animated feedback, and visual design
            calibrated to how adults actually learn.
          </p>
        </div>
      </section>

      {/* 00 Context */}
      <CaseSection>
        <CaseLabel num="00">Context</CaseLabel>
        <div className="case-overview-grid">
          <div className="reveal reveal-delay-1">
            <h2 className="case-section-title">When the content exists but the experience doesn't.</h2>
            <p className="case-body">
              Corporate training at Sistel always started the same way: subject matter experts
              with deep domain knowledge, and a slide deck — or a Word document — to show for it.
              The brief was well-intentioned: here's the content, make it a course. The gap between
              that and something a learner would actually complete was the design problem.
            </p>
            <p className="case-body">
              Working with Articulate Storyline, Flash, and HTML5, each course was rebuilt from
              script to published module — storyboard first, then interaction design, then the
              visual layer. The goal wasn't to digitize a presentation: it was to turn passive
              content into active decisions, using andragogy principles to structure pacing and
              ludic design to drive engagement.
            </p>
          </div>
          <div className="case-meta-block reveal reveal-delay-2">
            {[
              { label: 'Company',  value: 'Sistel Ltda.' },
              { label: 'Role',     value: 'Web Course Developer' },
              { label: 'Duration', value: '1 year · 5 months' },
              { label: 'Location', value: 'Cali, Colombia' },
            ].map(({ label, value }) => (
              <div key={label} className="case-meta-item">
                <span className="case-meta-label">{label}</span>
                <span className="case-meta-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </CaseSection>

      {/* 01 From Script to Interaction */}
      <CaseSection>
        <CaseLabel num="01">From Script to Interaction</CaseLabel>
        <p className="case-body reveal reveal-delay-1">
          Every course started as a content brief — objectives, procedures, regulations —
          formatted for a classroom or a static presentation. The design process reversed the
          delivery: identify the decisions the learner needs to make, then build interactions
          around those decision points. A regulatory compliance module became a branching scenario.
          A product training became a guided simulation. What was passive became active.
        </p>
        <p className="case-body reveal reveal-delay-1">
          Articulate Storyline handled branching logic and state tracking; HTML5 and CSS extended
          the visual layer with custom animations beyond what the platform alone could produce.
          Ludic design principles — progression, feedback loops, small wins — were embedded in
          the structure from the storyboard stage, not applied at the end.
        </p>
        <div className="case-placeholder reveal reveal-delay-2" style={{ marginTop: 48 }}>
          <span className="case-placeholder-label">Animation — Script to Interaction</span>
        </div>
        <SkillTags
          skills={['HTML5', 'CSS', 'JavaScript', 'Articulate Storyline', 'Flash', 'UX Design', 'Storyboarding']}
          className="reveal reveal-delay-3"
        />
      </CaseSection>

      {/* Footer */}
      <footer className="case-footer">
        <Link to="/" viewTransition className="case-footer-back">← Back to CV</Link>
      </footer>

    </div>
  )
}
