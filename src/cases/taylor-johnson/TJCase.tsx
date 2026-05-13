import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Stage, Sprite } from '../../components/animation'
import { SceneM1, SceneM2, SceneM3 } from './scenes'
import { SceneAS400toPDF, SchemaAS400 } from './scenesCase02'
import { SceneTopaz } from './scenesCase03'
import { SceneSelenium } from './scenesCase04'
import { useDarkMode } from '../../hooks/useDarkMode'
import { useLenis } from '../../hooks/useLenis'
import './TJCase.css'

const SCENES = [
  { key: 'M1', label: 'Formulario', comp: SceneM1, dur: 10 },
  { key: 'M2', label: 'Tabla',      comp: SceneM2, dur: 10 },
  { key: 'M3', label: 'Detalle',    comp: SceneM3, dur: 10 },
] as const

type SceneKey = typeof SCENES[number]['key']

function CaseSection({ children }: { children: ReactNode }) {
  return (
    <section className="case-section">
      <div className="case-section-inner">
        {children}
      </div>
    </section>
  )
}

function CaseLabel({ num, children }: { num: string; children: ReactNode }) {
  return (
    <p className="case-label">
      <span className="case-label-num">{num}</span>
      {children}
    </p>
  )
}

function SkillTags({ skills }: { skills: string[] }) {
  return (
    <div className="case-skill-tags">
      {skills.map((s) => (
        <span key={s} className="case-skill-tag">{s}</span>
      ))}
    </div>
  )
}

export default function TJCase() {
  const [active, setActive] = useState<SceneKey>('M1')
  const scene = SCENES.find((s) => s.key === active)!
  const { toggle: toggleDark } = useDarkMode()
  const [toggleAnim, setToggleAnim] = useState(false)
  useLenis()

  const handleThemeToggle = () => {
    toggleDark()
    setToggleAnim(true)
    setTimeout(() => setToggleAnim(false), 420)
  }

  return (
    <div className="case-page">

      {/* Nav */}
      <header className="case-nav">
        <Link to="/" className="case-nav-back">← Camilo Conde</Link>
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
      <section className="case-hero">
        <div className="case-hero-inner">
          <p className="case-eyebrow">
            Taylor &amp; Johnson International · Multimedia Engineer · 2018–2021
          </p>
          <h1 className="case-headline">
            Bridging 40 years of COBOL banking infrastructure to the modern web.
          </h1>
          <p className="case-subhead">
            A legacy 5250 green-screen core — still processing real transactions daily — modernized
            to responsive web interfaces without touching the business logic underneath.
          </p>
        </div>
      </section>

      {/* Context */}
      <CaseSection>
        <CaseLabel num="00">Context</CaseLabel>
        <div className="case-overview-grid">
          <div>
            <h2 className="case-section-title">The system that couldn't stop.</h2>
            <p className="case-body">
              The banking core ran on IBM AS/400 hardware with 5250 terminals — a technology
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
          </div>
          <div className="case-meta-block">
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

      {/* Case 01 — Interface Modernization */}
      <CaseSection>
        <CaseLabel num="01">Interface Modernization</CaseLabel>
        <p className="case-chapter-body">
          Translated legacy 5250 terminal screens into responsive web UIs via Presto — every
          workflow rebuilt in HTML, JavaScript, and CSS while the COBOL business logic
          underneath stayed untouched. Operators went from memorizing keyboard shortcuts on
          green-screen menus to navigating purpose-built interfaces with proper hierarchy,
          feedback, and visual consistency.
        </p>
        <div className="case-stage-header">
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
        <div className="case-stage-wrap">
          <Stage
            key={active}
            width={1920}
            height={1080}
            duration={scene.dur}
            background="#0A1408"
            persistKey={`presto-${active}`}
            initialTime={0}
          >
            <Sprite start={0} end={scene.dur} keepMounted>
              <scene.comp />
            </Sprite>
          </Stage>
        </div>
        <SkillTags skills={['HTML', 'CSS', 'JavaScript', 'jQuery', 'Presto']} />
      </CaseSection>

      {/* Case 02 — Parametric Document Generation */}
      <CaseSection>
        <CaseLabel num="02">Parametric Document Generation</CaseLabel>
        <p className="case-chapter-body">
          Built a document engine — jointly defined with the COBOL team — that generated
          banking documents from SQL queries and web service calls. Every parameter
          (typography, spacing, colors, logo, signature placement) was configurable from a
          table in AS/400, so any document type could be restyled without touching code.
          A client-facing layer, exposing that same control through a Presto-modernized
          interface, was in late stages of development at departure.
        </p>
        <div className="case-schema-wrap">
          <SchemaAS400 />
        </div>
        <p className="case-caption">Ejemplo ilustrativo · PDFP001 · columnas y datos ajustados para claridad · la pantalla real no era visible para el usuario final</p>
        <div className="case-stage-wrap" style={{ marginTop: 32 }}>
          <Stage
            width={1920}
            height={1080}
            duration={19.5}
            background="#0A0A14"
            persistKey="as400-pdf"
            initialTime={0}
          >
            <Sprite start={0} end={19.5} keepMounted>
              <SceneAS400toPDF />
            </Sprite>
          </Stage>
        </div>
        <SkillTags skills={['JsPDF.js', 'SQL', 'Web Services', 'AS/400']} />
      </CaseSection>

      {/* Case 03 — Digital Signature Integration */}
      <CaseSection>
        <CaseLabel num="03">Digital Signature Integration</CaseLabel>
        <p className="case-chapter-body">
          Integrated TOPAZ LCD signature pads directly into the Presto layer, enabling
          in-branch document signing without leaving the web interface. Once captured, the
          signature surfaced in the Presto screen and flowed into the corresponding document —
          replacing a paper-based process and anchoring signature integrity to the banking
          operation in the ERP.
        </p>
        <div className="case-stage-wrap">
          <Stage
            width={1920}
            height={1080}
            duration={18}
            background="#0A0A0A"
            persistKey="topaz-sign"
            initialTime={0}
          >
            <Sprite start={0} end={18} keepMounted>
              <SceneTopaz />
            </Sprite>
          </Stage>
        </div>
        <SkillTags skills={['Presto', 'TOPAZ LCD', 'ERP Integration']} />
      </CaseSection>

      {/* Case 04 — Process Automation */}
      <CaseSection>
        <CaseLabel num="04">Process Automation</CaseLabel>
        <p className="case-chapter-body">
          Built a Selenium-based automation to migrate records from our system into a
          third-party client's platform. The process was parameterized against a web service
          data source, allowing any batch size to be fed programmatically — replacing a
          manual, error-prone data entry operation for each client integration.
        </p>
        <div className="case-stage-wrap">
          <Stage
            width={1920}
            height={1080}
            duration={28}
            background="#0A0A0A"
            persistKey="selenium-migration"
            initialTime={0}
          >
            <Sprite start={0} end={28} keepMounted>
              <SceneSelenium />
            </Sprite>
          </Stage>
        </div>
        <SkillTags skills={['Python', 'Selenium', 'Web Services']} />
      </CaseSection>

      {/* Footer */}
      <footer className="case-footer">
        <Link to="/" className="case-footer-back">← Back to CV</Link>
      </footer>

    </div>
  )
}
