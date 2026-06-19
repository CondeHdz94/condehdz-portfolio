import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDarkMode } from './hooks/useDarkMode'
import { useLenis } from './hooks/useLenis'
import { useScrollReveal } from './hooks/useScrollReveal'
import { useHeroBlobs } from './hooks/useHeroBlobs'
import { useBloomFollow } from './hooks/useBloomFollow'
import { useLang } from './i18n/LangContext'
import { EXPERIENCE } from './content/experience'
import { SkillsLedger } from './components/SkillsLedger'
import { HERO_LINKS, CONTACT_LINKS, SOCIAL_LINKS } from './content/contact'
import './App.css'

const SECTION_COLORS: Record<string, string> = {
  about:      'var(--color-about)',
  experience: 'var(--color-experience)',
  skills:     'var(--color-skills)',
  contact:    'var(--color-contact)',
}

const PILL_KEYS = ['hero', 'about', 'experience', 'skills', 'contact'] as const

const PILL_COLORS: Record<string, string> = {
  hero:       'var(--accent-neutral)',
  about:      'var(--color-about)',
  experience: 'var(--color-experience)',
  skills:     'var(--color-skills)',
  contact:    'var(--color-contact)',
}

function useSectionColor() {
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'))

    const update = () => {
      const centerY = window.scrollY + window.innerHeight * 0.35
      let active = 'hero'

      for (const el of sections) {
        const top    = el.offsetTop
        const bottom = top + el.offsetHeight
        if (centerY >= top && centerY < bottom) {
          active = el.dataset.section!
          break
        }
      }

      const color = active === 'hero' ? 'var(--accent-neutral)' : SECTION_COLORS[active]
      document.documentElement.style.setProperty('--accent', color)
      document.documentElement.style.setProperty(
        '--bloom-color',
        active === 'hero' ? 'var(--bloom-neutral)' : color
      )
      setActiveSection(active)
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return activeSection
}


function useMobileScrollActive() {
  useEffect(() => {
    if (!window.matchMedia('(hover: none)').matches) return

    const groups = [
      Array.from(document.querySelectorAll('.timeline-item')),
    ]

    const update = () => {
      const viewCenter = window.innerHeight / 2
      const threshold  = window.innerHeight * 0.55

      groups.forEach(items => {
        if (!items.length) return
        let closest: Element | null = null
        let minDist = Infinity

        items.forEach(item => {
          const rect = item.getBoundingClientRect()
          const dist = Math.abs(rect.top + rect.height / 2 - viewCenter)
          if (dist < minDist) { minDist = dist; closest = item }
        })

        items.forEach(item => item.classList.remove('is-scroll-active'))
        if (closest && minDist < threshold) {
          (closest as Element).classList.add('is-scroll-active')
        }
      })
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])
}

function useParallax() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let rafId: number
    let pending = false
    const onScroll = () => {
      if (pending) return
      pending = true
      rafId = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--parallax-y', `${window.scrollY * 0.35}px`)
        pending = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(rafId) }
  }, [])
}


