import { Head, Link } from '@inertiajs/react'
import Layout from '@components/Layout'
import { Progress, EmptyState } from '@components/UI'

const icons = {
  courses: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  ),
  batches: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  attendance: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  payment: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  calendar: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  arrowRight: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  ),
  clock: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  play: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  download: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
}

const quickLinks = [
  { title: 'My Courses', href: '/student/courses', icon: icons.courses, color: 'var(--app-info)' },
  { title: 'Schedule', href: '/student/schedule', icon: icons.calendar, color: 'var(--app-success)' },
  { title: 'Resources', href: '/student/learning_resources', icon: icons.play, color: '#6852a5' },
  { title: 'Payments', href: '/student/payments', icon: icons.payment, color: 'var(--app-warning)' },
]

export default function StudentDashboard({
  stats = {},
  batches = [],
  upcoming_classes = [],
  recent_resources = [],
  upcoming_payments = []
}) {
  const {
    enrolled_courses = 0,
    total_batches = 0,
    attendance_percentage = 0,
    pending_fee = 0,
    completed_classes = 0,
    total_classes = 0
  } = stats

  const progressPercentage = total_classes > 0 ? Math.round((completed_classes / total_classes) * 100) : 0
  const circumference = 2 * Math.PI * 52
  const strokeDasharray = `${(progressPercentage / 100) * circumference} ${circumference}`

  return (
    <Layout>
      <Head title="Student Dashboard – Shree Sangeetha Aalaya" />

      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div
          className="rounded-2xl px-5 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          style={{ background: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--shadow-card)' }}
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold" style={{ color: 'var(--app-text)' }}>
              My Dashboard
            </h1>
            <p className="mt-0.5 text-sm" style={{ color: 'var(--app-text-muted)' }}>
              Track progress, classes, resources &amp; payments.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl" style={{ background: 'var(--app-brand-soft)', color: 'var(--app-brand)' }}>
            {icons.clock}
            <span className="font-medium">
              {new Date().toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Enrolled Courses', value: enrolled_courses, icon: icons.courses, color: 'var(--app-info)' },
            { title: 'Active Batches', value: total_batches, icon: icons.batches, color: 'var(--app-success)' },
            { title: 'Attendance', value: `${attendance_percentage}%`, icon: icons.attendance, color: attendance_percentage >= 75 ? 'var(--app-success)' : 'var(--app-warning)' },
            { title: 'Pending Fee', value: `₹${(pending_fee || 0).toLocaleString('en-IN')}`, icon: icons.payment, color: pending_fee > 0 ? 'var(--app-danger)' : 'var(--app-success)' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="rounded-2xl border p-5 hover-lift"
              style={{ background: 'var(--app-surface)', borderColor: 'var(--app-border)', boxShadow: 'var(--shadow-card)' }}
            >
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `color-mix(in srgb, ${stat.color} 15%, transparent)`, color: stat.color }}
              >
                {stat.icon}
              </div>
              <div className="text-2xl font-bold mb-0.5" style={{ color: 'var(--app-text)', letterSpacing: '-0.02em' }}>
                {stat.value}
              </div>
              <div className="text-xs font-medium" style={{ color: 'var(--app-text-muted)' }}>{stat.title}</div>
            </div>
          ))}
        </div>

        {/* Low attendance alert */}
        {attendance_percentage < 75 && attendance_percentage > 0 && (
          <div
            className="rounded-2xl border p-4 flex items-center gap-3 animate-slide-up"
            style={{
              background: 'color-mix(in srgb, var(--app-warning) 10%, var(--app-surface))',
              borderColor: 'color-mix(in srgb, var(--app-warning) 35%, var(--app-border))'
            }}
          >
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'color-mix(in srgb, var(--app-warning) 18%, transparent)', color: 'var(--app-warning)' }}
            >
              {icons.warning}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--app-text)' }}>Low Attendance Alert</p>
              <p className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
                Your attendance is {attendance_percentage}% — below the 75% minimum. Please attend more classes.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* My Batches */}
            <div
              className="rounded-2xl border overflow-hidden"
              style={{ background: 'var(--app-surface)', borderColor: 'var(--app-border)', boxShadow: 'var(--shadow-card)' }}
            >
              <div className="px-5 py-4 flex items-center justify-between border-b" style={{ borderColor: 'var(--app-border)' }}>
                <h2 className="text-base font-semibold" style={{ color: 'var(--app-text)' }}>My Batches</h2>
                <Link href="/student/batches" className="flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--app-brand)' }}>
                  View all {icons.arrowRight}
                </Link>
              </div>
              <div>
                {batches && batches.length > 0 ? (
                  batches.map((batch) => (
                    <Link
                      key={batch.id}
                      href={`/student/batches/${batch.id}`}
                      className="flex items-center justify-between px-5 py-3.5 border-b transition-colors"
                      style={{ borderColor: 'var(--app-border)' }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: 'var(--app-brand-soft)', color: 'var(--app-brand)' }}
                        >
                          {icons.batches}
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: 'var(--app-text)' }}>{batch.name}</p>
                          <p className="text-xs" style={{ color: 'var(--app-text-muted)' }}>{batch.course_name}</p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--app-text-soft)' }}>{batch.teacher_name}</p>
                        </div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <span
                          className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold"
                          style={{ background: 'color-mix(in srgb, var(--app-success) 14%, transparent)', color: 'var(--app-success)' }}
                        >
                          {batch.status || 'Active'}
                        </span>
                        <p className="text-xs mt-1" style={{ color: 'var(--app-text-soft)' }}>{batch.schedule}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <EmptyState
                    icon={icons.batches}
                    title="No batches enrolled"
                    description="You haven't been enrolled in any batches yet."
                    action={
                      <Link href="/student/courses" className="btn-primary btn-sm">Browse Courses</Link>
                    }
                    className="py-10"
                  />
                )}
              </div>
            </div>

            {/* Upcoming Classes */}
            <div
              className="rounded-2xl border overflow-hidden"
              style={{ background: 'var(--app-surface)', borderColor: 'var(--app-border)', boxShadow: 'var(--shadow-card)' }}
            >
              <div className="px-5 py-4 flex items-center justify-between border-b" style={{ borderColor: 'var(--app-border)' }}>
                <h2 className="text-base font-semibold" style={{ color: 'var(--app-text)' }}>Upcoming Classes</h2>
                <Link href="/student/schedule" className="flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--app-brand)' }}>
                  Full schedule {icons.arrowRight}
                </Link>
              </div>
              <div>
                {upcoming_classes && upcoming_classes.length > 0 ? (
                  upcoming_classes.slice(0, 4).map((cls, idx) => (
                    <div key={idx} className="flex items-center gap-4 px-5 py-3.5 border-b" style={{ borderColor: 'var(--app-border)' }}>
                      <div
                        className="h-12 w-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
                        style={{ background: 'var(--app-surface-soft)', border: '1px solid var(--app-border)' }}
                      >
                        <span className="text-sm font-bold" style={{ color: 'var(--app-text)' }}>
                          {new Date(cls.class_date).getDate()}
                        </span>
                        <span className="text-[10px] uppercase" style={{ color: 'var(--app-text-soft)' }}>
                          {new Date(cls.class_date).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: 'var(--app-text)' }}>
                          {cls.topic || cls.batch_name}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
                          {cls.class_time} · {cls.teacher_name}
                        </p>
                      </div>
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold flex-shrink-0"
                        style={{ background: 'color-mix(in srgb, var(--app-info) 14%, transparent)', color: 'var(--app-info)' }}
                      >
                        {cls.class_type || 'Class'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center text-sm" style={{ color: 'var(--app-text-muted)' }}>
                    No upcoming classes scheduled.
                  </div>
                )}
              </div>
            </div>

            {/* Recent Resources */}
            <div
              className="rounded-2xl border overflow-hidden"
              style={{ background: 'var(--app-surface)', borderColor: 'var(--app-border)', boxShadow: 'var(--shadow-card)' }}
            >
              <div className="px-5 py-4 flex items-center justify-between border-b" style={{ borderColor: 'var(--app-border)' }}>
                <h2 className="text-base font-semibold" style={{ color: 'var(--app-text)' }}>Recent Learning Resources</h2>
                <Link href="/student/learning_resources" className="flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--app-brand)' }}>
                  View all {icons.arrowRight}
                </Link>
              </div>
              <div>
                {recent_resources && recent_resources.length > 0 ? (
                  recent_resources.slice(0, 3).map((resource) => (
                    <Link
                      key={resource.id}
                      href={`/student/learning_resources/${resource.id}`}
                      className="flex items-center gap-4 px-5 py-3.5 border-b transition-colors"
                      style={{ borderColor: 'var(--app-border)' }}
                    >
                      <div
                        className="h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'color-mix(in srgb, #6852a5 14%, transparent)', color: '#6852a5' }}
                      >
                        {resource.resource_type === 'video' ? icons.play : icons.download}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: 'var(--app-text)' }}>{resource.title}</p>
                        <p className="text-xs capitalize" style={{ color: 'var(--app-text-muted)' }}>{resource.resource_type}</p>
                      </div>
                      {resource.is_new && (
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0"
                          style={{ background: 'var(--app-brand-soft)', color: 'var(--app-brand)' }}
                        >
                          NEW
                        </span>
                      )}
                    </Link>
                  ))
                ) : (
                  <div className="py-10 text-center text-sm" style={{ color: 'var(--app-text-muted)' }}>
                    No learning resources assigned yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Quick Access */}
            <div
              className="rounded-2xl border p-5"
              style={{ background: 'var(--app-surface)', borderColor: 'var(--app-border)', boxShadow: 'var(--shadow-card)' }}
            >
              <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--app-text)' }}>Quick Access</h2>
              <div className="grid grid-cols-2 gap-2.5">
                {quickLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    className="flex flex-col items-center justify-center rounded-xl border p-3.5 text-center transition-all duration-200 hover-lift"
                    style={{ borderColor: 'var(--app-border)', background: 'var(--app-surface-soft)' }}
                  >
                    <div
                      className="h-9 w-9 rounded-xl flex items-center justify-center mb-2"
                      style={{ background: `color-mix(in srgb, ${link.color} 14%, transparent)`, color: link.color }}
                    >
                      {link.icon}
                    </div>
                    <span className="text-xs font-semibold" style={{ color: 'var(--app-text)' }}>{link.title}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Course Progress (circular) */}
            <div
              className="rounded-2xl border p-5"
              style={{ background: 'var(--app-surface)', borderColor: 'var(--app-border)', boxShadow: 'var(--shadow-card)' }}
            >
              <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--app-text)' }}>Course Progress</h2>
              <div className="flex items-center justify-center py-2">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60" cy="60" r="52"
                      fill="none"
                      stroke="var(--app-surface-soft)"
                      strokeWidth="10"
                    />
                    <circle
                      cx="60" cy="60" r="52"
                      fill="none"
                      stroke="url(#progressGradient)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={strokeDasharray}
                      style={{ transition: 'stroke-dasharray 0.8s ease' }}
                    />
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ed7612" />
                        <stop offset="100%" stopColor="#ca8a04" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold" style={{ color: 'var(--app-text)' }}>{progressPercentage}%</span>
                    <span className="text-[10px]" style={{ color: 'var(--app-text-soft)' }}>complete</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-center mt-2" style={{ color: 'var(--app-text-muted)' }}>
                {completed_classes} of {total_classes} classes completed
              </p>
            </div>

            {/* Attendance Summary */}
            <div
              className="rounded-2xl border p-5"
              style={{ background: 'var(--app-surface)', borderColor: 'var(--app-border)', boxShadow: 'var(--shadow-card)' }}
            >
              <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--app-text)' }}>Attendance</h2>
              <div className="text-center py-1">
                <div className="text-4xl font-bold mb-2" style={{ color: 'var(--app-text)', letterSpacing: '-0.03em' }}>
                  {attendance_percentage}%
                </div>
                <Progress
                  value={attendance_percentage}
                  color={attendance_percentage >= 75 ? 'success' : 'warning'}
                />
                <p className="text-xs mt-2" style={{ color: 'var(--app-text-muted)' }}>
                  {attendance_percentage >= 75 ? 'Great attendance! Keep it up.' : 'Try to improve attendance above 75%'}
                </p>
              </div>
            </div>

            {/* Upcoming Payments */}
            {upcoming_payments && upcoming_payments.length > 0 && (
              <div
                className="rounded-2xl border p-5"
                style={{ background: 'var(--app-surface)', borderColor: 'color-mix(in srgb, var(--app-warning) 30%, var(--app-border))', boxShadow: 'var(--shadow-card)' }}
              >
                <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--app-text)' }}>Upcoming Payments</h2>
                <div className="space-y-2">
                  {upcoming_payments.slice(0, 2).map((payment, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                      style={{ borderColor: 'var(--app-border)' }}
                    >
                      <span className="text-xs" style={{ color: 'var(--app-text-muted)' }}>{payment.description}</span>
                      <span className="text-sm font-bold" style={{ color: 'var(--app-warning)' }}>₹{payment.amount}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/student/payments"
                  className="block text-center mt-3 text-xs font-semibold"
                  style={{ color: 'var(--app-brand)' }}
                >
                  View Payment History →
                </Link>
              </div>
            )}

            {/* CTA */}
            <div
              className="rounded-2xl p-5 text-white"
              style={{ background: 'linear-gradient(135deg, var(--app-brand), var(--app-brand-strong))', boxShadow: 'var(--shadow-glow)' }}
            >
              <h2 className="text-base font-semibold mb-1">Need Help?</h2>
              <p className="text-sm opacity-80 mb-4">Questions about your course or schedule?</p>
              <Link
                href="/student/profile"
                className="block w-full py-2 rounded-lg text-xs font-semibold text-center"
                style={{ background: 'rgba(255,255,255,0.2)' }}
              >
                Contact Teacher
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
