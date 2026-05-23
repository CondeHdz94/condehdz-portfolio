import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Stage, Sprite } from '../../components/animation'
import { SceneM1, SceneM2, SceneM3 } from './scenes'
import { SceneAS400toPDF, SchemaAS400 } from './scenesCase02'

const SceneTopaz    = lazy(() => import('./scenesCase03'))
const SceneSelenium = lazy(() => import('./scenesCase04'))
import { useDarkMode } from '../../hooks/useDarkMode'
import { useLenis } from '../../hooks/useLenis'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { CaseSection, CaseLabel, SkillTags, CaseFooterNav } from '../CaseLayout'
import './TJCase.css'

const SCENES = [
  { key: 'M1', label: 'Formulario', comp: SceneM1, dur: 10 },
  { key: 'M2', label: 'Tabla',      comp: SceneM2, dur: 10 },
  { key: 'M3', label: 'Detalle',    comp: SceneM3, dur: 10 },
] as const

type SceneKey = typeof SCENES[number]['key']

const CASE_IDS     = ['case-01', 'case-02', 'case-03', 'case-04']
const CASE_LABELS  = ['Interface', 'Documents', 'Signature', 'Automation']

export default function TJCase() {
  const [active, setActive] = useState<SceneKey>('M1')
  const scene = SCENES.find((s) => s.key === active)!
  const { toggle: toggleDark } = useDarkMode()
  const [toggleAnim, setToggleAnim] = useState(false)
  const [activeCaseIdx, setActiveCaseIdx] = useState(0)
  const caseRatios = useRef<number[]>([0, 0, 0, 0])
  useLenis()
  useScrollReveal()

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
    const observer = new IntersectionObserver((entries) => {
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

  return (
    <div className="case-page">

      <a href="#case-main" className="case-skip-link">Skip to content</a>

      {/* Nav */}
      <header className="case-nav">
        <Link to="/" viewTransition className="case-nav-back">← Camilo Conde</Link>
        <span className="case-nav-title">Taylor &amp; Johnson · 2018–2021</span>
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
            Taylor &amp; Johnson International · Multimedia Engineer · 2018–2021
          </p>
          <h1 className="case-headline reveal reveal-delay-1">
            Bridging 40 years of COBOL banking infrastructure to the modern web.
          </h1>
          <p className="case-subhead reveal reveal-delay-2">
            A legacy 5250 green-screen core, still processing real transactions daily, modernized
            to responsive web interfaces without touching the business logic underneath.
          </p>
        </div>
      </section>

      {/* Context */}
      <CaseSection>
        <CaseLabel num="00">Context</CaseLabel>
        <div className="case-overview-grid">
          <div className="reveal reveal-delay-1">
            <h3 className="case-section-title">The system that couldn't stop.</h3>
            <p className="case-body">
              The banking core ran on IBM AS/400 hardware with 5250 terminals, a technology
              stack from the 1980s still processing transactions daily. Operators navigated
              green-screen menus with keyboard shortcuts memorized over decades. The system
              worked. That was the problem.
            </p>
            <p className="case-body">
              Replacing it wasn't viable. Instead, Fresche Solutions' Presto acted as a
              translation layer — injecting a web rendering engine between the 5250 programs
              and the browser. The COBOL logic stayed untouched. The surface was rebuilt
              from scratch.
            </p>
            <p className="case-body">
              Over the engagement, the role extended beyond implementation. For document
              processes and new integrations in particular, I became the technical reference —
              the person other team members consulted before starting anything new in that
              domain. That meant attending cross-area meetings to align on requirements and,
              on some occasions, joining client sessions directly to validate goals and
              constraints.
            </p>
          </div>
          <div className="case-meta-block reveal reveal-delay-2">
            {[
              { label: 'Company',  value: 'Taylor & Johnson International' },
              { label: 'Role',     value: 'Multimedia Engineer' },
              { label: 'Duration', value: '2 years · 11 months' },
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

      {/* Cases 01–04 with sticky sidebar */}
      <div className="cases-region">
        <nav className="cases-sidebar" aria-label="Case navigator">
          {CASE_LABELS.map((label, i) => (
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
          <CaseLabel num="01">Interface Modernization</CaseLabel>
          <p className="case-body reveal reveal-delay-1">
            Translated legacy 5250 terminal screens into responsive web UIs via Presto — every
            workflow rebuilt in HTML, JavaScript, and CSS while the COBOL business logic
            underneath stayed untouched. Operators went from memorizing keyboard shortcuts on
            green-screen menus to navigating purpose-built interfaces with proper hierarchy,
            feedback, and visual consistency.
          </p>
          <div className="case-stage-header reveal reveal-delay-2">
            <div className="case-scene-switcher">
              {SCENES.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setActive(s.key)}
                  className={`case-scene-btn${active === s.key ? ' is-active' : ''}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div className="case-stage-wrap reveal reveal-delay-2">
            <Stage
              key={active}
              width={1920}
              height={1080}
              duration={scene.dur}
              background="#0A1408"
              persistKey={`presto-${active}`}
              initialTime={0}
              forcePlay={activeCaseIdx === 0}
            >
              <Sprite start={0} end={scene.dur} keepMounted={activeCaseIdx === 0}>
                <scene.comp />
              </Sprite>
            </Stage>
          </div>
          <SkillTags skills={['HTML', 'CSS', 'JavaScript', 'jQuery', 'Presto']} className="reveal reveal-delay-3" />
        </CaseSection>

        {/* Case 02 — Parametric Document Generation */}
        <CaseSection id="case-02">
          <CaseLabel num="02">Parametric Document Generation</CaseLabel>
          <p className="case-body reveal reveal-delay-1">
            Built a document engine — jointly defined with the COBOL team — that generated
            banking documents from SQL queries and web service calls. Every parameter
            (typography, spacing, colors, logo, signature placement) was configurable from a
            table in AS/400, so any document type could be restyled without touching code.
            A client-facing layer, exposing that same control through a Presto-modernized
            interface, was in late stages of development at departure.
          </p>
          <div className="case-schema-wrap reveal reveal-delay-2">
            <SchemaAS400 />
          </div>
          <p className="case-caption reveal reveal-delay-2">Illustrative example · PDFP001 · columns and data adjusted for clarity · the actual screen was not visible to the end user</p>
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
          <SkillTags skills={['JsPDF.js', 'SQL', 'Web Services', 'AS/400']} className="reveal reveal-delay-4" />
        </CaseSection>

        {/* Case 03 — Digital Signature Integration */}
        <CaseSection id="case-03">
          <CaseLabel num="03">Digital Signature Integration</CaseLabel>
          <p className="case-body reveal reveal-delay-1">
            Integrated TOPAZ LCD signature pads directly into the Presto layer, enabling
            in-branch document signing without leaving the web interface. Once captured, the
            signature surfaced in the Presto screen and flowed into the corresponding document,
            replacing a paper-based process and anchoring signature integrity to the banking
            operation in the ERP.
          </p>
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
          <SkillTags skills={['Presto', 'TOPAZ LCD', 'ERP Integration']} className="reveal reveal-delay-3" />
        </CaseSection>

        {/* Case 04 — Process Automation */}
        <CaseSection id="case-04">
          <CaseLabel num="04">Process Automation</CaseLabel>
          <p className="case-body reveal reveal-delay-1">
            Built a Selenium-based automation to migrate records from our system into a
            third-party client's platform. The process was parameterized against a web service
            data source, allowing any batch size to be fed programmatically, replacing a
            manual, error-prone data entry operation for each client integration.
          </p>
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
          <SkillTags skills={['Python', 'Selenium', 'Web Services']} className="reveal reveal-delay-3" />
        </CaseSection>
      </div>

      {/* Outcomes */}
      <CaseSection>
        <CaseLabel num="05">Outcomes</CaseLabel>
        <ul className="case-outcomes reveal reveal-delay-1">
          <li>~40 bank operators migrated from daily green-screen sessions to web interfaces — zero retraining downtime during cutover.</li>
          <li>~200 parametric document types automated through the JsPDF engine, replacing manual drafting in AS/400.</li>
          <li>Paper-based signature workflow replaced end-to-end with TOPAZ LCD pad integration inside the Presto layer.</li>
          <li>First Selenium batch migrated legacy records ahead of schedule; subsequent runs unattended during off-hours.</li>
          <li>Fresche Presto rendering layer validated as a production path — no COBOL rewrite required, no business logic touched.</li>
        </ul>
      </CaseSection>

      {/* Animation engine note */}
      <CaseSection>
        <CaseLabel num="06">Animation Engine</CaseLabel>
        <p className="case-body reveal reveal-delay-1">
          The four scenes above run on a custom timeline engine built for this portfolio — not a
          library dependency. <code>Stage</code>, <code>Sprite</code>, <code>interpolate()</code>,
          and 20+ easing functions in 24KB of portfolio code. Frame-accurate scrubbing, declarative
          keyframe composition, and a <code>persistKey</code> mechanism that keeps scenes alive
          across sidebar switches without retriggering animations. The engine is the same kind of
          artifact as the work it demonstrates: frontend infrastructure designed to be invisible
          until you look at it.
        </p>
      </CaseSection>

      {/* Footer */}
      <footer className="case-footer">
        <CaseFooterNav />
      </footer>

    </div>
  )
}
