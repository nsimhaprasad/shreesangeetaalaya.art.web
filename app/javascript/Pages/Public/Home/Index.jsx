import { Head, Link } from '@inertiajs/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'
import './home.css'

const THEME_KEY = 'ssa-theme'

const programs = [
  {
    num: '01',
    title: 'Carnatic Vocal for Kids',
    age: 'Ages 5-12',
    body: 'Playful yet disciplined first steps into sruti, swara, and rhythm with progressive milestones.',
    bullets: ['Swaras and sruti basics', 'Play-based but structured lessons', 'Weekday and weekend slots'],
  },
  {
    num: '02',
    title: 'Voice Culture Training',
    age: '3-6 month track',
    body: 'Systematic breath work, tone shaping, and pitch precision for absolute beginners of any age.',
    bullets: ['Breath and tone control', 'Pitch stability drills', 'Beginner-friendly progression'],
  },
  {
    num: '03',
    title: 'Advanced Vocal Mentorship',
    age: 'Intermediate+',
    body: 'Deep raga exploration, tala mastery, and stage readiness through personalized guidance.',
    bullets: ['Raga alapana depth', 'Tala precision coaching', 'Performance preparation'],
  },
  {
    num: '04',
    title: 'Carnatic Flute Classes',
    age: 'All levels',
    body: 'Embouchure, airflow, raga study, and repertoire building in one-on-one and small-group formats.',
    bullets: ['Embouchure and airflow', 'Raga and composition work', 'Solo and group options'],
  },
]

const whyData = [
  {
    title: 'Vidwat-certified faculty',
    body: '15+ years of teaching experience across children, teens, adults, and senior learners.',
  },
  {
    title: 'Online and offline flexibility',
    body: 'Learn in person at Yelahanka or join live classes remotely from anywhere.',
  },
  {
    title: 'Performance-focused roadmap',
    body: 'Clear milestones from your first swara to confident stage presentation.',
  },
  {
    title: 'Warm but rigorous culture',
    body: 'Strong discipline, patient mentorship, and measurable growth every month.',
  },
]

const voices = [
  {
    quote:
      'My daughter sings with confidence now. The discipline here is real, but the environment is so encouraging.',
    who: 'Priya S.',
    role: 'Parent',
  },
  {
    quote:
      'I started at 35 knowing almost nothing. The structure made Carnatic music accessible and exciting.',
    who: 'Ravi K.',
    role: 'Adult learner',
  },
  {
    quote:
      'Complex ragas are explained so clearly. Every class gives me practical, usable progress.',
    who: 'Lakshmi N.',
    role: 'Intermediate student',
  },
]

const locations = ['Yelahanka New Town', 'Yelahanka Old Town', 'Jakkur', 'Sahakara Nagar', 'Hebbal', 'Vidyaranyapura']

