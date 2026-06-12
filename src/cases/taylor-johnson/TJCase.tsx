import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stage, Sprite } from '../../components/animation'
import { SceneM1, SceneM2, SceneM3 } from './scenes'
import { SceneAS400toPDF, SchemaAS400 } from './scenesCase02'

const SceneTopaz    = lazy(() => import('./scenesCase03'))
const SceneSelenium = lazy(() => import('./scenesCase04'))
import { useDarkMode } from '../../hooks/useDarkMode'
import { useLenis } from '../../hooks/useLenis'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useBloomFollow } from '../../hooks/useBloomFollow'
import { useLang } from '../../i18n/LangContext'
import { CaseSection, CaseLabel, SkillTags, CaseFooterNav } from '../CaseLayout'
import './TJCase.css'

const SCENE_COMPS = { M1: SceneM1, M2: SceneM2, M3: SceneM3 } as const
const SCENE_DURS  = { M1: 10, M2: 10, M3: 10 } as const
type SceneKey = keyof typeof SCENE_COMPS

const CASE_IDS = ['case-01', 'case-02', 'case-03', 'case-04']

export default function TJCase() {
  const [active, setActive]           = useState<SceneKey>('M1')
  const { toggle: toggleDark }        = useDarkMode()
  const { lang, toggle: toggleLang, t } = useLang()
  const tc = t.cases.tj
  const [toggleAnim, setToggleAnim]   = useState(false)
  const [activeCaseIdx, setActiveCaseIdx] = useState(0)
  const caseRatios = useRef<number[]>([0, 0, 0, 0])
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
    document.title = 'Taylor & Johnson — Camilo Conde'
    document.getElementById('case-main')?.focus({ preventScroll: true })
    return () => { document.title = 'Camilo Conde — Design Engineer' }
  }, [])

  useEffect(() => {
    const thresholds = Array.from({ length: 21 }, (_, i) => i / 20)
    const observer   = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const idx = CASE_IDS.indexOf((entry.target as HTMLElement).id)
        if (idx >= 0) caseRatios.current[idx] = entry.intersectionRatio
      }
      const max = Math.max(...caseRatios.current)
      if (max > 0) setActiveCaseIdx(caseRatios.current.indexOf(max))
    }, { threshold: thresholds })

    CASE_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const SceneComp = SCENE_COMPS[active]
  const sceneDur  = SCENE_DURS[active]

  return (
    <div className="case-page case-page--tj">

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

      {/* Context */}
      <CaseSection>
        <CaseLabel num="00">Context</CaseLabel>
        <div className="case-overview-grid">
          <div className="reveal reveal-delay-1">
            <h3 className="case-section-title">{tc.context.sectionTitle}</h3>
            <p className="case-body">{tc.context.p1}</p>
            <p className="case-body">{tc.context.p2}</p>
            <p className="case-body">{tc.context.p3}</p>
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
      </CaseSection>

      {/* Cases 01–04 with sticky sidebar */}
      <div className="cases-region">
        <nav className="cases-sidebar" aria-label={tc.caseNavAriaLabel}>
          {tc.caseLabels.map((label, i) => (
            <a
              key={label}
              href={`#case-0${i + 1}`}
              className={`cases-sidebar-item${activeCaseIdx === i ? ' is-active' : ''}`}
              aria-label={`Case 0${i + 1}: ${label}`}
              aria-current={activeCaseIdx === i ? 'location' : undefined}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Case 01 — Interface Modernization */}
        <CaseSection id="case-01">
          <CaseLabel num="01">{tc.caseLabels[0]}</CaseLabel>
          <p className="case-body reveal reveal-delay-1">{tc.case01.p1}</p>
          <div className="case-stage-header reveal reveal-delay-2">
            <div className="case-scene-switcher">
              {(Object.keys(SCENE_COMPS) as SceneKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setActive(key)}
                  className={`case-scene-btn${active === key ? ' is-active' : ''}`}
                >
                  {tc.sceneLabels[key]}
                </button>
              ))}
            </div>
          </div>
          <div className="case-stage-wrap reveal reveal-delay-2">
            <Stage
              key={active}
              width={1920}
              height={1080}
              duration={sceneDur}
              background="#0A1408"
              persistKey={`presto-${active}`}
              initialTime={0}
              forcePlay={activeCaseIdx === 0}
            >
              <Sprite start={0} end={sceneDur} keepMounted={activeCaseIdx === 0}>
                <SceneComp />
              </Sprite>
            </Stage>
          </div>
          <p className="case-outcome-line reveal reveal-delay-3">{tc.case01.outcome}</p>
          <SkillTags skills={['HTML', 'CSS', 'JavaScript', 'jQuery', 'Presto']} className="reveal reveal-delay-3" />
        </CaseSection>

        {/* Case 02 — Parametric Document Generation */}
        <CaseSection id="case-02">
          <CaseLabel num="02">{tc.caseLabels[1]}</CaseLabel>
          <p className="case-body reveal reveal-delay-1">{tc.case02.p1}</p>
          <div className="case-schema-wrap reveal reveal-delay-2">
            <SchemaAS400 />
          </div>
          <p className="case-caption reveal reveal-delay-2">{tc.case02.schemaCaption}</p>
          <div className="case-stage-wrap reveal reveal-delay-3">
            <Stage
              width={1920}
              height={1080}
              duration={19.5}
              background="#0A0A14"
              persistKey="as400-pdf"
              initialTime={0}
              forcePlay={activeCaseIdx === 1}
            >
              <Sprite start={0} end={19.5} keepMounted={activeCaseIdx === 1}>
                <SceneAS400toPDF />
              </Sprite>
            </Stage>
          </div>
          <p className="case-outcome-line reveal reveal-delay-4">{tc.case02.outcome}</p>
          <SkillTags skills={['JsPDF.js', 'SQL', 'Web Services', 'AS/400']} className="reveal reveal-delay-4" />
        </CaseSection>

        {/* Case 03 — Digital Signature Integration */}
        <CaseSection id="case-03">
          <CaseLabel num="03">{tc.caseLabels[2]}</CaseLabel>
          <p className="case-body reveal reveal-delay-1">{tc.case03.p1}</p>
          <div className="case-stage-wrap reveal reveal-delay-2">
            <Stage
              width={1920}
              height={1080}
              duration={18}
              background="#0A0A0A"
              persistKey="topaz-sign"
              initialTime={0}
              forcePlay={activeCaseIdx === 2}
            >
              <Sprite start={0} end={18} keepMounted={activeCaseIdx === 2}>
                <Suspense fallback={null}>
                  <SceneTopaz />
                </Suspense>
              </Sprite>
            </Stage>
          </div>
          <p className="case-outcome-line reveal reveal-delay-3">{tc.case03.outcome}</p>
          <SkillTags skills={['Presto', 'TOPAZ LCD', 'ERP Integration']} className="reveal reveal-delay-3" />
        </CaseSection>

        {/* Case 04 — Process Automation */}
        <CaseSection id="case-04">
          <CaseLabel num="04">{tc.caseLabels[3]}</CaseLabel>
          <p className="case-body reveal reveal-delay-1">{tc.case04.p1}</p>
          <div className="case-stage-wrap reveal reveal-delay-2">
            <Stage
              width={1920}
              height={1080}
              duration={28}
              background="#0A0A0A"
              persistKey="selenium-migration"
              initialTime={0}
              forcePlay={activeCaseIdx === 3}
            >
              <Sprite start={0} end={28} keepMounted={activeCaseIdx === 3}>
                <Suspense fallback={null}>
                  <SceneSelenium />
                </Suspense>
              </Sprite>
            </Stage>
          </div>
          <p className="case-outcome-line reveal reveal-delay-3">{tc.case04.outcome}</p>
          <SkillTags skills={['Python', 'Selenium', 'Web Services']} className="reveal reveal-delay-3" />
        </CaseSection>
      </div>

      {/* Outcomes */}
      <CaseSection>
        <CaseLabel num="05">What changed</CaseLabel>
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
