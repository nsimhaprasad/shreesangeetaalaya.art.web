import { Head, Link } from '@inertiajs/react'
import Layout from '@components/Layout'
import { Badge, Progress, Avatar, EmptyState } from '@components/UI'

const icons = {
  students: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  batches: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  calendar: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  attendance: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  payments: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
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
  warning: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
}

const quickActions = [
  { title: 'Mark Attendance', href: '/teacher/attendances', icon: icons.attendance, color: 'var(--app-brand)', label: 'Today\'s class' },
  { title: 'Add Student', href: '/teacher/students/new', icon: icons.students, color: 'var(--app-success)', label: 'New enrollment' },
  { title: 'Schedule Class', href: '/teacher/class_sessions/new', icon: icons.calendar, color: '#6852a5', label: 'New session' },
  { title: 'Record Payment', href: '/teacher/payments/new', icon: icons.payments, color: 'var(--app-warning)', label: 'Log payment' },
]

export default function TeacherDashboard({ stats = {}, batches = [], upcoming_classes = [], recent_payments = [] }) {
  const {
    total_students = 0,
    total_batches = 0,
    classes_today = 0,
    pending_attendance = 0,
    monthly_earnings = 0,
    attendance_rate = 0
  } = stats

  return (
    <Layout>
      <Head title="Teacher Dashboard – Shree Sangeetha Aalaya" />

      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div
          className="rounded-2xl px-5 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          style={{ background: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--shadow-card)' }}
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold" style={{ color: 'var(--app-text)' }}>
              Teacher Dashboard
            </h1>
            <p className="mt-0.5 text-sm" style={{ color: 'var(--app-text-muted)' }}>
              Welcome back. Here is your teaching overview.
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
            { title: 'My Students', value: total_students, icon: icons.students, color: 'var(--app-info)' },
            { title: 'Active Batches', value: total_batches, icon: icons.batches, color: 'var(--app-success)' },
            { title: 'Classes Today', value: classes_today, icon: icons.calendar, color: '#6852a5' },
            { title: 'Monthly Earnings', value: `₹${(monthly_earnings || 0).toLocaleString('en-IN')}`, icon: icons.payments, color: 'var(--app-warning)' },
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

        {/* Pending attendance alert */}
        {pending_attendance > 0 && (
          <div
            className="rounded-2xl border p-4 flex items-center justify-between animate-slide-up"
            style={{
              background: 'color-mix(in srgb, var(--app-warning) 10%, var(--app-surface))',
              borderColor: 'color-mix(in srgb, var(--app-warning) 35%, var(--app-border))'
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'color-mix(in srgb, var(--app-warning) 18%, transparent)', color: 'var(--app-warning)' }}
              >
                {icons.warning}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--app-text)' }}>Pending Attendance</p>
                <p className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
                  {pending_attendance} class{pending_attendance !== 1 ? 'es' : ''} need attendance marking
                </p>
              </div>
            </div>
            <Link href="/teacher/attendances" className="btn-primary btn-sm flex-shrink-0">
              Mark Now
            </Link>
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
                <Link href="/teacher/batches" className="flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--app-brand)' }}>
                  View all {icons.arrowRight}
                </Link>
              </div>
              <div>
                {batches.length > 0 ? (
                  batches.slice(0, 5).map((batch) => (
                    <Link
                      key={batch.id}
                      href={`/teacher/batches/${batch.id}`}
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
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold"
                          style={{ background: 'var(--app-brand-soft)', color: 'var(--app-brand)' }}
                        >
                          {batch.student_count || 0} students
                        </span>
                        <p className="text-xs mt-1" style={{ color: 'var(--app-text-soft)' }}>{batch.schedule}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <EmptyState
                    icon={icons.batches}
                    title="No batches assigned"
                    description="Batches will appear here once assigned by admin."
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
                <Link href="/teacher/class_sessions" className="flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--app-brand)' }}>
                  View schedule {icons.arrowRight}
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
                          {cls.class_time} · {cls.duration_minutes || 60} min
                        </p>
                      </div>
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold flex-shrink-0"
                        style={{
                          background: cls.status === 'scheduled'
                            ? 'color-mix(in srgb, var(--app-info) 14%, transparent)'
                            : 'color-mix(in srgb, var(--app-success) 14%, transparent)',
                          color: cls.status === 'scheduled' ? 'var(--app-info)' : 'var(--app-success)'
                        }}
                      >
                        {cls.status || 'scheduled'}
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
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Quick Actions */}
            <div
              className="rounded-2xl border p-5"
              style={{ background: 'var(--app-surface)', borderColor: 'var(--app-border)', boxShadow: 'var(--shadow-card)' }}
            >
              <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--app-text)' }}>Quick Actions</h2>
              <div className="grid grid-cols-2 gap-2.5">
                {quickActions.map((action, idx) => (
                  <Link
                    key={idx}
                    href={action.href}
                    className="flex flex-col items-center justify-center rounded-xl border p-3.5 text-center transition-all duration-200 hover-lift"
                    style={{ borderColor: 'var(--app-border)', background: 'var(--app-surface-soft)' }}
                  >
                    <div
                      className="h-9 w-9 rounded-xl flex items-center justify-center mb-2"
                      style={{ background: `color-mix(in srgb, ${action.color} 14%, transparent)`, color: action.color }}
                    >
                      {action.icon}
                    </div>
                    <span className="text-xs font-semibold" style={{ color: 'var(--app-text)' }}>{action.title}</span>
                    <span className="text-[10px]" style={{ color: 'var(--app-text-soft)' }}>{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Attendance Rate */}
            <div
              className="rounded-2xl border p-5"
              style={{ background: 'var(--app-surface)', borderColor: 'var(--app-border)', boxShadow: 'var(--shadow-card)' }}
            >
              <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--app-text)' }}>Attendance Rate</h2>
              <div className="text-center py-2">
                <div className="text-4xl font-bold mb-2" style={{ color: 'var(--app-text)', letterSpacing: '-0.03em' }}>
                  {attendance_rate}%
                </div>
                <Progress value={attendance_rate} color={attendance_rate >= 75 ? 'success' : 'warning'} />
                <p className="text-xs mt-2" style={{ color: 'var(--app-text-muted)' }}>
                  {attendance_rate >= 80 ? 'Excellent class attendance' : attendance_rate >= 65 ? 'Good attendance' : 'Needs improvement'}
                </p>
              </div>
            </div>

            {/* CTA */}
            <div
              className="rounded-2xl p-5 text-white"
              style={{ background: 'linear-gradient(135deg, var(--app-brand), var(--app-brand-strong))', boxShadow: 'var(--shadow-glow)' }}
            >
              <h2 className="text-base font-semibold mb-1">Need Help?</h2>
              <p className="text-sm opacity-80 mb-4">Questions about managing classes or students?</p>
              <Link
                href="/"
                className="block w-full py-2 rounded-lg text-xs font-semibold text-center"
                style={{ background: 'rgba(255,255,255,0.2)' }}
              >
                Go to Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
