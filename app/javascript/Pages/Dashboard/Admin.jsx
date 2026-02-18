import { Head, Link } from '@inertiajs/react'
import Layout from '@components/Layout'
import { Card, StatCard, Badge, Progress, Avatar, EmptyState } from '@components/UI'

const icons = {
  students: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  teachers: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
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
  payments: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
  plus: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  ),
  trend: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
}

const quickActions = [
  { title: 'Add Student', href: '/admin/students/new', icon: icons.students, color: 'var(--app-info)', label: 'New enrollment' },
  { title: 'Add Teacher', href: '/admin/teachers/new', icon: icons.teachers, color: 'var(--app-success)', label: 'New staff' },
  { title: 'Create Batch', href: '/admin/batches/new', icon: icons.batches, color: '#6852a5', label: 'New batch' },
  { title: 'Add Course', href: '/admin/courses/new', icon: icons.courses, color: 'var(--app-warning)', label: 'New course' },
]

export default function AdminDashboard({
  stats = {},
  recent_students = [],
  recent_payments = [],
  batch_performance = []
}) {
  const {
    total_students = 0,
    total_teachers = 0,
    total_batches = 0,
    active_students = 0,
    pending_payments = 0,
    monthly_earnings = 0,
    total_revenue = 0,
    attendance_rate = 0
  } = stats

  return (
    <Layout>
      <Head title="Admin Dashboard – Shree Sangeetha Aalaya" />

      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div
          className="rounded-2xl px-5 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          style={{ background: 'var(--app-surface)', border: '1px solid var(--app-border)', boxShadow: 'var(--shadow-card)' }}
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold" style={{ color: 'var(--app-text)' }}>
              Admin Dashboard
            </h1>
            <p className="mt-0.5 text-sm" style={{ color: 'var(--app-text-muted)' }}>
              Overview of your music institution
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
            { title: 'Total Students', value: total_students, icon: icons.students, sub: `${active_students} active`, color: 'var(--app-info)' },
            { title: 'Teachers', value: total_teachers, icon: icons.teachers, sub: 'Staff members', color: 'var(--app-success)' },
            { title: 'Active Batches', value: total_batches, icon: icons.batches, sub: 'Running batches', color: '#6852a5' },
            { title: 'Monthly Revenue', value: `₹${(monthly_earnings || 0).toLocaleString('en-IN')}`, icon: icons.payments, sub: 'This month', color: 'var(--app-warning)' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="rounded-2xl border p-5 hover-lift"
              style={{
                background: 'var(--app-surface)',
                borderColor: 'var(--app-border)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center"
                  style={{ background: `color-mix(in srgb, ${stat.color} 15%, transparent)`, color: stat.color }}
                >
                  {stat.icon}
                </div>
                <span className="flex items-center gap-1 text-xs font-medium" style={{ color: 'var(--app-success)' }}>
                  {icons.trend}
                </span>
              </div>
              <div className="text-2xl font-bold mb-0.5" style={{ color: 'var(--app-text)', letterSpacing: '-0.02em' }}>
                {stat.value}
              </div>
              <div className="text-xs font-medium" style={{ color: 'var(--app-text-muted)' }}>{stat.title}</div>
              {stat.sub && (
                <div className="text-xs mt-1" style={{ color: 'var(--app-text-soft)' }}>{stat.sub}</div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Students */}
            <div
              className="rounded-2xl border overflow-hidden"
              style={{ background: 'var(--app-surface)', borderColor: 'var(--app-border)', boxShadow: 'var(--shadow-card)' }}
            >
              <div
                className="px-5 py-4 flex items-center justify-between border-b"
                style={{ borderColor: 'var(--app-border)' }}
              >
                <h2 className="text-base font-semibold" style={{ color: 'var(--app-text)' }}>Recent Students</h2>
                <Link
                  href="/admin/students"
                  className="flex items-center gap-1 text-xs font-semibold transition-colors"
                  style={{ color: 'var(--app-brand)' }}
                >
                  View all {icons.arrowRight}
                </Link>
              </div>
              <div>
                {recent_students.length > 0 ? (
                  recent_students.slice(0, 5).map((student) => (
                    <Link
                      key={student.id}
                      href={`/admin/students/${student.id}`}
                      className="flex items-center justify-between px-5 py-3.5 border-b transition-colors"
                      style={{ borderColor: 'var(--app-border)' }}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar name={student.name} size="md" src={student.avatar} />
                        <div>
                          <p className="text-sm font-semibold" style={{ color: 'var(--app-text)' }}>{student.name}</p>
                          <p className="text-xs" style={{ color: 'var(--app-text-muted)' }}>{student.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold"
                          style={{
                            background: student.status === 'active'
                              ? 'color-mix(in srgb, var(--app-success) 14%, transparent)'
                              : 'color-mix(in srgb, var(--app-text-muted) 14%, transparent)',
                            color: student.status === 'active' ? 'var(--app-success)' : 'var(--app-text-muted)'
                          }}
                        >
                          {student.status || 'active'}
                        </span>
                        <p className="text-xs mt-1" style={{ color: 'var(--app-text-soft)' }}>
                          {student.enrolled_batches || 0} batch{student.enrolled_batches !== 1 ? 'es' : ''}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <EmptyState
                    icon={icons.students}
                    title="No students yet"
                    description="Start by enrolling your first student."
                    action={
                      <Link href="/admin/students/new" className="btn-primary btn-sm">
                        Add Student
                      </Link>
                    }
                    className="py-10"
                  />
                )}
              </div>
            </div>

            {/* Recent Payments */}
            <div
              className="rounded-2xl border overflow-hidden"
              style={{ background: 'var(--app-surface)', borderColor: 'var(--app-border)', boxShadow: 'var(--shadow-card)' }}
            >
              <div
                className="px-5 py-4 flex items-center justify-between border-b"
                style={{ borderColor: 'var(--app-border)' }}
              >
                <h2 className="text-base font-semibold" style={{ color: 'var(--app-text)' }}>Recent Payments</h2>
                <Link
                  href="/admin/payments"
                  className="flex items-center gap-1 text-xs font-semibold transition-colors"
                  style={{ color: 'var(--app-brand)' }}
                >
                  View all {icons.arrowRight}
                </Link>
              </div>
              <div>
                {recent_payments.length > 0 ? (
                  recent_payments.slice(0, 5).map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between px-5 py-3.5 border-b"
                      style={{ borderColor: 'var(--app-border)' }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-10 w-10 rounded-xl flex items-center justify-center"
                          style={{ background: 'color-mix(in srgb, var(--app-success) 14%, transparent)', color: 'var(--app-success)' }}
                        >
                          {icons.payments}
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: 'var(--app-text)' }}>{payment.student_name}</p>
                          <p className="text-xs" style={{ color: 'var(--app-text-muted)' }}>{payment.payment_method}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold" style={{ color: 'var(--app-text)' }}>
                          ₹{payment.amount?.toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--app-text-soft)' }}>{payment.date}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center text-sm" style={{ color: 'var(--app-text-muted)' }}>
                    No payments recorded yet.
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
                    <span className="text-xs font-semibold block" style={{ color: 'var(--app-text)' }}>{action.title}</span>
                    <span className="text-[10px]" style={{ color: 'var(--app-text-soft)' }}>{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Revenue Overview */}
            <div
              className="rounded-2xl border p-5"
              style={{ background: 'var(--app-surface)', borderColor: 'var(--app-border)', boxShadow: 'var(--shadow-card)' }}
            >
              <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--app-text)' }}>Revenue Overview</h2>
              <div className="space-y-3">
                {[
                  { label: 'This Month', value: `₹${(monthly_earnings || 0).toLocaleString('en-IN')}`, color: 'var(--app-text)' },
                  { label: 'Total Revenue', value: `₹${(total_revenue || 0).toLocaleString('en-IN')}`, color: 'var(--app-success)' },
                  { label: 'Pending', value: `₹${(pending_payments || 0).toLocaleString('en-IN')}`, color: 'var(--app-warning)' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b last:border-0" style={{ borderColor: 'var(--app-border)' }}>
                    <span className="text-sm" style={{ color: 'var(--app-text-muted)' }}>{item.label}</span>
                    <span className="text-sm font-bold" style={{ color: item.color }}>{item.value}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/admin/reports/earnings"
                className="block mt-4 text-center text-xs font-semibold py-2 rounded-lg transition-colors"
                style={{ color: 'var(--app-brand)', background: 'var(--app-brand-soft)' }}
              >
                View Detailed Reports →
              </Link>
            </div>

            {/* System Stats */}
            <div
              className="rounded-2xl border p-5"
              style={{ background: 'var(--app-surface)', borderColor: 'var(--app-border)', boxShadow: 'var(--shadow-card)' }}
            >
              <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--app-text)' }}>System Stats</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium" style={{ color: 'var(--app-text-muted)' }}>Overall Attendance</span>
                    <span className="text-xs font-bold" style={{ color: 'var(--app-text)' }}>{attendance_rate}%</span>
                  </div>
                  <Progress value={attendance_rate} color="primary" size="sm" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium" style={{ color: 'var(--app-text-muted)' }}>Active Students</span>
                    <span className="text-xs font-bold" style={{ color: 'var(--app-text)' }}>
                      {active_students}/{total_students}
                    </span>
                  </div>
                  <Progress
                    value={total_students > 0 ? (active_students / total_students) * 100 : 0}
                    color="success"
                    size="sm"
                  />
                </div>
              </div>
            </div>

            {/* Settings shortcuts */}
            <div
              className="rounded-2xl p-5 text-white"
              style={{ background: 'linear-gradient(135deg, var(--app-brand), var(--app-brand-strong))', boxShadow: 'var(--shadow-glow)' }}
            >
              <h2 className="text-base font-semibold mb-1">Platform Settings</h2>
              <p className="text-sm opacity-80 mb-4">Configure fees, templates &amp; gallery.</p>
              <div className="space-y-2">
                <Link
                  href="/admin/fee_structures"
                  className="block w-full py-2 rounded-lg text-xs font-semibold text-center transition-colors"
                  style={{ background: 'rgba(255,255,255,0.18)' }}
                >
                  Fee Management
                </Link>
                <Link
                  href="/admin/gallery"
                  className="block w-full py-2 rounded-lg text-xs font-semibold text-center transition-colors"
                  style={{ background: 'rgba(255,255,255,0.18)' }}
                >
                  Gallery Settings
                </Link>
                <Link
                  href="/admin/email_templates"
                  className="block w-full py-2 rounded-lg text-xs font-semibold text-center transition-colors"
                  style={{ background: 'rgba(255,255,255,0.18)' }}
                >
                  Email Templates
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
