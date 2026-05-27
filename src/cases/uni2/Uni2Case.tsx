import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Stage } from '../../components/animation'
import { useDarkMode } from '../../hooks/useDarkMode'
import { useLenis } from '../../hooks/useLenis'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useBloomFollow } from '../../hooks/useBloomFollow'
import { CaseSection, CaseLabel, SkillTags, CaseFooterNav } from '../CaseLayout'
import { Uni2SaaSReel } from './saasReel/Uni2SaaSReel'
import './Uni2Case.css'

// ── Static data ───────────────────────────────────────────────────────────────


const FSD_LAYERS = [
  { name: 'pages',     desc: 'entry points' },
  { name: 'processes', desc: 'multi-step flows', active: true },
  { name: 'steps',     desc: 'form steps',       active: true },
  { name: 'features',  desc: 'domain features' },
  { name: 'domains',   desc: 'data models' },
  { name: 'components', desc: 'UI primitives' },
]

const PLATFORM_IDS    = ['platform-01', 'platform-02', 'platform-03']
const PLATFORM_LABELS = ['Biometric', 'Modal System', 'Libraries']

// ── Page component ────────────────────────────────────────────────────────────

export default function Uni2Case() {
  const { toggle: toggleDark } = useDarkMode()
  const [toggleAnim, setToggleAnim] = useState(false)
  const [activePlatformIdx, setActivePlatformIdx] = useState(0)
  const platformRatios = useRef<number[]>([0, 0, 0])
  const navigate = useNavigate()
  const handleBack = () => window.history.length > 1 ? navigate(-1) : navigate('/', { viewTransition: true })
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
    const observer = new IntersectionObserver((entries) => {
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

  return (
    <div className="case-page case-page--uni2">

      <a href="#case-main" className="case-skip-link">Skip to content</a>

      <div className="ambient-bloom" aria-hidden="true">
        <div className="ambient-bloom-glow" />
      </div>

      {/* Nav */}
      <header className="case-nav">
        <button onClick={handleBack} className="case-nav-back">← Camilo Conde</button>
        <span className="case-nav-title">UNI2 · 2021 – Present</span>
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
            UNI2 Microcrédito · Sr. Frontend Lead · Founding Engineer, Uni2Lite · 2021 – Present
          </p>
          <h1 className="case-headline reveal reveal-delay-1">
            Banking software for thirty roles, built from the frontend.
          </h1>
          <p className="case-subhead reveal reveal-delay-2">
            Four-plus years shipping on the frontend of a live banking core — then a clean start:
            architecting Uni2Lite from the first commit as sole frontend engineer,
            building not just a credit platform but a composable engine to assemble
            any credit process from configuration, not code.
          </p>
        </div>
      </section>

      {/* 00 — Context */}
      <CaseSection>
        <CaseLabel num="00">Context</CaseLabel>
        <div className="case-overview-grid">
          <div className="reveal reveal-delay-1">
            <h3 className="case-section-title">
              A live banking platform with daily operations, thirty user roles, and no room for downtime.
            </h3>
            <p className="case-body">
              UNI2 is the internal web interface of a Colombian microcredit company — the platform through
              which every credit operation is originated, approved, disbursed, and tracked. The users
              are not abstract end users: they are credit officers running loan applications, approvers
              reviewing risk, portfolio managers monitoring recovery, accountants closing monthly books,
              and regional directors tracking commercial performance. Thirty-plus roles with distinct
              menus, permissions, and navigation flows. The system doesn't tolerate downtime.
            </p>
            <p className="case-body">
              This engagement has two connected chapters. The first four-plus years: contributor to an
              established React + Redux codebase with a complex domain, progressive technical
              improvements alongside feature delivery, and the kind of learning that only comes from
              watching the consequences of decisions play out in production. Early 2025: Uni2Lite —
              a separate platform built from the first commit by a single frontend developer, with the
              explicit goal of getting the architecture right for the team that will eventually join.
            </p>
          </div>
          <div className="case-meta-block reveal reveal-delay-2">
            {[
              { label: 'Company',  value: 'UNI2 Microcrédito' },
              { label: 'Role',     value: 'Sr. Frontend Lead\nFounding Engineer (Uni2Lite)' },
              { label: 'Duration', value: '4 years 6 months · Ongoing' },
              { label: 'Location', value: 'Cali, Colombia' },
            ].map(({ label, value }) => (
              <div key={label} className="case-meta-item">
                <span className="case-meta-label">{label}</span>
                <span className="case-meta-value" style={{ whiteSpace: 'pre-line' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </CaseSection>

      {/* 01 — Platform contribution intro */}
      <CaseSection>
        <CaseLabel num="01">Platform Contribution</CaseLabel>

        <h3 className="case-section-title reveal">
          Four-plus years of continuous delivery on a live banking platform — currently as Frontend Lead.
        </h3>

        <p className="case-body reveal reveal-delay-1">
          Today the role is Frontend Lead — the technical anchor for the team's frontend work
          in the credit domain, while continuing to contribute directly to the main platform.
          Key process designs and implementation decisions are reviewed through me before they ship. Beyond technical oversight, I organized and facilitated
          the team's hands-on onboarding to AI tooling, translating a company-wide initiative
          into a structured induction on integrating tools like Claude Code into the
          day-to-day development workflow.
        </p>

        <div className="uni2-stats reveal reveal-delay-1">
          {[
            { value: '+3,140', label: 'Commits signed' },
            { value: '+5,300', label: 'Files touched' },
            { value: '+470K',  label: 'Lines added' },
          ].map(s => (
            <div key={s.label} className="uni2-stats-item">
              <div className="uni2-stat-value">{s.value}</div>
              <div className="uni2-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <p className="case-body reveal reveal-delay-1">
          The platform runs on React with Redux and Redux-Saga for state management, Material-UI
          for components, and SCSS with Bootstrap for styling. Each of the 30+ operational roles
          has its own menu configuration, permission set, and navigation flow — managed through
          individual role config files. Changes to shared components require tracing all downstream
          consumers. Contributing to a system at this scale for four years means learning to read
          the domain before touching the code.
        </p>
      </CaseSection>

      {/* Platform sub-cases — sidebar region */}
      <div className="cases-region uni2-platform-region">
        <nav className="cases-sidebar" aria-label="Platform highlights">
          {PLATFORM_LABELS.map((label, i) => (
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
          <p className="case-body reveal reveal-delay-1">
            Digital authorization and biometric onboarding pipeline — the highest-impact feature
            delivered across the engagement. AWS Amplify Face Liveness for biometric capture,
            DECEVAL for electronic signature, and Verifik for identity validation and credit
            bureau queries.
          </p>
          <p className="case-body reveal reveal-delay-1">
            The flow handles token delivery, document number comparison, re-send with on-screen
            feedback, and a dedicated Digital Ally role for field-assisted operations — credit
            officers who accompany clients through the process when self-service isn't viable.
            It replaced paper-based, in-person approval processes with a fully remote pipeline.
          </p>
          <p className="case-outcome-line reveal reveal-delay-2">
            Authorization turnaround reduced from <strong>days or weeks to minutes</strong> — the full biometric pipeline runs remotely, end-to-end, without paper or in-person coordination.
          </p>
        </CaseSection>

        {/* 01b — Modal System */}
        <CaseSection id="platform-02">
          <CaseLabel num="01b">Modal System</CaseLabel>
          <p className="case-body reveal reveal-delay-1">
            Unified modal pattern — central, lateral, and alert variants with consistent overlay
            and scroll handling — adopted across all roles.
          </p>
          <p className="case-body reveal reveal-delay-1">
            Before this, modals were implemented independently per feature: overlapping z-index
            conflicts, inconsistent dismiss behavior, no shared scroll lock. A single composable
            system replaced them all. The shared application summary component, built alongside
            the modal system, eliminated diverged implementations that had accumulated across
            years of parallel feature work.
          </p>
          <p className="case-outcome-line reveal reveal-delay-2">
            <strong>Adopted as platform standard across all 30+ roles</strong> — every module and feature built after the system shipped uses it. Zero per-feature z-index conflicts since.
          </p>
        </CaseSection>

        {/* 01c — Library Modernization */}
        <CaseSection id="platform-03">
          <CaseLabel num="01c">Library Modernization</CaseLabel>
          <p className="case-body reveal reveal-delay-1">
            Each removal earned its place. SweetAlert2 went out when the custom modal system
            went in — not before. MUI icons and the core library were phased out progressively
            as owned components took their place: no third-party theming constraints, no bundle
            weight we didn't control. react-scripts moved from 3.x to 5.x to unblock the
            biometric pipeline — and freed chart.js to migrate to recharts along the way.
          </p>
          <p className="case-outcome-line reveal reveal-delay-2">
            Bundle weight reduced with each removal — no library dropped without a documented rationale and a replacement that earned its place.
          </p>
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

        <h3 className="case-section-title reveal">
          Not a credit form. An engine for assembling any credit origination process — in hours, not sprints.
        </h3>
        <p className="case-body reveal reveal-delay-1">
          In early 2025, the company started Uni2Lite: a separate platform for its services
          segment. No legacy to inherit — a blank Vite config and a foundational question:
          what kind of codebase to build. The constraint: one frontend developer, an expectation
          that others would eventually join, and the responsibility to leave them a foundation
          worth inheriting.
        </p>
        <p className="case-body reveal reveal-delay-1">
          The insight that shaped everything: in financial products, processes change faster than
          code. New regulation, new product, new partner segment — if every process change
          requires a sprint of refactoring, you've already lost. The answer is a composable
          credit origination engine. Not an app. A factory for apps. The steps — pre-approval,
          client, credit, contact, insurability, OTP signature, documents — are independent
          pieces. Processes assemble them. A step doesn't know which process it lives in.
          Five decisions made this possible:
        </p>
        <ol className="uni2-differentiators reveal reveal-delay-2">
          <li>
            <strong>Native dual mode.</strong> The same <code>CreditApplicationFlow</code> component
            renders in edit mode for the client filling out the request and in consult (read-only)
            mode for the analyst reviewing it from their work queue. One source of truth, two
            experiences, zero component duplication.
          </li>
          <li>
            <strong>Declarative forms.</strong> Fields are described as <code>FieldConfig[]</code>.
            A builder auto-generates the Zod schema with validation messages in Spanish, the
            responsive grid, and the React Hook Form connection. Adding a field is a single line
            of config, not a 200-line PR.
          </li>
          <li>
            <strong>Agnostic stepper.</strong> The stepper orchestrates without knowing what any
            step does. Each step registers itself via <code>useFormStepHandler</code> or{' '}
            <code>registerSubmitHandler</code> and returns <code>Promise&lt;boolean&gt;</code>.
            An OTP step, a document upload step, and a 40-field form step are identical from the
            engine's perspective.
          </li>
          <li>
            <strong>Real role separation.</strong> Public routes for client signature (
            <code>/signature/:token</code>), private <code>ProtectedRoute</code> for analysts,
            distributors, administrators. Each role sees exactly their surface.
          </li>
          <li>
            <strong>Architecture that holds.</strong> Feature-Sliced Design with unidirectional
            dependency flow. A step never imports from another step. A feature never imports from
            another feature. Delete an entire process without breaking anything else.
          </li>
        </ol>

        <div className="uni2-arch reveal reveal-delay-2" role="img" aria-label="Feature-Sliced Design layers: pages, processes, steps, features, domains, components">
          {FSD_LAYERS.map(l => (
            <div key={l.name} className={`uni2-arch-layer${l.active ? ' uni2-arch-layer--active' : ''}`}>
              <div className="uni2-arch-layer-name">{l.name}</div>
              <div className="uni2-arch-layer-desc">{l.desc}</div>
            </div>
          ))}
        </div>
        <p className="case-caption reveal reveal-delay-2">
          Feature-Sliced Design (adapted) · upper layers import from lower, never the reverse · delete a process without breaking anything
        </p>

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
        <p className="case-caption reveal reveal-delay-3">
          Uni2 SaaS · 45s · composable origination · declarative intake · roles · multi-tenant · drag-to-compose
        </p>

        <SkillTags
          skills={['React 18', 'TypeScript', 'Vite', 'TailwindCSS 4', 'Zustand', 'React Query', 'React Hook Form', 'Zod', 'Framer Motion', 'React Router 7', 'Axios', 'pnpm', 'Claude Code']}
          className="reveal reveal-delay-3"
        />
      </CaseSection>

      {/* 03 — Outcomes */}
      <CaseSection>
        <CaseLabel num="03">What changed</CaseLabel>
        <ul className="case-outcomes reveal reveal-delay-1">
          <li>Credit origination flow reduced from multi-day manual coordination to a single guided session — operators run applications end-to-end without leaving the platform.</li>
          <li>Compliance review moved inside the origination interface — the stepper's dual edit/consult mode eliminated parallel paper forms tracking the same data in two separate systems.</li>
          <li>Downstream rejection rates from the banking core reduced — the Zod + RHF validation layer catches field schema mismatches at input, before they reach the core.</li>
          <li>Frontend onboarding measurably faster — Feature-Sliced Design's explicit, unidirectional boundaries mean a new contributor can navigate the codebase without implicit coupling to trace.</li>
        </ul>
        <p className="case-body reveal reveal-delay-2">
          This isn't a form wizard. It's a process orchestrator — multi-step, stateful, compliant, integrated against a real banking core.
        </p>
      </CaseSection>

      {/* Footer */}
      <footer className="case-footer">
        <CaseFooterNav />
      </footer>

    </div>
  )
}
