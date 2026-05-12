import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDarkMode } from './hooks/useDarkMode'
import { useLenis } from './hooks/useLenis'
import './App.css'

const SECTION_COLORS: Record<string, string> = {
  about:      'var(--color-about)',
  experience: 'var(--color-experience)',
  skills:     'var(--color-skills)',
  contact:    'var(--color-contact)',
}

function useSectionColor() {
  const ratios = useRef<Map<string, number>>(new Map())
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('data-section')!
          ratios.current.set(id, entry.intersectionRatio)
        })

        let maxRatio = 0
        let active = 'hero'
        ratios.current.forEach((ratio, id) => {
          if (ratio > maxRatio) {
            maxRatio = ratio
            active = id
          }
        })

        document.documentElement.style.setProperty(
          '--accent',
          active === 'hero' ? 'var(--accent-neutral)' : SECTION_COLORS[active]
        )
        setActiveSection(active)
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    )

    document.querySelectorAll('[data-section]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return activeSection
}

function useParallax() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onScroll = () => {
      document.documentElement.style.setProperty('--parallax-y', `${window.scrollY * 0.6}px`)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
}

function useMobileScrollActive() {
  useEffect(() => {
    if (!window.matchMedia('(hover: none)').matches) return

    const groups = [
      Array.from(document.querySelectorAll('.timeline-item')),
      Array.from(document.querySelectorAll('.skill-group')),
    ]

    const update = () => {
      const viewCenter = window.innerHeight / 2
      const threshold = window.innerHeight * 0.55

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

function useBloomFollow() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const hoverMq = window.matchMedia('(hover: none)')

    let targetX = 0.65
    let targetY = 0.36
    let currentX = 0.65
    let currentY = 0.36
    let rafId: number

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX / window.innerWidth
      targetY = e.clientY / window.innerHeight
    }

    const tick = () => {
      currentX = lerp(currentX, targetX, 0.05)
      currentY = lerp(currentY, targetY, 0.05)
      document.documentElement.style.setProperty('--bloom-x', `${currentX * 100}%`)
      document.documentElement.style.setProperty('--bloom-y', `${currentY * 100}%`)
      rafId = requestAnimationFrame(tick)
    }

    const start = () => {
      rafId = requestAnimationFrame(tick)
      window.addEventListener('mousemove', onMouseMove, { passive: true })
    }

    const stop = () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMouseMove)
    }

    const onHoverChange = (e: MediaQueryListEvent) => {
      e.matches ? stop() : start()
    }

    if (!hoverMq.matches) start()

    hoverMq.addEventListener('change', onHoverChange)

    return () => {
      stop()
      hoverMq.removeEventListener('change', onHoverChange)
    }
  }, [])
}

function useScrollReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
    )

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

