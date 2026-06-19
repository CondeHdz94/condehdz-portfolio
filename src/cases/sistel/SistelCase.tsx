import { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stage } from '../../components/animation'
import { useDarkMode } from '../../hooks/useDarkMode'
import { useLenis } from '../../hooks/useLenis'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useBloomFollow } from '../../hooks/useBloomFollow'
import { useLang } from '../../i18n/LangContext'
import { CaseSection, CaseLabel, SkillTags, CaseFooterNav } from '../CaseLayout'
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

const GUIDE_VALUES: GuideStyle[] = ['geometric', 'riso', 'line', 'mascot']

const CLIENTS = {
  intl:     ['Unilever', 'J&J', 'Nutresa', 'Procaps', 'Syngenta'],
  regional: ['Emcali', 'Comfandi', 'Totto', 'G&F', 'Uninorte', 'B-Secure', 'Interdinco', 'Manpower', 'Johnson Controls'],
}

export default function SistelCase() {
  const { toggle: toggleDark }          = useDarkMode()
  const { lang, toggle: toggleLang, t } = useLang()
  const tc = t.cases.sistel
  const [toggleAnim, setToggleAnim] = useState(false)
  const [paletteIdx, setPaletteIdx] = useState(0)
  const [guide, setGuide]           = useState<GuideStyle>('geometric')
  const navigate   = useNavigate()
  const handleBack = () => navigate('/', { viewTransition: true })
  useLenis()
  useScrollReveal()
  useBloomFollow()

  const handleThemeToggle = () => {
    toggleDark()
    setToggleAnim(true)
    setTimeout(() => setToggleAnim(false), 420)
  }

  useEffect(() => {
    document.title = 'Sistel — Camilo Conde'
    document.getElementById('case-main')?.focus({ preventScroll: true })
    return () => { document.title = 'Camilo Conde — Design Engineer' }
  }, [])

  const workflowSteps = [
    tc.workflow.step1,
    tc.workflow.step2,
    tc.workflow.step3,
  ]

  return (
    <div className="case-page case-page--sistel">

      <a href="#case-main" className="case-skip-link">{t.nav.skipLink}</a>

      <div className="ambient-bloom" aria-hidden="true">
        <div className="ambient-bloom-glow" />
      </div>

      {/* Nav */}
      <header className="case-nav">
        <button onClick={handleBack} className="case-nav-back"><span className="case-nav-arrow" aria-hidden="true">←</span>Camilo Conde</button>
        <span className="case-nav-title">{tc.navTitle}</span>
        <div className="nav-actions">
          <button className="lang-toggle" onClick={toggleLang} aria-label={t.nav.toggleLang}>
            {lang === 'en' ? 'ES' : 'EN'}
          </button>
          <button
            className="theme-toggle"
            onClick={handleThemeToggle}
            aria-label={t.nav.toggleTheme}
          >
            <span className={`toggle-icon${toggleAnim ? ' is-spinning' : ''}`} aria-hidden="true">●</span>
          </button>
        </div>
      </header>

      {/* Hero */}
      <section id="case-main" tabIndex={-1} className="case-hero">
        <div className="case-hero-inner">
          <p className="case-eyebrow reveal">{tc.eyebrow}</p>
          <h1 className="case-headline reveal reveal-delay-1">{tc.headline}</h1>
          <p className="case-subhead reveal reveal-delay-2">{tc.subhead}</p>
        </div>
      </section>

      {/* 00 Context */}
      <CaseSection>
        <CaseLabel num="00">Context</CaseLabel>
        <div className="case-overview-grid">
          <div className="reveal reveal-delay-1">
            <h3 className="case-section-title">{tc.context.sectionTitle}</h3>
            <p className="case-body">{tc.context.p1}</p>
            <p className="case-body">{tc.context.p2}</p>
          </div>
          <div className="case-meta-block reveal reveal-delay-2">
            {[
              { label: t.meta.company,  value: tc.context.company  },
              { label: t.meta.role,     value: tc.context.role     },
              { label: t.meta.duration, value: tc.context.duration },
              { label: t.meta.location, value: tc.context.location },
            ].map(({ label, value }) => (
              <div key={label} className="case-meta-item">
                <span className="case-meta-label">{label}</span>
                <span className="case-meta-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="sistel-stats reveal reveal-delay-1">
          <div className="sistel-stats-item">
            <div className="sistel-stat-value">15+</div>
            <div className="sistel-stat-label">{tc.stats.modules}</div>
          </div>
          <div className="sistel-stats-item">
            <div className="sistel-stat-value">14</div>
            <div className="sistel-stat-label">{tc.stats.clients}</div>
          </div>
          <div className="sistel-stats-item">
            <div className="sistel-stat-value">18mo</div>
            <div className="sistel-stat-label">{tc.stats.window}</div>
          </div>
        </div>
        <div className="sistel-clients reveal reveal-delay-2">
          <div className="sistel-clients-group sistel-clients-group--intl">
            <span className="sistel-clients-label">{tc.clientsIntlLabel}</span>
            <div className="sistel-clients-list">
              {CLIENTS.intl.map(c => <span key={c} className="sistel-client-chip">{c}</span>)}
            </div>
          </div>
          <div className="sistel-clients-group">
            <span className="sistel-clients-label">{tc.clientsRegionalLabel}</span>
            <div className="sistel-clients-list">
              {CLIENTS.regional.map(c => <span key={c} className="sistel-client-chip">{c}</span>)}
            </div>
          </div>
        </div>
      </CaseSection>

      {/* 01 From Script to Interaction */}
      <CaseSection>
        <CaseLabel num="01">From Script to Interaction</CaseLabel>
        <p className="case-body reveal reveal-delay-1">{tc.script.p1}</p>
        <p className="case-body reveal reveal-delay-1">{tc.script.p2}</p>
        <div className="case-schema-wrap reveal reveal-delay-2" style={{ marginTop: 48 }}>
          <div className="sistel-workflow" role="img" aria-label={tc.workflowAriaLabel}>
            {workflowSteps.map((step, i) => (
              <Fragment key={step.label}>
                <div className="sistel-workflow-step">
                  <span className="sistel-workflow-num">0{i + 1}</span>
                  <span className="sistel-workflow-label">{step.label}</span>
                  <ul className="sistel-workflow-items">
                    {step.items.map(item => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                {i < workflowSteps.length - 1 && (
                  <span className="sistel-workflow-sep" aria-hidden="true">→</span>
                )}
              </Fragment>
            ))}
          </div>
        </div>
        <p className="case-caption reveal reveal-delay-2">{tc.script.pipelineCaption}</p>
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

        <p className="case-caption reveal reveal-delay-3" style={{ marginTop: 32 }}>
          {tc.script.animCaption}
        </p>
        <div className="sistel-tweaks reveal reveal-delay-3">
          <div className="sistel-tweaks-group">
            <span className="sistel-tweaks-label">{tc.controls.brandColor}</span>
            <div className="sistel-tweaks-palettes" role="group" aria-label={tc.controls.brandColorAria}>
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
            <span className="sistel-tweaks-label">{tc.controls.characterStyle}</span>
            <div className="sistel-tweaks-guides" role="group" aria-label={tc.controls.characterStyle}>
              {GUIDE_VALUES.map((value) => (
                <button
                  key={value}
                  className={`sistel-guide-btn${guide === value ? ' is-active' : ''}`}
                  onClick={() => setGuide(value)}
                  aria-pressed={guide === value}
                >
                  {tc.controls.guides[value]}
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

      {/* Outcomes */}
      <CaseSection>
        <CaseLabel num="02">What changed</CaseLabel>
        <ul className="case-outcomes reveal reveal-delay-1">
          {tc.outcomes.items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
        <p className="case-body reveal reveal-delay-2">{tc.outcomes.closing}</p>
      </CaseSection>

      {/* Footer */}
      <footer className="case-footer">
        <CaseFooterNav />
      </footer>

    </div>
  )
}
