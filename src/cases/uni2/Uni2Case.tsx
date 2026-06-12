import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stage } from '../../components/animation'
import { useDarkMode } from '../../hooks/useDarkMode'
import { useLenis } from '../../hooks/useLenis'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useBloomFollow } from '../../hooks/useBloomFollow'
import { useLang } from '../../i18n/LangContext'
import { CaseSection, CaseLabel, SkillTags, CaseFooterNav } from '../CaseLayout'
import { Uni2SaaSReel } from './saasReel/Uni2SaaSReel'
import './Uni2Case.css'

const FSD_LAYER_NAMES = ['pages', 'processes', 'steps', 'features', 'domains', 'components'] as const
const FSD_ACTIVE      = new Set(['processes', 'steps'])

const PLATFORM_IDS = ['platform-01', 'platform-02', 'platform-03']

export default function Uni2Case() {
  const { toggle: toggleDark } = useDarkMode()
  const { lang, toggle: toggleLang, t } = useLang()
  const tc = t.cases.uni2
  const [toggleAnim, setToggleAnim]           = useState(false)
  const [activePlatformIdx, setActivePlatformIdx] = useState(0)
  const platformRatios = useRef<number[]>([0, 0, 0])
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
    document.title = 'UNI2 — Camilo Conde'
    document.getElementById('case-main')?.focus({ preventScroll: true })
    return () => { document.title = 'Camilo Conde — Design Engineer' }
  }, [])

  useEffect(() => {
    const thresholds = Array.from({ length: 21 }, (_, i) => i / 20)
    const observer   = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const idx = PLATFORM_IDS.indexOf((entry.target as HTMLElement).id)
        if (idx >= 0) platformRatios.current[idx] = entry.intersectionRatio
      }
      const max = Math.max(...platformRatios.current)
      if (max > 0) setActivePlatformIdx(platformRatios.current.indexOf(max))
    }, { threshold: thresholds })

    PLATFORM_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const { d1, d2, d3, d4, d5 } = tc.uni2lite

  return (
    <div className="case-page case-page--uni2">

      <a href="#case-main" className="case-skip-link">{t.nav.skipLink}</a>

      <div className="ambient-bloom" aria-hidden="true">
        <div className="ambient-bloom-glow" />
      </div>

      {/* Nav */}
      <header className="case-nav">
        <button onClick={handleBack} className="case-nav-back">← Camilo Conde</button>
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

      {/* 00 — Context */}
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
                <span className="case-meta-value" style={{ whiteSpace: 'pre-line' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </CaseSection>

      {/* 01 — Platform Contribution intro */}
      <CaseSection>
        <CaseLabel num="01">Platform Contribution</CaseLabel>
        <h3 className="case-section-title reveal">{tc.platform.sectionTitle}</h3>
        <p className="case-body reveal reveal-delay-1">{tc.platform.intro}</p>

        <div className="uni2-stats reveal reveal-delay-1">
          {([
            { value: '+3,140', label: tc.platform.stats.commits },
            { value: '+5,300', label: tc.platform.stats.files   },
            { value: '+470K',  label: tc.platform.stats.lines   },
          ] as const).map(s => (
            <div key={s.label} className="uni2-stats-item">
              <div className="uni2-stat-value">{s.value}</div>
              <div className="uni2-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <p className="case-body reveal reveal-delay-1">{tc.platform.p2}</p>
      </CaseSection>

      {/* Platform sub-cases — sidebar region */}
      <div className="cases-region uni2-platform-region">
        <nav className="cases-sidebar" aria-label={tc.platform.platformNavAriaLabel}>
          {tc.platform.platformLabels.map((label, i) => (
            <a
              key={label}
              href={`#platform-0${i + 1}`}
              className={`cases-sidebar-item${activePlatformIdx === i ? ' is-active' : ''}`}
              aria-current={activePlatformIdx === i ? 'location' : undefined}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* 01a — Biometric Pipeline */}
        <CaseSection id="platform-01">
          <CaseLabel num="01a">Biometric Pipeline</CaseLabel>
          <p className="case-body reveal reveal-delay-1">{tc.platform.biometric.p1}</p>
          <p className="case-body reveal reveal-delay-1">{tc.platform.biometric.p2}</p>
          <p className="case-outcome-line reveal reveal-delay-2">{tc.platform.biometric.outcome}</p>
        </CaseSection>

        {/* 01b — Modal System */}
        <CaseSection id="platform-02">
          <CaseLabel num="01b">Modal System</CaseLabel>
          <p className="case-body reveal reveal-delay-1">{tc.platform.modal.p1}</p>
          <p className="case-body reveal reveal-delay-1">{tc.platform.modal.p2}</p>
          <p className="case-outcome-line reveal reveal-delay-2">{tc.platform.modal.outcome}</p>
        </CaseSection>

        {/* 01c — Library Modernization */}
        <CaseSection id="platform-03">
          <CaseLabel num="01c">Library Modernization</CaseLabel>
          <p className="case-body reveal reveal-delay-1">{tc.platform.libraries.p1}</p>
          <p className="case-outcome-line reveal reveal-delay-2">{tc.platform.libraries.outcome}</p>
        </CaseSection>
      </div>

      {/* Platform skills */}
      <CaseSection>
        <SkillTags
          skills={['React 16', 'Redux', 'Redux-Saga', 'Material-UI', 'SCSS', 'Bootstrap', 'AWS Amplify', 'Axios', 'JWT', 'GitHub Actions', 'Docker', 'Git Flow']}
          className="reveal"
        />
      </CaseSection>

      {/* 02 — Uni2Lite */}
      <CaseSection>
        <CaseLabel num="02">Uni2Lite — Founding Engineer</CaseLabel>

        <h3 className="case-section-title reveal">{tc.uni2lite.sectionTitle}</h3>
        <p className="case-body reveal reveal-delay-1">{tc.uni2lite.p1}</p>
        <p className="case-body reveal reveal-delay-1">{tc.uni2lite.p2}</p>

        <ol className="uni2-differentiators reveal reveal-delay-2">
          <li>
            <strong>{d1.title}</strong>{' '}{d1.pre} <code>CreditApplicationFlow</code> {d1.post}
          </li>
          <li>
            <strong>{d2.title}</strong>{' '}{d2.pre} <code>FieldConfig[]</code>{d2.post}
          </li>
          <li>
            <strong>{d3.title}</strong>{' '}{d3.pre} <code>useFormStepHandler</code> {d3.mid}{' '}
            <code>registerSubmitHandler</code> {d3.ret} <code>Promise&lt;boolean&gt;</code>.{' '}
            {d3.post}
          </li>
          <li>
            <strong>{d4.title}</strong>{' '}{d4.pre}<code>/signature/:token</code>{d4.mid}{' '}
            <code>ProtectedRoute</code> {d4.suf}
          </li>
          <li>
            <strong>{d5.title}</strong>{' '}{d5.body}
          </li>
        </ol>

        <div
          className="uni2-arch reveal reveal-delay-2"
          role="img"
          aria-label={tc.uni2lite.fsdAriaLabel}
        >
          {FSD_LAYER_NAMES.map((name, i) => (
            <div key={name} className={`uni2-arch-layer${FSD_ACTIVE.has(name) ? ' uni2-arch-layer--active' : ''}`}>
              <div className="uni2-arch-layer-name">{name}</div>
              <div className="uni2-arch-layer-desc">{tc.uni2lite.fsdLayers[i]}</div>
            </div>
          ))}
        </div>
        <p className="case-caption reveal reveal-delay-2">{tc.uni2lite.fsdCaption}</p>

        {/* Animated scene · 45s SaaS reel */}
        <div className="case-stage-wrap reveal reveal-delay-3" style={{ marginTop: 48 }}>
          <Stage
            width={1920}
            height={1080}
            duration={45}
            background="#03060f"
            persistKey="uni2-saas-anim"
            initialTime={0}
          >
            <Uni2SaaSReel />
          </Stage>
        </div>
        <p className="case-caption reveal reveal-delay-3">{tc.uni2lite.animCaption}</p>

        <SkillTags
          skills={['React 18', 'TypeScript', 'Vite', 'TailwindCSS 4', 'Zustand', 'React Query', 'React Hook Form', 'Zod', 'Framer Motion', 'React Router 7', 'Axios', 'pnpm', 'Claude Code']}
          className="reveal reveal-delay-3"
        />
      </CaseSection>

      {/* 03 — Outcomes */}
      <CaseSection>
        <CaseLabel num="03">What changed</CaseLabel>
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
