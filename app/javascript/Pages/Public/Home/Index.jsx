import { Head, Link } from '@inertiajs/react'
import { motion } from 'framer-motion'

const programs = [
  {
    title: 'Carnatic Vocal for Kids',
    details: 'Age 5-12',
    points: ['Swaras and sruti basics', 'Playful, structured lessons', 'Weekend and weekday batches']
  },
  {
    title: 'Voice Culture Training',
    details: '3-6 Month Track',
    points: ['Breath and tone control', 'Pitch stability drills', 'Beginner-friendly progression']
  },
  {
    title: 'Advanced Vocal Mentorship',
    details: 'Intermediate to Advanced',
    points: ['Raga alapana depth work', 'Tala precision practice', 'Concert-ready coaching']
  },
  {
    title: 'Carnatic Flute Classes',
    details: 'Beginner to Advanced',
    points: ['Embouchure and airflow', 'Raga and composition study', 'One-on-one and group formats']
  }
]

const reasons = [
  'Vidwat-trained guidance and personalized feedback',
  'Online and offline options with flexible timings',
  'Convenient location at Prestige Monte Carlo, Yelahanka',
  'Pathways for children, teens, and adults',
  'Performance-focused training with steady progress tracking',
  'Supportive community and long-term musical discipline'
]

const nearbyAreas = ['Yelahanka New Town', 'Yelahanka Old Town', 'Jakkur', 'Sahakara Nagar', 'Hebbal', 'Vidyaranyapura']

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function Index({ signed_in, user_role }) {
  const roleLabel = user_role ? `${user_role.charAt(0).toUpperCase()}${user_role.slice(1)}` : null
  const portalHref = signed_in ? '/dashboard' : '/users/sign_in'
  const portalLabel = signed_in ? 'Open Dashboard' : 'Student Login'

  return (
    <>
      <Head title="Carnatic Music Classes in Yelahanka" />

      <div className="relative overflow-hidden bg-[#f7f1e8] text-gray-900">
        <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-primary-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-28 h-80 w-80 rounded-full bg-gold-300/30 blur-3xl" />
        <div className="pointer-events-none absolute left-1/3 top-[36rem] h-72 w-72 rounded-full bg-accent-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-6 sm:px-7 md:pb-24 md:pt-8">
          <motion.header
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mb-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 backdrop-blur sm:px-5"
          >
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-xl font-bold text-white shadow-lg shadow-primary-700/20">
                श
              </div>
              <div>
                <p className="font-display text-xl font-semibold leading-tight">Shree Sangeetha Aalaya</p>
                <p className="text-xs tracking-wide text-gray-600">Carnatic Music Institution</p>
              </div>
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <a href="#programs" className="btn btn-ghost btn-sm">Programs</a>
              <Link href="/gallery" className="btn btn-ghost btn-sm">Gallery</Link>
              <a href="#contact" className="btn btn-outline btn-sm">Free Demo</a>
              <Link href={portalHref} className="btn btn-primary btn-sm">{signed_in ? 'Dashboard' : 'Sign In'}</Link>
            </div>
          </motion.header>

          <section className="mb-12 grid gap-8 lg:mb-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="rounded-3xl border border-[#eadfce] bg-gradient-to-br from-[#fff9f0] via-[#fff5e6] to-[#f6efe2] p-7 shadow-[0_15px_35px_-24px_rgba(52,35,8,0.6)] md:p-10"
            >
              <p className="mb-5 inline-flex rounded-full border border-primary-300 bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary-700">
                Yelahanka, Bangalore
              </p>
              <h1 className="mb-5 font-display text-4xl font-semibold leading-tight md:text-6xl">
                Learn Carnatic Vocal and Flute with Depth, Discipline, and Joy.
              </h1>
              <p className="mb-8 max-w-2xl text-base text-gray-700 md:text-lg">
                Build strong classical foundations through mentor-led, structured training. We offer online and offline classes, from beginner-friendly batches to advanced performance preparation.
              </p>
              <div className="mb-8 flex flex-wrap gap-3">
                <a href="#contact" className="btn btn-primary">Book Free Demo</a>
                <a href="#programs" className="btn btn-outline">Explore Programs</a>
                <Link href={portalHref} className="btn btn-ghost">{portalLabel}</Link>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard value="100+" label="Students Trained" />
                <StatCard value="15+" label="Years Experience" />
                <StatCard value="Online" label="Global Learning" />
                <StatCard value="Offline" label="Yelahanka Center" />
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              transition={{ duration: 0.65, delay: 0.12 }}
              className="flex flex-col gap-4"
            >
              <div className="relative overflow-hidden rounded-3xl border border-amber-200/80 bg-[#1f1a15] p-6 text-amber-50 shadow-[0_18px_40px_-22px_rgba(0,0,0,0.9)] md:p-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(250,204,21,0.22),transparent_40%),radial-gradient(circle_at_90%_90%,rgba(245,158,11,0.28),transparent_35%)]" />
                <div className="relative">
                  <p className="mb-3 text-xs uppercase tracking-[0.2em] text-amber-200">Founder Spotlight</p>
                  <h2 className="mb-2 font-display text-3xl font-semibold">Vibha Shree M S</h2>
                  <p className="mb-4 text-sm text-amber-100">Founder and Music Director</p>
                  <p className="text-sm leading-relaxed text-amber-50/90">
                    Vidwat in Carnatic Music, with extensive teaching experience across India and international student communities.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 md:p-7">
                <p className="mb-2 text-sm font-semibold text-emerald-800">
                  {signed_in ? `Signed in${roleLabel ? ` as ${roleLabel}` : ''}.` : 'Student Portal Access'}
                </p>
                <p className="mb-4 text-sm text-emerald-700">
                  {signed_in
                    ? 'Continue to your dashboard to view schedule, attendance, resources, and payments.'
                    : 'Login is optional for visitors. Use it when you want access to your classes and progress.'}
                </p>
                <Link href={portalHref} className="btn btn-primary btn-sm">{signed_in ? 'Continue' : 'Login to Portal'}</Link>
              </div>
            </motion.div>
          </section>

          <motion.section
            id="programs"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ staggerChildren: 0.08 }}
            className="mb-14 lg:mb-20"
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="mb-6 sm:mb-8">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">Programs</p>
              <h2 className="font-display text-3xl font-semibold sm:text-4xl">Carnatic Learning Paths</h2>
            </motion.div>
            <div className="grid gap-4 sm:grid-cols-2">
              {programs.map((program) => (
                <motion.article
                  key={program.title}
                  variants={fadeUp}
                  transition={{ duration: 0.5 }}
                  className="rounded-2xl border border-[#eadfce] bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <p className="mb-2 text-xs uppercase tracking-[0.16em] text-primary-700">{program.details}</p>
                  <h3 className="mb-3 text-2xl font-semibold">{program.title}</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {program.points.map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <span className="mt-1 block h-2 w-2 rounded-full bg-primary-500" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </motion.article>
              ))}
            </div>
          </motion.section>

          <section className="mb-14 grid gap-5 rounded-3xl border border-[#e3d6c1] bg-[#fffaf2] p-6 md:grid-cols-2 md:p-8 lg:mb-20">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">Why Families Choose Us</p>
              <h2 className="mb-4 font-display text-3xl font-semibold">A serious school with a warm culture</h2>
              <p className="text-sm text-gray-700">
                We focus on clear fundamentals, regular accountability, and long-term artistry. Students get a system they can trust.
              </p>
            </div>
            <ul className="grid gap-3 text-sm text-gray-800 sm:grid-cols-2">
              {reasons.map((reason) => (
                <li key={reason} className="rounded-xl border border-amber-100 bg-white px-3 py-3">
                  {reason}
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-14 rounded-3xl border border-[#dbcdb6] bg-[#2b241d] px-6 py-8 text-amber-50 md:px-8 lg:mb-20">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">Areas We Serve</p>
            <div className="mb-5 flex flex-wrap gap-2">
              {nearbyAreas.map((area) => (
                <span key={area} className="rounded-full border border-amber-300/40 bg-amber-50/10 px-3 py-1 text-xs">
                  {area}
                </span>
              ))}
            </div>
            <p className="text-sm text-amber-100">
              Conveniently located at Prestige Monte Carlo, Yelahanka with online classes for students across India and abroad.
            </p>
          </section>

          <section id="contact" className="grid gap-6 rounded-3xl border border-primary-200 bg-gradient-to-br from-white to-primary-50 p-6 md:grid-cols-2 md:p-8">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-700">Contact</p>
              <h2 className="mb-3 font-display text-3xl font-semibold">Book your free demo class</h2>
              <p className="mb-6 text-sm text-gray-700">
                Share your learning goals and preferred schedule. We will suggest the best starting path for you.
              </p>

              <div className="space-y-3 text-sm text-gray-800">
                <a href="tel:+919019382225" className="block rounded-xl border border-primary-100 bg-white px-4 py-3 hover:border-primary-300">
                  Phone: +91 90193 82225
                </a>
                <a href="mailto:learnmusicwithvibhashree@gmail.com" className="block rounded-xl border border-primary-100 bg-white px-4 py-3 hover:border-primary-300">
                  Email: learnmusicwithvibhashree@gmail.com
                </a>
                <a href="https://wa.me/919019382225" target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-primary-100 bg-white px-4 py-3 hover:border-primary-300">
                  WhatsApp: Chat instantly
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-white bg-white p-5 shadow-sm">
              <h3 className="mb-2 text-xl font-semibold">Student Portal</h3>
              <p className="mb-4 text-sm text-gray-600">
                Existing students can sign in for attendance, schedules, resources, and payment tracking.
              </p>
              <div className="mb-5 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                <p><span className="font-semibold">Address:</span> Prestige Monte Carlo, Yelahanka, Bangalore, Karnataka 560064</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href={portalHref} className="btn btn-primary">{portalLabel}</Link>
                <Link href="/gallery" className="btn btn-outline">View Gallery</Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

function StatCard({ value, label }) {
  return (
    <div className="rounded-xl border border-[#e8dcc9] bg-white px-3 py-3 text-center shadow-sm">
      <p className="font-display text-2xl font-semibold leading-tight text-primary-700">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-wide text-gray-600">{label}</p>
    </div>
  )
}
