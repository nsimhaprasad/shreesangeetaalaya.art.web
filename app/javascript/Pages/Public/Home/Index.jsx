import { Head, Link } from '@inertiajs/react'
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect, useCallback } from 'react'

/* ═══════════════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════════════ */

const programs = [
  {
    num: '01',
    title: 'Carnatic Vocal\nfor Kids',
    age: 'Ages 5–12',
    body: 'Playful yet disciplined first steps into sruti, swara, and rhythm. Weekend & weekday batches available.',
    bullets: ['Swaras & sruti basics', 'Structured play-based lessons', 'Weekend & weekday batches'],
  },
  {
    num: '02',
    title: 'Voice Culture\nTraining',
    age: '3–6 month track',
    body: 'Systematic breath work, tone shaping, and pitch precision for absolute beginners of any age.',
    bullets: ['Breath & tone control', 'Pitch stability drills', 'Beginner-friendly arc'],
  },
  {
    num: '03',
    title: 'Advanced Vocal\nMentorship',
    age: 'Intermediate+',
    body: 'Deep raga exploration, tala mastery, and concert-stage readiness with personalised mentoring.',
    bullets: ['Raga alapana depth', 'Tala precision', 'Performance coaching'],
  },
  {
    num: '04',
    title: 'Carnatic Flute\nClasses',
    age: 'All levels',
    body: 'Embouchure, airflow, raga study, and composition — individual and small-group formats.',
    bullets: ['Embouchure & airflow', 'Raga & composition', 'Solo & group formats'],
  },
]

const whyData = [
  ['Vidwat-certified faculty', 'with 15+ years of teaching experience across age groups.'],
  ['Online & offline flexibility', '— learn from Yelahanka or anywhere in the world.'],
  ['Performance-focused path', '— clear milestones from first swara to concert stage.'],
  ['All ages welcome', '— children, teenagers, working adults, and senior learners.'],
]

const voices = [
  { q: 'My daughter sings with a confidence I never expected. The discipline here is wrapped in warmth.', who: 'Priya S.', ctx: 'Parent' },
  { q: 'I started at 35 knowing nothing. Structured mentoring made Carnatic music accessible and joyful.', who: 'Ravi K.', ctx: 'Adult learner' },
  { q: 'Vibha ma\'am explains complex ragas so simply. Every class feels like a revelation.', who: 'Lakshmi N.', ctx: 'Intermediate student' },
]

const locations = ['Yelahanka New Town', 'Yelahanka Old Town', 'Jakkur', 'Sahakara Nagar', 'Hebbal', 'Vidyaranyapura']

/* ═══════════════════════════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════════════════════════ */

function useWindowSize() {
  const [size, setSize] = useState({ w: typeof window !== 'undefined' ? window.innerWidth : 1200, h: typeof window !== 'undefined' ? window.innerHeight : 800 })
  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return size
}