function getSystemTheme() {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem(THEME_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return getSystemTheme()
}

function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function Index({ signed_in }) {
  const portalHref = signed_in ? '/dashboard' : '/users/sign_in'
  const portalLabel = signed_in ? 'Dashboard' : 'Student Login'

  const [theme, setTheme] = useState(getInitialTheme)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.style.colorScheme = theme
    window.localStorage.setItem(THEME_KEY, theme)

    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#0f1729' : '#f5ede1')
    }
  }, [theme])

  useEffect(() => {
    const hasStoredTheme = window.localStorage.getItem(THEME_KEY)
    if (hasStoredTheme === 'light' || hasStoredTheme === 'dark') return undefined

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (event) => setTheme(event.matches ? 'dark' : 'light')
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    const onEsc = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [])

  const navLinks = useMemo(
    () => [
      { href: '#programs', label: 'Programs', external: true },
      { href: '#about', label: 'About', external: true },
      { href: '/gallery', label: 'Gallery', external: false },
      { href: '#contact', label: 'Contact', external: true },
    ],
    []
  )

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <>
      <Head title="Shree Sangeetha Aalaya - Carnatic Music, Yelahanka">
        <meta
          name="description"
          content="Carnatic vocal and flute training for all ages in Yelahanka and online. Book a free demo class at Shree Sangeetha Aalaya."
        />
      </Head>

      <div className="home-page">
        <a href="#main" className="home-skip-link">
          Skip to content
        </a>

        <header className={`home-nav ${scrolled ? 'is-scrolled' : ''}`}>
          <div className="home-shell home-nav-inner">
            <Link href="/" className="home-brand" aria-label="Shree Sangeetha Aalaya home">
              <span className="home-brand-badge">श</span>
              <div>
                <p className="home-brand-title">Shree Sangeetha Aalaya</p>
                <p className="home-brand-sub">Carnatic music institution</p>
              </div>
            </Link>

            <nav className="home-nav-links" aria-label="Main">
              {navLinks.map((item) =>
                item.external ? (
                  <a key={item.label} href={item.href} className="home-nav-link">
                    {item.label}
                  </a>
                ) : (
                  <Link key={item.label} href={item.href} className="home-nav-link">
                    {item.label}
                  </Link>
                )
              )}
            </nav>

            <div className="home-nav-actions">
              <button
                type="button"
                className="home-theme-toggle"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              >
                <span aria-hidden="true">{theme === 'dark' ? 'Light' : 'Dark'}</span>
              </button>
              <Link href={portalHref} className="home-btn home-btn-solid home-nav-cta">
                {portalLabel}
              </Link>
              <button type="button" className="home-menu-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu">
                <span />
                <span />
                <span />
              </button>
            </div>
          </div>
        </header>

        <AnimatePresence>
          {menuOpen && (
            <motion.aside
              className="home-mobile-menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button type="button" className="home-mobile-close" onClick={closeMenu} aria-label="Close menu">
                X
              </button>

              <div className="home-mobile-links">
                {navLinks.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.06 * index }}
                  >
                    {item.external ? (
                      <a href={item.href} className="home-mobile-link" onClick={closeMenu}>
                        {item.label}
                      </a>
                    ) : (
                      <Link href={item.href} className="home-mobile-link" onClick={closeMenu}>
                        {item.label}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="home-mobile-footer">
                <button type="button" className="home-theme-toggle" onClick={toggleTheme}>
                  Theme: {theme === 'dark' ? 'Dark' : 'Light'}
                </button>
                <Link href={portalHref} className="home-btn home-btn-solid" onClick={closeMenu}>
                  {portalLabel}
                </Link>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <main id="main">
          <section className="home-hero" id="top">
            <div className="home-hero-glow" aria-hidden="true" />
            <div className="home-shell home-hero-grid">
              <Reveal className="home-hero-copy">
                <p className="home-kicker">Yelahanka, Bengaluru and online</p>
                <h1>
                  Carnatic training with
                  <span>discipline, artistry, and joy.</span>
                </h1>
                <p className="home-hero-text">
                  From first swaras to stage confidence, we offer guided vocal and flute learning tracks for children,
                  teenagers, and adults.
                </p>
                <div className="home-hero-actions">
                  <a href="#contact" className="home-btn home-btn-solid">
                    Book Free Demo
                  </a>
                  <a href="#programs" className="home-btn home-btn-ghost">
                    Explore Programs
                  </a>
                </div>
                <div className="home-stats" role="list" aria-label="School highlights">
                  {[
                    ['100+', 'Active students'],
                    ['15+', 'Years of teaching'],
                    ['4', 'Core programs'],
                    ['2', 'Learning modes'],
                  ].map(([value, label]) => (
                    <div key={label} className="home-stat" role="listitem">
                      <p className="home-stat-value">{value}</p>
                      <p className="home-stat-label">{label}</p>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={0.1} className="home-hero-panel-wrap">
                <aside className="home-hero-panel" aria-label="Founder profile">
                  <p className="home-panel-kicker">Founded by</p>
                  <h2>Vibha Shree M S</h2>
                  <p>
                    Vidwat in Carnatic Music with years of training and teaching across India and international student
                    communities.
                  </p>
                  <ul>
                    <li>Structured curriculum and progress milestones</li>
                    <li>Live feedback in every session</li>
                    <li>Performance-first mentorship model</li>
                  </ul>
                </aside>
              </Reveal>
            </div>
          </section>

          <section id="programs" className="home-section home-programs">
            <div className="home-shell">
              <Reveal>
                <p className="home-kicker">Programs</p>
              </Reveal>
              <Reveal delay={0.06}>
                <h2 className="home-section-title">
                  Four clear pathways for
                  <span> measurable musical growth</span>
                </h2>
              </Reveal>

              <div className="home-program-grid">
                {programs.map((program, index) => (
                  <Reveal key={program.num} delay={0.08 * index}>
                    <article className="home-program-card">
                      <p className="home-program-num">{program.num}</p>
                      <p className="home-program-age">{program.age}</p>
                      <h3>{program.title}</h3>
                      <p>{program.body}</p>
                      <ul>
                        {program.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section id="about" className="home-section home-why">
            <div className="home-shell">
              <Reveal>
                <p className="home-kicker">Why families choose us</p>
              </Reveal>
              <Reveal delay={0.06}>
                <h2 className="home-section-title">
                  A serious school with
                  <span> a warm teaching culture</span>
                </h2>
              </Reveal>

              <div className="home-why-grid">
                {whyData.map((item, index) => (
                  <Reveal key={item.title} delay={0.06 * index}>
                    <article className="home-why-card">
                      <h3>{item.title}</h3>
                      <p>{item.body}</p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section className="home-section home-voices">
            <div className="home-shell">
              <Reveal>
                <p className="home-kicker">Student voices</p>
              </Reveal>
              <Reveal delay={0.06}>
                <h2 className="home-section-title">
                  Outcomes that people
                  <span> can feel and hear</span>
                </h2>
              </Reveal>

              <div className="home-voice-grid">
                {voices.map((voice, index) => (
                  <Reveal key={voice.who} delay={0.08 * index}>
                    <article className="home-voice-card">
                      <p className="home-quote-mark">&ldquo;</p>
                      <p className="home-voice-quote">{voice.quote}</p>
                      <div className="home-voice-author">
                        <p>{voice.who}</p>
                        <span>{voice.role}</span>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section className="home-section home-location">
            <div className="home-shell">
              <Reveal>
                <div className="home-location-card">
                  <div>
                    <p className="home-kicker">Learning locations</p>
                    <h2>Yelahanka and beyond</h2>
                    <p>
                      Prestige Monte Carlo, Yelahanka, Bengaluru - 560064. Online classes available across India and
                      globally.
                    </p>
                  </div>

                  <div className="home-location-tags" role="list" aria-label="Service areas">
                    {locations.map((area) => (
                      <span key={area} role="listitem">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          <section id="contact" className="home-section home-contact">
            <div className="home-shell home-contact-grid">
              <Reveal>
                <p className="home-kicker">Get in touch</p>
                <h2 className="home-section-title">
                  Book your free demo
                  <span> and get a personalized learning path</span>
                </h2>
                <p className="home-contact-copy">
                  Tell us your current level, age group, and time preference. We will recommend the best starting batch.
                </p>
                <div className="home-hero-actions">
                  <a href="https://wa.me/919019382225" target="_blank" rel="noopener noreferrer" className="home-btn home-btn-solid">
                    WhatsApp Us
                  </a>
                  <a href="mailto:learnmusicwithvibhashree@gmail.com" className="home-btn home-btn-ghost">
                    Email Us
                  </a>
                </div>
              </Reveal>

              <Reveal delay={0.12}>
                <div className="home-contact-list" aria-label="Contact options">
                  <a href="tel:+919019382225" className="home-contact-item">
                    <span aria-hidden="true">tel</span>
                    <div>
                      <strong>+91 90193 82225</strong>
                      <p>Phone and WhatsApp</p>
                    </div>
                  </a>
                  <a href="mailto:learnmusicwithvibhashree@gmail.com" className="home-contact-item">
                    <span aria-hidden="true">mail</span>
                    <div>
                      <strong>learnmusicwithvibhashree@gmail.com</strong>
                      <p>Primary communication email</p>
                    </div>
                  </a>
                  <div className="home-contact-item home-contact-item-static">
                    <span aria-hidden="true">map</span>
                    <div>
                      <strong>Prestige Monte Carlo, Yelahanka</strong>
                      <p>Bengaluru - 560064</p>
                    </div>
                  </div>
                  <Link href={portalHref} className="home-btn home-btn-ghost home-contact-portal">
                    {signed_in ? 'Open Dashboard' : 'Student Portal Login'}
                  </Link>
                </div>
              </Reveal>
            </div>
          </section>
        </main>

        <footer className="home-footer">
          <div className="home-shell home-footer-inner">
            <div className="home-footer-brand">
              <span className="home-brand-badge">श</span>
              <p>(c) {new Date().getFullYear()} Shree Sangeetha Aalaya</p>
            </div>
            <div className="home-footer-links">
              <a href="#programs">Programs</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
              <Link href="/gallery">Gallery</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
