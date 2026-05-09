import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Stage, Sprite } from '../../components/animation'
import { SceneM1, SceneM2, SceneM3 } from './scenes'
import { useLenis } from '../../hooks/useLenis'
import './PrestoCase.css'

const SCENES = [
  { key: 'M1', label: 'Formulario', comp: SceneM1, dur: 10 },
  { key: 'M2', label: 'Tabla',      comp: SceneM2, dur: 10 },
  { key: 'M3', label: 'Detalle',    comp: SceneM3, dur: 10 },
] as const

type SceneKey = typeof SCENES[number]['key']

const WORK_ITEMS = [
  {
    num: '01',
    title: 'Interface Modernization',
    desc: 'Translated legacy 5250 terminal screens to responsive web UIs using Presto (Fresche Solutions). Every workflow — from client maintenance to account detail — was rebuilt in HTML, JavaScript and CSS while preserving the COBOL business logic underneath.',
  },
  {
    num: '02',
    title: 'Parametric Document Generation',
    desc: 'Built a document engine using JsPDF.js that pulled data from SQL queries and web service calls to generate banking documents with a predefined structure. Any document type — contracts, receipts, transaction reports — rendered from a single configurable template.',
  },
  {
    num: '03',
    title: 'Digital Signature Integration',
    desc: 'Integrated TOPAZ LCD signature pads into the Presto environment, enabling in-branch document signing workflows. Signatures were captured, embedded into generated PDFs, and stored against the corresponding banking operations.',
  },
  {
    num: '04',
    title: 'Test Automation',
    desc: 'Wrote regression test suites with Python and Selenium, parameterized via web service routes. Tests ran against the modernized interfaces across configurable data scenarios, replacing manual QA cycles before each deployment.',
  },
]

const STACK = [
  'HTML', 'CSS', 'JavaScript', 'jQuery', 'Python', 'Selenium', 'JsPDF.js', 'SQL', 'COBOL', 'Presto',
]

export default function PrestoCase() {
  const [active, setActive] = useState<SceneKey>('M1')
  const scene = SCENES.find((s) => s.key === active)!
  useLenis()

  return (
    <div className="case-page">

      {/* Nav */}
      <header className="case-nav">
        <Link to="/" className="case-nav-back">← Camilo Conde</Link>
        <span className="case-nav-title">Presto · T&J</span>
      </header>

      {/* Hero */}
      <section className="case-hero">
        <div className="case-hero-inner">
          <p className="case-eyebrow">Taylor &amp; Johnson · Multimedia Engineer · 2018–2021</p>
          <h1 className="case-headline">
            Bridging 40 years of COBOL banking infrastructure to the modern web.
          </h1>
          <p className="case-subhead">
            A legacy 5250 green-screen core — still processing real transactions daily — modernized to responsive web interfaces without touching the business logic underneath.
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="case-section">
        <div className="case-section-inner">
          <p className="case-label">
            <span className="case-label-num">01</span>
            Context
          </p>
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
              <div className="case-meta-item">
                <span className="case-meta-label">Company</span>
                <span className="case-meta-value">Taylor &amp; Johnson International</span>
              </div>
              <div className="case-meta-item">
                <span className="case-meta-label">Role</span>
                <span className="case-meta-value">Multimedia Engineer</span>
              </div>
              <div className="case-meta-item">
                <span className="case-meta-label">Duration</span>
                <span className="case-meta-value">2 years · 11 months</span>
              </div>
              <div className="case-meta-item">
                <span className="case-meta-label">Location</span>
                <span className="case-meta-value">Cali, Colombia</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase */}
      <section className="case-showcase">
        <div className="case-showcase-header">
          <p className="case-label">
            <span className="case-label-num">02</span>
            Interface Transformation
          </p>
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
          >
            <Sprite start={0} end={scene.dur} keepMounted>
              <scene.comp />
            </Sprite>
          </Stage>
        </div>
      </section>

      {/* Work */}
      <section className="case-section">
        <div className="case-section-inner">
          <p className="case-label">
            <span className="case-label-num">03</span>
            Work
          </p>
          <div className="case-work-list">
            {WORK_ITEMS.map((item) => (
              <div key={item.num} className="case-work-item">
                <span className="case-work-num">{item.num}</span>
                <div>
                  <h3 className="case-work-title">{item.title}</h3>
                  <p className="case-work-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stack */}
      <section className="case-section case-section--stack">
        <div className="case-section-inner">
          <p className="case-label">
            <span className="case-label-num">04</span>
            Stack
          </p>
          <div className="case-stack-tags">
            {STACK.map((tech) => (
              <span key={tech} className="case-stack-tag">{tech}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="case-footer">
        <Link to="/" className="case-footer-back">← Back to CV</Link>
      </footer>

    </div>
  )
}