/* ═══════════════════════════════════════════════════════════════════════════
   MICRO COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, y = 60, className = '', style = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}

function TextRevealLine({ text, delay = 0 }) {
  return (
    <span style={{ display: 'block', overflow: 'hidden' }}>
      <motion.span
        style={{ display: 'block' }}
        initial={{ y: '110%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {text}
      </motion.span>
    </span>
  )
}

function HorizontalRule({ dark = false }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        height: '1px',
        background: dark ? 'rgba(255,255,255,0.12)' : '#d6c4a8',
        transformOrigin: 'left',
      }}
    />
  )
}

function SectionNumber({ n, light = false }) {
  return (
    <span className="lp-sec-num" style={{ color: light ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.08)' }}>
      {n}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function Index({ signed_in, user_role }) {
  const portalHref = signed_in ? '/dashboard' : '/users/sign_in'
  const portalLabel = signed_in ? 'Dashboard' : 'Sign In'
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { w } = useWindowSize()
  const isMobile = w < 768

  const heroRef = useRef(null)
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroTextY = useTransform(heroProgress, [0, 1], ['0%', '25%'])
  const heroOpacity = useTransform(heroProgress, [0, 0.7], [1, 0])

  const programsRef = useRef(null)
  const { scrollYProgress: progProgress } = useScroll({ target: programsRef, offset: ['start end', 'end start'] })
  const progX = useTransform(progProgress, [0, 1], ['0%', '-20%'])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // close mobile menu on anchor click
  const nav = useCallback((e) => {
    setMenuOpen(false)
  }, [])

  return (
    <>
      <Head title="Shree Sangeetha Aalaya — Carnatic Music, Yelahanka" />

      {/* ── Inline styles with .lp- prefix ─────────────────────────────────── */}
      <style>{`
        /* ── Reset scoped to landing ── */
        .lp { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', system-ui, sans-serif; color: #1a1a2e; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
        .lp *, .lp *::before, .lp *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .lp a { text-decoration: none; color: inherit; }

        /* ── Typography ── */
        .lp-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .lp-sec-num { font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(5rem, 12vw, 11rem); font-weight: 300; line-height: 0.85; letter-spacing: -0.04em; user-select: none; pointer-events: none; }
        .lp-kicker { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.18em; }

        /* ── Widths ── */
        .lp-contain { max-width: 1260px; margin: 0 auto; padding: 0 clamp(20px, 4vw, 48px); }
        .lp-narrow { max-width: 680px; }
        .lp-wide   { max-width: 960px; }

        /* ── Nav ── */
        .lp-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; transition: all 400ms cubic-bezier(0.22,1,0.36,1); }
        .lp-nav-inner { display: flex; align-items: center; justify-content: space-between; padding: 20px clamp(20px,4vw,48px); max-width: 1260px; margin: 0 auto; }
        .lp-nav.is-scrolled { background: rgba(8,12,24,0.92); backdrop-filter: blur(24px) saturate(1.6); -webkit-backdrop-filter: blur(24px) saturate(1.6); }
        .lp-nav.is-scrolled .lp-nav-inner { padding-top: 12px; padding-bottom: 12px; }
        .lp-nav-brand { display: flex; align-items: center; gap: 10px; }
        .lp-nav-badge { width: 38px; height: 38px; border-radius: 10px; display: grid; place-items: center; font-size: 20px; font-weight: 700; color: #fff; background: linear-gradient(135deg, #d97706, #92400e); }
        .lp-nav-name { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.35rem; font-weight: 600; color: #fff; line-height: 1.1; }
        .lp-nav-sub { font-size: 0.6rem; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 1px; }
        .lp-nav-links { display: flex; gap: 6px; align-items: center; }
        .lp-nav-link { color: rgba(255,255,255,0.7); font-size: 0.82rem; font-weight: 500; padding: 6px 12px; border-radius: 6px; transition: all 200ms; letter-spacing: 0.01em; }
        .lp-nav-link:hover { color: #fff; background: rgba(255,255,255,0.08); }
        .lp-nav-cta { display: inline-flex; align-items: center; padding: 8px 20px; border-radius: 8px; font-size: 0.82rem; font-weight: 600; color: #fff; background: #c2410c; transition: all 200ms; }
        .lp-nav-cta:hover { background: #9a3412; }
        .lp-burger { display: none; background: none; border: none; cursor: pointer; padding: 6px; }
        .lp-burger span { display: block; width: 22px; height: 1.5px; background: #fff; margin: 5px 0; border-radius: 1px; transition: all 250ms; }

        /* ── Mobile overlay ── */
        .lp-mob-overlay { position: fixed; inset: 0; z-index: 999; background: #080c18; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0; }
        .lp-mob-close { position: absolute; top: 18px; right: 20px; background: none; border: none; color: rgba(255,255,255,0.6); font-size: 1.6rem; cursor: pointer; padding: 8px; }
        .lp-mob-link { font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(2rem,6vw,3.2rem); font-weight: 500; color: rgba(255,255,255,0.5); padding: 10px 0; transition: color 250ms; letter-spacing: -0.02em; }
        .lp-mob-link:hover { color: #fff; }

        /* ── HERO ── */
        .lp-hero { position: relative; min-height: 100svh; display: flex; align-items: flex-end; overflow: hidden; padding: 0 0 clamp(60px,10vh,120px); background: #050a14; }
        .lp-hero-bg { position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 30% 30%, rgba(180,68,9,0.25), transparent), radial-gradient(ellipse 60% 50% at 85% 20%, rgba(217,119,6,0.15), transparent), radial-gradient(ellipse 50% 60% at 70% 80%, rgba(88,28,135,0.12), transparent), linear-gradient(170deg, #0a0f1f 0%, #111827 50%, #1c0c04 100%); }
        .lp-hero-grain { position: absolute; inset: 0; opacity: 0.03; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size: 200px; }
        .lp-hero-content { position: relative; z-index: 2; width: 100%; }
        .lp-hero-top-line { width: 1px; height: 80px; background: linear-gradient(to bottom, transparent, rgba(217,119,6,0.5)); margin: 0 auto 40px; }
        .lp-hero-title { font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(3rem, 7.5vw, 7.5rem); font-weight: 400; line-height: 0.92; letter-spacing: -0.035em; color: #fff; margin-bottom: 32px; }
        .lp-hero-title em { font-style: italic; color: #f59e0b; }
        .lp-hero-desc { color: rgba(200,210,230,0.72); font-size: clamp(0.95rem,1.4vw,1.15rem); line-height: 1.7; max-width: 480px; margin-bottom: 40px; }
        .lp-hero-row { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
        .lp-btn-hero { display: inline-flex; align-items: center; gap: 8px; padding: 14px 32px; border-radius: 999px; font-size: 0.9rem; font-weight: 600; border: none; cursor: pointer; transition: all 250ms cubic-bezier(0.22,1,0.36,1); }
        .lp-btn-fill { background: linear-gradient(135deg, #d97706, #b45309); color: #fff; box-shadow: 0 0 0 0 rgba(217,119,6,0), 0 2px 16px -4px rgba(217,119,6,0.5); }
        .lp-btn-fill:hover { box-shadow: 0 0 0 4px rgba(217,119,6,0.15), 0 4px 24px -4px rgba(217,119,6,0.6); transform: translateY(-1px); }
        .lp-btn-ghost { background: transparent; color: rgba(255,255,255,0.75); border: 1px solid rgba(255,255,255,0.18); }
        .lp-btn-ghost:hover { color: #fff; border-color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.05); }

        /* ── Hero counters ── */
        .lp-counters { display: flex; gap: clamp(24px,4vw,56px); margin-top: 60px; padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.08); }
        .lp-counter-val { font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(2rem,3.5vw,3.4rem); font-weight: 300; color: #fde68a; line-height: 1; }
        .lp-counter-label { font-size: 0.68rem; color: rgba(200,210,230,0.5); text-transform: uppercase; letter-spacing: 0.12em; margin-top: 6px; }

        /* ── Hero side badge ── */
        .lp-hero-badge { position: absolute; right: clamp(20px,4vw,48px); top: 50%; transform: translateY(-50%); }
        .lp-hero-badge-inner { width: clamp(160px,18vw,260px); height: clamp(160px,18vw,260px); border-radius: 50%; border: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 4px; }
        .lp-hero-badge-icon { font-size: clamp(2rem,3vw,3.5rem); margin-bottom: 4px; }
        .lp-hero-badge-text { font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(0.9rem,1.3vw,1.2rem); color: rgba(255,255,255,0.6); line-height: 1.3; font-weight: 400; padding: 0 16px; }

        /* ── SECTION: programs horizontal scroll ── */
        .lp-prog-section { background: #fcfaf6; padding: clamp(80px,12vw,140px) 0; overflow: hidden; position: relative; }
        .lp-prog-track { display: flex; gap: clamp(16px,2vw,28px); padding: 40px 0 20px; }
        .lp-prog-card { flex-shrink: 0; width: clamp(300px,38vw,420px); border: 1px solid #e0d0b8; border-radius: 3px; background: #fff; padding: clamp(28px,3vw,40px); position: relative; transition: border-color 350ms, box-shadow 350ms; }
        .lp-prog-card:hover { border-color: #c2410c; box-shadow: 0 24px 64px -24px rgba(0,0,0,0.12); }
        .lp-prog-num { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 4.5rem; font-weight: 300; line-height: 0.8; color: #f3e8d4; position: absolute; top: 20px; right: 24px; }
        .lp-prog-age { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.16em; color: #c2410c; margin-bottom: 14px; }
        .lp-prog-title { font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(1.6rem,2.4vw,2.2rem); font-weight: 500; line-height: 1.12; color: #1a1a2e; margin-bottom: 14px; white-space: pre-line; }
        .lp-prog-body { color: #5a6275; font-size: 0.92rem; line-height: 1.65; margin-bottom: 20px; }
        .lp-prog-list { list-style: none; padding: 0; }
        .lp-prog-list li { font-size: 0.85rem; color: #3d4555; padding: 6px 0; border-top: 1px solid #f0e8dc; display: flex; align-items: center; gap: 8px; }
        .lp-prog-list li::before { content: ''; width: 4px; height: 4px; border-radius: 50%; background: #d97706; flex-shrink: 0; }

        /* ── SECTION: why us ── */
        .lp-why { background: #0f172a; color: #fff; padding: clamp(80px,12vw,140px) 0; position: relative; overflow: hidden; }
        .lp-why-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
        .lp-why-item { padding: clamp(28px,4vw,48px); border: 1px solid rgba(255,255,255,0.06); position: relative; }
        .lp-why-item::after { content: ''; position: absolute; bottom: 0; left: 24px; right: 24px; height: 1px; background: linear-gradient(90deg, transparent, rgba(217,119,6,0.2), transparent); }
        .lp-why-bold { font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(1.15rem,1.6vw,1.45rem); font-weight: 500; color: #fde68a; line-height: 1.35; display: inline; }
        .lp-why-rest { font-size: clamp(0.9rem,1.1vw,1rem); color: rgba(200,210,230,0.6); line-height: 1.6; display: inline; }

        /* ── SECTION: voices/testimonials ── */
        .lp-voices { background: #fcfaf6; padding: clamp(80px,12vw,140px) 0; }
        .lp-voice-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: clamp(16px,2vw,28px); margin-top: 56px; }
        .lp-voice-card { border: 1px solid #e0d0b8; border-radius: 3px; padding: clamp(24px,3vw,36px); background: #fff; display: flex; flex-direction: column; transition: border-color 350ms, transform 350ms; }
        .lp-voice-card:hover { border-color: #c2410c; transform: translateY(-3px); }
        .lp-voice-mark { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 4rem; line-height: 0.6; color: #e8d5b8; margin-bottom: 16px; }
        .lp-voice-q { font-size: 0.95rem; color: #3d4555; line-height: 1.72; flex: 1; font-style: italic; }
        .lp-voice-who { margin-top: 20px; padding-top: 16px; border-top: 1px solid #f0e8dc; }
        .lp-voice-name { font-weight: 600; color: #1a1a2e; font-size: 0.88rem; }
        .lp-voice-ctx { color: #8a94a6; font-size: 0.78rem; margin-top: 2px; }

        /* ── SECTION: location/areas ── */
        .lp-loc { background: #fcfaf6; padding: 0 0 clamp(80px,12vw,140px); }
        .lp-loc-banner { background: #1a1a2e; border-radius: 3px; padding: clamp(36px,5vw,64px); display: grid; grid-template-columns: 1fr 1fr; gap: clamp(24px,4vw,56px); align-items: center; }
        .lp-loc-title { font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(2rem,3.5vw,3.4rem); font-weight: 400; color: #fff; line-height: 1.1; letter-spacing: -0.02em; }
        .lp-loc-pills { display: flex; flex-wrap: wrap; gap: 8px; }
        .lp-loc-pill { padding: 8px 18px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.65); font-size: 0.82rem; font-weight: 500; transition: all 250ms; }
        .lp-loc-pill:hover { border-color: #d97706; color: #fde68a; background: rgba(217,119,6,0.08); }
        .lp-loc-address { font-size: 0.88rem; color: rgba(200,210,230,0.5); line-height: 1.6; margin-top: 20px; }

        /* ── SECTION: contact ── */
        .lp-contact { background: #050a14; color: #fff; padding: clamp(80px,12vw,140px) 0; position: relative; overflow: hidden; }
        .lp-contact-bg { position: absolute; inset: 0; background: radial-gradient(ellipse 60% 50% at 20% 60%, rgba(180,68,9,0.15), transparent), radial-gradient(ellipse 50% 50% at 80% 40%, rgba(88,28,135,0.1), transparent); }
        .lp-contact-split { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px,5vw,80px); position: relative; z-index: 2; }
        .lp-contact-title { font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(2.4rem,4.5vw,4.2rem); font-weight: 400; line-height: 1.05; letter-spacing: -0.03em; margin-bottom: 20px; }
        .lp-contact-desc { color: rgba(200,210,230,0.6); font-size: 0.95rem; line-height: 1.7; margin-bottom: 36px; max-width: 420px; }
        .lp-contact-row { display: flex; flex-wrap: wrap; gap: 10px; }
        .lp-link-bar { display: flex; align-items: center; gap: 14px; padding: 16px 20px; border: 1px solid rgba(255,255,255,0.08); border-radius: 3px; color: rgba(230,236,248,0.85); font-size: 0.9rem; transition: all 250ms; cursor: pointer; }
        .lp-link-bar:hover { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.04); transform: translateX(4px); }
        .lp-link-icon { width: 36px; height: 36px; border-radius: 8px; background: rgba(217,119,6,0.15); display: grid; place-items: center; font-size: 1rem; flex-shrink: 0; }
        .lp-contact-links { display: flex; flex-direction: column; gap: 10px; }

        /* ── Footer ── */
        .lp-footer { background: #050a14; border-top: 1px solid rgba(255,255,255,0.05); padding: 48px 0; }
        .lp-footer-inner { display: flex; justify-content: space-between; align-items: center; }
        .lp-footer-left { display: flex; align-items: center; gap: 12px; }
        .lp-footer-copy { font-size: 0.78rem; color: rgba(200,210,230,0.35); }
        .lp-footer-links { display: flex; gap: 20px; }
        .lp-footer-link { font-size: 0.78rem; color: rgba(200,210,230,0.45); transition: color 200ms; }
        .lp-footer-link:hover { color: #fff; }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .lp-why-grid { grid-template-columns: 1fr; }
          .lp-loc-banner { grid-template-columns: 1fr; }
          .lp-contact-split { grid-template-columns: 1fr; }
          .lp-hero-badge { display: none; }
        }
        @media (max-width: 768px) {
          .lp-nav-links, .lp-nav-cta { display: none; }
          .lp-burger { display: block; }
          .lp-hero { min-height: auto; padding: 120px 0 60px; align-items: flex-start; }
          .lp-counters { flex-wrap: wrap; gap: 20px; }
          .lp-counters > div { min-width: 100px; }
          .lp-voice-grid { grid-template-columns: 1fr; }
          .lp-footer-inner { flex-direction: column; gap: 16px; text-align: center; }
          .lp-footer-links { justify-content: center; }
        }
        @media (max-width: 480px) {
          .lp-hero-row { flex-direction: column; }
          .lp-hero-row a { width: 100%; justify-content: center; }
          .lp-hero-title { font-size: clamp(2.4rem,10vw,3.4rem); }
        }

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .lp *, .lp *::before, .lp *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      <div className="lp">

        {/* ══════════════ NAV ══════════════ */}
        <nav className={`lp-nav${scrolled ? ' is-scrolled' : ''}`}>
          <div className="lp-nav-inner">
            <Link href="/" className="lp-nav-brand">
              <span className="lp-nav-badge">श</span>
              <div>
                <div className="lp-nav-name">Shree Sangeetha Aalaya</div>
                <div className="lp-nav-sub">Est. Yelahanka</div>
              </div>
            </Link>

            <div className="lp-nav-links">
              <a href="#programs" className="lp-nav-link">Programs</a>
              <a href="#about" className="lp-nav-link">About</a>
              <Link href="/gallery" className="lp-nav-link">Gallery</Link>
              <a href="#contact" className="lp-nav-link">Contact</a>
              <Link href={portalHref} className="lp-nav-cta">{portalLabel}</Link>
            </div>

            <button className="lp-burger" onClick={() => setMenuOpen(true)} aria-label="Menu">
              <span /><span /><span />
            </button>
          </div>
        </nav>

        {/* ══════════════ MOBILE MENU ══════════════ */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="lp-mob-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <button className="lp-mob-close" onClick={() => setMenuOpen(false)} aria-label="Close">&#x2715;</button>
              {[
                { href: '#programs', label: 'Programs', ext: true },
                { href: '#about', label: 'About', ext: true },
                { href: '/gallery', label: 'Gallery', ext: false },
                { href: '#contact', label: 'Contact', ext: true },
              ].map(({ href, label, ext }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i, duration: 0.5, ease: [0.22,1,0.36,1] }}
                >
                  {ext
                    ? <a href={href} className="lp-mob-link" onClick={nav}>{label}</a>
                    : <Link href={href} className="lp-mob-link" onClick={nav}>{label}</Link>
                  }
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} style={{ marginTop: 24 }}>
                <Link href={portalHref} className="lp-btn-hero lp-btn-fill" onClick={nav}>{portalLabel}</Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══════════════ HERO ══════════════ */}
        <section className="lp-hero" ref={heroRef}>
          <div className="lp-hero-bg" />
          <div className="lp-hero-grain" />

          <motion.div className="lp-hero-content" style={{ y: heroTextY, opacity: heroOpacity }}>
            <div className="lp-contain">
              <motion.div
                className="lp-hero-top-line"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.22,1,0.36,1] }}
                style={{ transformOrigin: 'top' }}
              />

              <div className="lp-kicker" style={{ color: '#d97706', marginBottom: 28 }}>
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                  Carnatic Music &mdash; Yelahanka, Bangalore
                </motion.span>
              </div>

              <h1 className="lp-hero-title">
                <TextRevealLine text="Where tradition" delay={0.3} />
                <TextRevealLine text="meets the" delay={0.45} />
                <span style={{ display: 'block', overflow: 'hidden' }}>
                  <motion.span
                    style={{ display: 'block' }}
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <em>joy of learning.</em>
                  </motion.span>
                </span>
              </h1>

              <motion.p
                className="lp-hero-desc"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.7, ease: [0.22,1,0.36,1] }}
              >
                Carnatic vocal and flute training for all ages — from first swaras to concert stage.
                Learn in-person at Yelahanka or online from anywhere.
              </motion.p>

              <motion.div
                className="lp-hero-row"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                <a href="#contact" className="lp-btn-hero lp-btn-fill">Book a Free Demo</a>
                <a href="#programs" className="lp-btn-hero lp-btn-ghost">View Programs</a>
              </motion.div>

              <motion.div
                className="lp-counters"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                {[
                  { v: '100+', l: 'Students' },
                  { v: '15+', l: 'Years' },
                  { v: '4', l: 'Programs' },
                  { v: '2', l: 'Modes' },
                ].map(({ v, l }) => (
                  <div key={l}>
                    <div className="lp-counter-val">{v}</div>
                    <div className="lp-counter-label">{l}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Circular badge — desktop only */}
          {!isMobile && (
            <motion.div
              className="lp-hero-badge"
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 1.6, duration: 1, ease: [0.22,1,0.36,1] }}
            >
              <div className="lp-hero-badge-inner">
                <div className="lp-hero-badge-icon">श</div>
                <div className="lp-hero-badge-text">Founded by<br /><strong style={{ color: '#fde68a' }}>Vibha Shree M S</strong><br />Vidwat, Carnatic Music</div>
              </div>
            </motion.div>
          )}
        </section>

        {/* ══════════════ PROGRAMS — horizontal scroll ══════════════ */}
        <section id="programs" className="lp-prog-section" ref={programsRef}>
          <div className="lp-contain">
            <Reveal>
              <div className="lp-kicker" style={{ color: '#c2410c', marginBottom: 14 }}>Programs</div>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="lp-serif" style={{ fontSize: 'clamp(2.2rem,4.5vw,4rem)', fontWeight: 400, lineHeight: 1.06, letterSpacing: '-0.03em', color: '#1a1a2e' }}>
                Four paths, one purpose —<br />
                <span style={{ color: '#92400e' }}>your musical growth.</span>
              </h2>
            </Reveal>
          </div>

          {/* Horizontal cards track */}
          <motion.div className="lp-contain" style={{ overflow: 'visible' }}>
            <motion.div className="lp-prog-track" style={{ x: isMobile ? 0 : progX }}>
              {programs.map((p, i) => (
                <Reveal key={p.num} delay={i * 0.08} y={40}>
                  <div className="lp-prog-card">
                    <div className="lp-prog-num">{p.num}</div>
                    <div className="lp-prog-age">{p.age}</div>
                    <h3 className="lp-prog-title">{p.title}</h3>
                    <p className="lp-prog-body">{p.body}</p>
                    <ul className="lp-prog-list">
                      {p.bullets.map(b => <li key={b}>{b}</li>)}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ══════════════ WHY US ══════════════ */}
        <section id="about" className="lp-why">
          <div className="lp-contain">
            <Reveal>
              <div className="lp-kicker" style={{ color: '#d97706', marginBottom: 14 }}>Why us</div>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="lp-serif" style={{ fontSize: 'clamp(2.2rem,4.5vw,4rem)', fontWeight: 400, lineHeight: 1.06, letterSpacing: '-0.03em', color: '#fff', marginBottom: 48 }}>
                A serious school<br />with a <em style={{ fontStyle: 'italic', color: '#fde68a' }}>warm culture.</em>
              </h2>
            </Reveal>

            <div className="lp-why-grid">
              {whyData.map(([bold, rest], i) => (
                <Reveal key={i} delay={i * 0.06} y={30}>
                  <div className="lp-why-item">
                    <span className="lp-why-bold">{bold} </span>
                    <span className="lp-why-rest">{rest}</span>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Founder callout */}
            <Reveal delay={0.2} y={40}>
              <div style={{ marginTop: 64, display: 'flex', gap: 'clamp(24px,4vw,48px)', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #d97706, #92400e)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '2rem', color: '#fff', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>V</span>
                </div>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div className="lp-serif" style={{ fontSize: 'clamp(1.4rem,2vw,1.9rem)', color: '#fff', fontWeight: 500, lineHeight: 1.2, marginBottom: 6 }}>Vibha Shree M S</div>
                  <div style={{ fontSize: '0.82rem', color: 'rgba(200,210,230,0.5)', lineHeight: 1.6 }}>
                    Founder & Music Director — Vidwat in Carnatic Music with extensive teaching experience
                    across India and international student communities.
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════ VOICES ══════════════ */}
        <section className="lp-voices">
          <div className="lp-contain">
            <Reveal>
              <div className="lp-kicker" style={{ color: '#c2410c', marginBottom: 14 }}>Student voices</div>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="lp-serif" style={{ fontSize: 'clamp(2.2rem,4.5vw,4rem)', fontWeight: 400, lineHeight: 1.06, letterSpacing: '-0.03em', color: '#1a1a2e' }}>
                Hear from those who<br />
                <em style={{ fontStyle: 'italic', color: '#92400e' }}>walk the path.</em>
              </h2>
            </Reveal>

            <div className="lp-voice-grid">
              {voices.map((v, i) => (
                <Reveal key={v.who} delay={i * 0.1} y={30}>
                  <div className="lp-voice-card">
                    <div className="lp-voice-mark">&ldquo;</div>
                    <p className="lp-voice-q">{v.q}</p>
                    <div className="lp-voice-who">
                      <div className="lp-voice-name">{v.who}</div>
                      <div className="lp-voice-ctx">{v.ctx}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ LOCATION ══════════════ */}
        <section className="lp-loc">
          <div className="lp-contain">
            <Reveal>
              <div className="lp-loc-banner">
                <div>
                  <h2 className="lp-loc-title">Yelahanka &<br />beyond.</h2>
                  <p className="lp-loc-address">
                    Prestige Monte Carlo, Yelahanka, Bangalore — 560064<br />
                    Online classes for students across India &amp; abroad.
                  </p>
                </div>
                <div>
                  <div className="lp-loc-pills">
                    {locations.map(l => <span key={l} className="lp-loc-pill">{l}</span>)}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════════════ CONTACT ══════════════ */}
        <section id="contact" className="lp-contact">
          <div className="lp-contact-bg" />
          <div className="lp-contain">
            <div className="lp-contact-split">
              <Reveal>
                <div>
                  <div className="lp-kicker" style={{ color: '#d97706', marginBottom: 20 }}>Get in touch</div>
                  <h2 className="lp-contact-title">
                    Book your<br />free demo class.
                  </h2>
                  <p className="lp-contact-desc">
                    Share your learning goals and preferred schedule. We'll suggest the best starting path for you or your child.
                  </p>
                  <div className="lp-contact-row">
                    <a href="https://wa.me/919019382225" target="_blank" rel="noopener noreferrer" className="lp-btn-hero lp-btn-fill">WhatsApp Us</a>
                    <a href="mailto:learnmusicwithvibhashree@gmail.com" className="lp-btn-hero lp-btn-ghost">Send Email</a>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="lp-contact-links">
                  <a href="tel:+919019382225" className="lp-link-bar">
                    <span className="lp-link-icon">&#9742;</span>
                    +91 90193 82225
                  </a>
                  <a href="mailto:learnmusicwithvibhashree@gmail.com" className="lp-link-bar">
                    <span className="lp-link-icon">&#9993;</span>
                    learnmusicwithvibhashree@gmail.com
                  </a>
                  <a href="https://wa.me/919019382225" target="_blank" rel="noopener noreferrer" className="lp-link-bar">
                    <span className="lp-link-icon">&#128172;</span>
                    Chat on WhatsApp
                  </a>
                  <div className="lp-link-bar" style={{ cursor: 'default' }}>
                    <span className="lp-link-icon">&#128205;</span>
                    Prestige Monte Carlo, Yelahanka — 560064
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Link href={portalHref} className="lp-btn-hero lp-btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
                      {signed_in ? 'Open Dashboard' : 'Student Portal Login'}
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ══════════════ FOOTER ══════════════ */}
        <footer className="lp-footer">
          <div className="lp-contain">
            <div className="lp-footer-inner">
              <div className="lp-footer-left">
                <span className="lp-nav-badge" style={{ width: 28, height: 28, fontSize: 14, borderRadius: 6 }}>श</span>
                <span className="lp-footer-copy">&copy; {new Date().getFullYear()} Shree Sangeetha Aalaya</span>
              </div>
              <div className="lp-footer-links">
                <a href="#programs" className="lp-footer-link">Programs</a>
                <Link href="/gallery" className="lp-footer-link">Gallery</Link>
                <a href="#contact" className="lp-footer-link">Contact</a>
                <Link href={portalHref} className="lp-footer-link">Portal</Link>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
