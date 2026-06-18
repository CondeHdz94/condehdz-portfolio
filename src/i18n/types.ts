export type Lang = 'en' | 'es'

export interface CategoryTranslation {
  title: string
  hint:  string
}

export interface DiffItem {
  title: string
  [key: string]: string
}

export interface Translations {
  nav: {
    about:       string
    experience:  string
    skills:      string
    contact:     string
    sectionLabel: Record<string, string>
    pillLabel:    Record<string, string>
    ariaLabel:   string
    skipLink:    string
    backToTop:   string
    toggleTheme: string
    toggleLang:  string
  }
  hero: {
    eyebrow:  string
    title:    string
    bio:      string
    emailCta: string
    scroll:   string
  }
  about: {
    quote: string
    p1:    string
    p2:    string
  }
  experience: {
    caseStudyLabel: string
    currentBadge:   string
    entries: {
      uni2:   { desc: string; caseLabel: string; caseMeta: string }
      tj:     { desc: string; caseLabel: string; caseMeta: string }
      sistel: { desc: string; caseLabel: string; caseMeta: string }
    }
  }
  skills: {
    headline:   string
    yearsLabel: string
    categories: Record<string, CategoryTranslation>
    notes:      Record<string, string>
  }
  contact: {
    headline: string
  }
  meta: {
    company:  string
    role:     string
    duration: string
    location: string
  }
  cases: {
    uni2:   Uni2T
    tj:     TJT
    sistel: SistelT
  }
}

export interface Uni2T {
  navTitle:  string
  eyebrow:   string
  headline:  string
  subhead:   string
  context: {
    sectionTitle: string
    p1:      string
    p2:      string
    company: string
    role:    string
    duration:string
    location:string
  }
  platform: {
    sectionTitle: string
    intro:   string
    p2:      string
    stats: { commits: string; files: string; lines: string }
    platformNavAriaLabel: string
    platformLabels: [string, string, string]
    stackLabel: string
    biometric: { p1: string; p2: string; outcome: string }
    modal:     { p1: string; p2: string; outcome: string }
    libraries: { p1: string; outcome: string }
  }
  uni2saas: {
    sectionTitle: string
    p1:      string
    p2:      string
    d1: { title: string; pre: string; post: string }
    d2: { title: string; pre: string; post: string }
    d3: { title: string; pre: string; mid: string; ret: string; post: string }
    d4: { title: string; pre: string; mid: string; suf: string }
    d5: { title: string; body: string }
    fsdLayers: [string, string, string, string, string, string]
    fsdAriaLabel: string
    fsdCaption:   string
    animCaption:  string
    stackLabel:   string
  }
  reel: {
    brandSublabel:   string
    caption:  { kicker: string; line: string }
    thesis:   { kicker: string; title: string; titleItalic: string; sub: string; addStep: string }
    steps:    string[]
    chaptersHeading: string
    pillars: [
      { name: string; line: string },
      { name: string; line: string },
      { name: string; line: string },
      { name: string; line: string },
    ]
    captura:  { formTitle: string; fieldLabels: Record<string, string> }
    decision: { scoreLabel: string; riskLabel: string; rules: [string, string, string]; rulesCount: string; approve: string }
    roles:    { chipSuffix: string; lanes: [{ name: string; role: string }, { name: string; role: string }, { name: string; role: string }] }
    tenant:   { flowLabel: string }
    tenants:  Record<string, { name: string; tagline: string }>
    stepLabels: Record<string, string>
    closing:  { title: string; titleItalic: string }
  }
  anatomy: {
    eyebrow:     string
    title:       string
    titleItalic: string
    map: [
      { title: string; detail: string },
      { title: string; detail: string },
      { title: string; detail: string },
      { title: string; detail: string },
    ]
    caption: string
  }
  outcomes: {
    items:   [string, string, string, string]
    closing: string
  }
}

export interface TJT {
  navTitle: string
  eyebrow:  string
  headline: string
  subhead:  string
  context: {
    sectionTitle: string
    p1:      string
    p2:      string
    p3:      string
    company: string
    role:    string
    duration:string
    location:string
  }
  caseNavAriaLabel: string
  caseLabels: [string, string, string, string]
  sceneLabels: { M1: string; M2: string; M3: string }
  case01: { p1: string; outcome: string }
  case02: { p1: string; schemaCaption: string; outcome: string }
  case03: { p1: string; outcome: string }
  case04: { p1: string; outcome: string }
  outcomes: {
    items:   [string, string, string, string]
    closing: string
  }
}

export interface SistelT {
  navTitle: string
  eyebrow:  string
  headline: string
  subhead:  string
  context: {
    sectionTitle: string
    p1:      string
    p2:      string
    company: string
    role:    string
    duration:string
    location:string
  }
  stats: {
    modules: string
    clients: string
    window:  string
  }
  clientsIntlLabel:     string
  clientsRegionalLabel: string
  workflow: {
    step1: { label: string; items: [string, string, string] }
    step2: { label: string; items: [string, string, string] }
    step3: { label: string; items: [string, string, string] }
  }
  workflowAriaLabel: string
  script: {
    p1:             string
    p2:             string
    pipelineCaption:string
    animCaption:    string
  }
  outcomes: {
    items:   [string, string, string]
    closing: string
  }
}
