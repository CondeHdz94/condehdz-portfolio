import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Stage } from '../../components/animation'
import { useDarkMode } from '../../hooks/useDarkMode'
import { useLenis } from '../../hooks/useLenis'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { CaseSection, CaseLabel, SkillTags } from '../CaseLayout'
import { SceneSistel, type GuideStyle } from './sceneSistel'
import './SistelCase.css'

const PALETTES = [
  { primary: '#E63946', accent: '#1D3557', label: 'Rojo · Navy' },
  { primary: '#2E3FFF', accent: '#0F172A', label: 'Azul · Ink' },
  { primary: '#FF6033', accent: '#26303A', label: 'Coral · Carbón' },
  { primary: '#00B894', accent: '#16302C', label: 'Mint · Verde' },
  { primary: '#7A5AE0', accent: '#2B1F18', label: 'Violeta · Chocolate' },
  { primary: '#F4B400', accent: '#1F2438', label: 'Ámbar · Medianoche' },
]

const GUIDE_OPTIONS: { value: GuideStyle; label: string }[] = [
  { value: 'geometric', label: 'Geometric' },
  { value: 'riso',      label: 'Riso' },
  { value: 'line',      label: 'Line' },
  { value: 'mascot',    label: 'Mascot' },
]

const WORKFLOW_STEPS = [
  {
    num: '01',
    label: 'Source Script',
    items: ['Client brief & objectives', 'Domain expert content', 'Slide-by-slide material'],
  },
  {
    num: '02',
    label: 'Analysis',
    items: ['Decision point mapping', 'Interaction opportunities', 'Branching architecture'],
  },
  {
    num: '03',
    label: 'Interactive Module',
    items: ['UX/UI visual design', 'Animated feedback', 'Branching scenarios'],
  },
]

function WorkflowDiagram() {
  return (
    <div className="sistel-workflow" role="img" aria-label="Design pipeline: source script to interactive module">
      {WORKFLOW_STEPS.map(({ num, label, items }, i) => (
        <Fragment key={num}>
          <div className="sistel-workflow-step">
            <span className="sistel-workflow-num">{num}</span>
            <span className="sistel-workflow-label">{label}</span>
            <ul className="sistel-workflow-items">
              {items.map(item => <li key={item}>{item}</li>)}
            </ul>
          </div>
          {i < WORKFLOW_STEPS.length - 1 && (
            <span className="sistel-workflow-sep" aria-hidden="true">→</span>
          )}
        </Fragment>
      ))}
    </div>
  )
}


export default function SistelCase() {
  const { toggle: toggleDark } = useDarkMode()
  const [toggleAnim, setToggleAnim] = useState(false)
  const [paletteIdx, setPaletteIdx] = useState(0)
  const [guide, setGuide] = useState<GuideStyle>('geometric')
  useLenis()
  useScrollReveal()

  const handleThemeToggle = () => {
    toggleDark()
    setToggleAnim(true)
    setTimeout(() => setToggleAnim(false), 420)
  }

  useEffect(() => {
    document.getElementById('case-main')?.focus({ preventScroll: true })
  }, [])

  return (
    <div className="case-page case-page--sistel">

      <a href="#case-main" className="case-skip-link">Skip to content</a>

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
      <section id="case-main" tabIndex={-1} className="case-hero">
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
        <div className="case-schema-wrap reveal reveal-delay-2" style={{ marginTop: 48 }}>
          <WorkflowDiagram />
        </div>
        <p className="case-caption reveal reveal-delay-2">Design pipeline · from source script to published interactive module</p>
        <div className="case-stage-wrap reveal reveal-delay-3" style={{ marginTop: 48 }}>
          <Stage
            width={1920}
            height={1080}
            duration={28}
            background="#F8F3E6"
            persistKey="sistel-anim"
            initialTime={0}
          >
            <SceneSistel
              primary={PALETTES[paletteIdx].primary}
              accent={PALETTES[paletteIdx].accent}
              guide={guide}
            />
          </Stage>
        </div>

        <div className="sistel-tweaks reveal reveal-delay-3">
          <div className="sistel-tweaks-group">
            <span className="sistel-tweaks-label">Brand color</span>
            <div className="sistel-tweaks-palettes" role="group" aria-label="Brand color palette">
              {PALETTES.map((p, i) => (
                <button
                  key={i}
                  className={`sistel-palette-swatch${paletteIdx === i ? ' is-active' : ''}`}
                  style={{ '--sw-p': p.primary, '--sw-a': p.accent } as React.CSSProperties}
                  onClick={() => setPaletteIdx(i)}
                  aria-label={p.label}
                  aria-pressed={paletteIdx === i}
                />
              ))}
            </div>
          </div>
          <div className="sistel-tweaks-sep" aria-hidden="true" />
          <div className="sistel-tweaks-group">
            <span className="sistel-tweaks-label">Character style</span>
            <div className="sistel-tweaks-guides" role="group" aria-label="Character style">
              {GUIDE_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  className={`sistel-guide-btn${guide === value ? ' is-active' : ''}`}
                  onClick={() => setGuide(value)}
                  aria-pressed={guide === value}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
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