function StatCounter({ target, label }: { target: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState(0)
  const triggered = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true
          const duration = 1400
          const start = performance.now()
          const tick = (now: number) => {
            const t = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - t, 3)
            setValue(Math.round(eased * target))
            if (t < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return (
    <div ref={ref}>
      <span className="stat-number">{String(value).padStart(2, '0')}+</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

export default function App() {
  const { toggle: toggleDark } = useDarkMode()
  const [scrolled, setScrolled] = useState(false)
  const [toggleAnim, setToggleAnim] = useState(false)

  const activeSection = useSectionColor()
  useScrollReveal()
  useParallax()
  useBloomFollow()
  useMobileScrollActive()
  useLenis()

  const handleThemeToggle = () => {
    toggleDark()
    setToggleAnim(true)
    setTimeout(() => setToggleAnim(false), 420)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="app">

      <div className="ambient-bloom" aria-hidden="true">
        <div className="ambient-bloom-glow" />
      </div>

      <a href="#about" className="skip-link">Skip to content</a>

      <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <a href="#" className="nav-logo" aria-label="Back to top">CC</a>
        <nav className="nav-links" aria-label="Page sections">
          {(['about', 'experience', 'skills', 'contact'] as const).map((s) => (
            <a key={s} href={`#${s}`} className={`nav-link${activeSection === s ? ' is-active' : ''}`}>
              {s}
            </a>
          ))}
        </nav>
        <button
          className="theme-toggle"
          onClick={handleThemeToggle}
          aria-label="Toggle dark mode"
        >
          <span className={`toggle-icon${toggleAnim ? ' is-spinning' : ''}`} aria-hidden="true">
            ●
          </span>
        </button>
      </header>

      {/* ── Hero ── */}
      <section data-section="hero" className="section section-hero">
        <div className="hero-bg" aria-hidden="true">
          <span className="hero-bg-text">CC</span>
        </div>
        <p className="hero-eyebrow">Available for work</p>
        <h1 className="hero-name">
          <span className="name-line"><span className="name-text">Camilo</span></span>
          <span className="name-line"><span className="name-text">Conde</span></span>
        </h1>
        <div className="hero-meta">
          <p className="hero-title">Design Engineer</p>
          <p className="hero-bio">
            Building at the intersection of design and code.
            5+ years crafting digital experiences across fintech, edtech and beyond.
          </p>
          <div className="hero-links">
            <a href="mailto:condeher94@gmail.com" className="hero-link">Email</a>
            <a
              href="https://linkedin.com/in/camilo-conde-652204220"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-link"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/CondeHdz94"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-link"
            >
              GitHub
            </a>
          </div>
        </div>
        <div className="scroll-hint">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" data-section="about" className="section section-about">
        <div className="section-inner">
          <p className="section-label reveal">
            <span className="section-num">01</span>
            <span className="section-name">About</span>
          </p>
          <div className="about-grid">
            <div className="about-stats reveal reveal-delay-1">
              <StatCounter target={5}  label="Years of experience" />
              <StatCounter target={20} label="Completed projects" />
              <StatCounter target={3}  label="Companies worked" />
            </div>
            <div className="about-text reveal reveal-delay-2">
              <p className="about-quote">
                "The best way to face challenges is with an open mind and an insatiable curiosity."
              </p>
              <p>
                Multimedia Engineer from Universidad de San Buenaventura — fluent
                in Figma and fluent in the codebase. 5+ years taking products
                from sketch to production in React and TypeScript, with a genuine
                interest in how people actually interact with what gets built.
              </p>
              <p>
                A background in motion graphics, digital illustration and video
                post-production sharpens the visual eye behind every interface.
                Currently building design systems, validating accessibility, and
                obsessing over the interaction details that make software feel
                genuinely good to use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Experience ── */}
      <section id="experience" data-section="experience" className="section section-experience">
        <div className="section-inner">
          <p className="section-label reveal">
            <span className="section-num">02</span>
            <span className="section-name">Experience</span>
          </p>
          <div className="timeline">
            {[
              {
                company: 'UNI2',
                role: 'Frontend Developer',
                period: '2021 – Present',
                tags: ['React', 'Redux', 'TypeScript', 'Tailwind', 'React Query', 'Zustand', 'Framer Motion', 'Figma', 'Git', 'Design Systems', 'Accessibility'],
                desc: 'Banking platform frontend in React and Redux. Architected the product\'s design system from scratch, aligning brand guidelines with accessibility validation. Owns the frontend stack across UI/UX improvements, library migrations and process automation.',
              },
              {
                company: 'Taylor & Johnson',
                role: 'Multimedia Engineer',
                period: '2018 – 2021',
                tags: ['JavaScript', 'JsPDF', 'Python', 'Selenium', 'COBOL'],
                desc: "Modernized a COBOL banking core from legacy 5250 green-screen interfaces to web using Fresche Solutions' Presto. Built parametric document generation with JsPDF, digital signature integration with TOPAZ devices, and process automation with Python and Selenium.",
                caseStudy: { href: '/case/taylor-johnson', label: 'T&J — COBOL modernization' },
              },
              {
                company: 'Sistel',
                role: 'Web Course Developer',
                period: '2017 – 2018',
                tags: ['HTML5', 'CSS', 'Articulate', 'UX Design'],
                desc: 'Designed and built interactive e-learning experiences in HTML5 and Articulate, combining interactivity, ludic design and andragogy to drive engagement across corporate training programs.',
              },
            ].map(({ company, role, period, tags, desc, caseStudy }, i) => (
              <div key={company} className={`timeline-item reveal reveal-delay-${i + 1}`}>
                <span className="timeline-num">0{i + 1}</span>
                <div className="timeline-header">
                  <span className="timeline-company">{company}</span>
                  <span className="timeline-period">{period}</span>
                </div>
                <p className="timeline-role">{role}</p>
                <p className="timeline-tags">{tags.join(' · ')}</p>
                <p className="timeline-desc">{desc}</p>
                {caseStudy && (
                  <Link to={caseStudy.href} className="timeline-case-link">
                    {caseStudy.label}
                    <span className="timeline-case-arrow" aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Skills ── */}
      <section id="skills" data-section="skills" className="section section-skills">
        <div className="section-inner">
          <p className="section-label reveal">
            <span className="section-num">03</span>
            <span className="section-name">Skills</span>
          </p>
          <div className="skills-stack">
            {[
              {
                title: 'Languages',
                items: ['JavaScript', 'TypeScript', 'HTML', 'CSS / SASS'],
              },
              {
                title: 'Frameworks & Libraries',
                items: ['React', 'Svelte', 'Astro', 'Framer Motion', 'React Query', 'Redux', 'Zustand', 'Tailwind'],
              },
              {
                title: 'Design & Motion',
                items: ['Figma', 'Illustrator', 'Photoshop', 'After Effects', 'Premiere Pro', 'InDesign'],
              },
              {
                title: 'Quality & Systems',
                items: ['Design Systems', 'Accessibility', 'Jest', 'Testing Library', 'Cypress', 'Git'],
              },
            ].map(({ title, items }, i) => (
              <div key={title} className={`skill-group reveal reveal-delay-${i + 1}`}>
                <h3 className="skill-group-title">{title}</h3>
                <div className="skill-tags">
                  {items.map((item) => (
                    <span key={item} className="skill-tag">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" data-section="contact" className="section section-contact">
        <div className="section-inner">
          <p className="section-label reveal">
            <span className="section-num">04</span>
            <span className="section-name">Contact</span>
          </p>
          <p className="contact-headline reveal reveal-delay-1">Let's build something together.</p>
          <div className="contact-links reveal reveal-delay-2">
            <a href="mailto:condeher94@gmail.com" className="contact-link">
              condeher94@gmail.com
            </a>
            <a href="tel:+573127216626" className="contact-link">
              +57 312 721 6626
            </a>
          </div>
          <div className="contact-social reveal reveal-delay-3">
            <a
              href="https://github.com/CondeHdz94"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/camilo-conde-652204220"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              LinkedIn
            </a>
            <a
              href="https://behance.net"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              Behance
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}