export default function App() {
  const { toggle: toggleDark } = useDarkMode()
  const { lang, toggle: toggleLang, t } = useLang()
  const [scrolled, setScrolled]       = useState(false)
  const [toggleAnim, setToggleAnim]   = useState(false)
  const [pillOpen, setPillOpen]       = useState(false)
  const pillRef        = useRef<HTMLDivElement>(null)
  const pillTriggerRef = useRef<HTMLButtonElement>(null)
  const blobRef  = useRef<HTMLCanvasElement>(null)
  const glassRef = useRef<HTMLCanvasElement>(null)
  const ccRef    = useRef<HTMLSpanElement>(null)

  const activeSection = useSectionColor()
  useScrollReveal()
  useParallax()
  useBloomFollow()
  useMobileScrollActive()
  useLenis()
  useHeroBlobs(blobRef, glassRef, ccRef)

  const handleThemeToggle = () => {
    toggleDark()
    setToggleAnim(true)
    setTimeout(() => setToggleAnim(false), 420)
  }

  useEffect(() => {
    const saved = sessionStorage.getItem('home-scroll')
    if (saved) {
      window.scrollTo({ top: parseInt(saved, 10), behavior: 'instant' })
      sessionStorage.removeItem('home-scroll')
    }
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (pillRef.current && !pillRef.current.contains(e.target as Node)) {
        setPillOpen(false)
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPillOpen(false)
        pillTriggerRef.current?.focus()
      }
    }
    document.addEventListener('click', close)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('click', close)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const NAV_SECTIONS = ['about', 'experience', 'skills', 'contact'] as const

  return (
    <div className="app">

      <a href="#main" className="skip-link">{t.nav.skipLink}</a>

      <div className="ambient-bloom" aria-hidden="true">
        <div className="ambient-bloom-glow" />
      </div>

      <div className="nav-pill" ref={pillRef}>
        <button
          ref={pillTriggerRef}
          className="pill-trigger"
          onClick={() => setPillOpen(o => !o)}
          aria-expanded={pillOpen}
          aria-haspopup="true"
          aria-controls="pill-menu"
          aria-label={t.nav.ariaLabel}
        >
          <span className="pill-dot" />
          <span className="pill-name">{t.nav.sectionLabel[activeSection]}</span>
          <span className="pill-chevron" aria-hidden="true">▲</span>
        </button>
        <nav id="pill-menu" className={`pill-menu${pillOpen ? ' is-open' : ''}`} aria-label={t.nav.ariaLabel}>
          <ul role="list">
            {PILL_KEYS.map((key) => (
              <li key={key}>
                <a
                  href={key === 'hero' ? '#' : `#${key}`}
                  className={`pill-item${activeSection === key ? ' is-active' : ''}`}
                  onClick={() => setPillOpen(false)}
                >
                  <span className="pill-item-dot" style={{ background: PILL_COLORS[key] }} />
                  <span className="pill-item-label">{t.nav.pillLabel[key]}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <a href="#" className="nav-logo" aria-label={t.nav.backToTop}>CC</a>
        <nav className="nav-links" aria-label={t.nav.ariaLabel}>
          {NAV_SECTIONS.map((s) => (
            <a key={s} href={`#${s}`} className={`nav-link${activeSection === s ? ' is-active' : ''}`}>
              {t.nav[s]}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <button
            className="lang-toggle"
            onClick={toggleLang}
            aria-label={t.nav.toggleLang}
          >
            {lang === 'en' ? 'ES' : 'EN'}
          </button>
          <button
            className="theme-toggle"
            onClick={handleThemeToggle}
            aria-label={t.nav.toggleTheme}
          >
            <span className={`toggle-icon${toggleAnim ? ' is-spinning' : ''}`} aria-hidden="true">
              ●
            </span>
          </button>
        </div>
      </header>

      <main id="main" tabIndex={-1}>

      {/* ── Hero ── */}
      <section data-section="hero" className="section section-hero">
        <div className="hero-canvas-layer" aria-hidden="true">
          <canvas ref={blobRef}  className="hero-blob-canvas" />
          <div className="hero-cc-wrap">
            <span ref={ccRef} className="hero-cc-span">CC</span>
          </div>
          <canvas ref={glassRef} className="hero-glass-canvas" />
        </div>
        <p className="hero-eyebrow">
          <span className="hero-pulse" aria-hidden="true" />
          {t.hero.eyebrow}
        </p>
        <h1 className="hero-name">
          <span className="name-line"><span className="name-text">Camilo</span></span>
          <span className="name-line"><span className="name-text">Conde</span></span>
        </h1>
        <div className="hero-meta">
          <p className="hero-title">{t.hero.title}</p>
          <p className="hero-bio">{t.hero.bio}<strong>{t.hero.bioStrong}</strong></p>
          <div className="hero-links">
            {HERO_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`hero-link${'primary' in link ? ' hero-link--primary' : ''}`}
                {...('external' in link ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {'primary' in link ? t.hero.emailCta : link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="scroll-hint" aria-hidden="true">
          <span>{t.hero.scroll}</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" data-section="about" className={`section section-about${activeSection === 'about' ? ' is-active' : ''}`}>
        <div className="section-inner">
          <h2 className="section-label reveal">
            <span className="section-num">01</span>
            <span className="section-name">{t.nav.pillLabel.about}</span>
          </h2>
          <div className="about-grid">
            <blockquote className="about-quote reveal">
              {t.about.quote}
            </blockquote>
            <div className="about-text">
              <p className="reveal reveal-delay-1">{t.about.p1}</p>
              <p className="reveal reveal-delay-2">{t.about.p2}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Experience ── */}
      <section id="experience" data-section="experience" className={`section section-experience${activeSection === 'experience' ? ' is-active' : ''}`}>
        <div className="section-inner">
          <h2 className="section-label reveal">
            <span className="section-num">02</span>
            <span className="section-name">{t.nav.pillLabel.experience}</span>
          </h2>
          <ul className="timeline">
            {EXPERIENCE.map(({ company, role, period, tags, key, caseStudy }, i) => {
              const entry = t.experience.entries[key]
              return (
                <li key={company} className={`timeline-item reveal reveal-delay-${i + 1}`}>
                  <span className="timeline-num">0{i + 1}</span>
                  <div className="timeline-header">
                    <span className="timeline-company">{company}</span>
                    <span className="timeline-period">{period}</span>
                  </div>
                  <p className="timeline-role">{role}</p>
                  <p className="timeline-tags">{tags.join(' · ')}</p>
                  <p className="timeline-desc">{entry.desc}</p>
                  {caseStudy && (
                    <Link to={caseStudy.href} viewTransition className="timeline-case-card" onClick={() => sessionStorage.setItem('home-scroll', String(window.scrollY))}>
                      <div className="timeline-case-card-body">
                        <div className="timeline-case-card-top">
                          <span className="timeline-case-label">{t.experience.caseStudyLabel}</span>
                          {caseStudy.badge === 'current' && (
                            <span className="timeline-case-badge">{t.experience.currentBadge}</span>
                          )}
                        </div>
                        <span className="timeline-case-title">{entry.caseLabel}</span>
                        <span className="timeline-case-meta">{entry.caseMeta}</span>
                      </div>
                      <span className="timeline-case-arrow" aria-hidden="true">→</span>
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* ── Skills ── */}
      <section id="skills" data-section="skills" className={`section section-skills${activeSection === 'skills' ? ' is-active' : ''}`}>
        <div className="section-inner">
          <h2 className="section-label reveal">
            <span className="section-num">03</span>
            <span className="section-name">{t.nav.pillLabel.skills}</span>
          </h2>
          <p className="section-headline reveal reveal-delay-1">{t.skills.headline}</p>
          <SkillsLedger />
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" data-section="contact" className={`section section-contact${activeSection === 'contact' ? ' is-active' : ''}`}>
        <div className="section-inner">
          <h2 className="section-label reveal">
            <span className="section-num">04</span>
            <span className="section-name">{t.nav.pillLabel.contact}</span>
          </h2>
          <p className="contact-headline reveal reveal-delay-1">{t.contact.headline}</p>
          <div className="contact-links reveal reveal-delay-2">
            {CONTACT_LINKS.map(({ href, label }) => (
              <a key={href} href={href} className="contact-link">{label}</a>
            ))}
          </div>
          <div className="contact-social reveal reveal-delay-3">
            {SOCIAL_LINKS.map(({ href, label }) => (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="social-link">
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>

      </main>
    </div>
  )
}
