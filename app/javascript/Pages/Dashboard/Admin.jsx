import { Head, Link } from '@inertiajs/react'
import Layout from '@components/Layout'
import { Card, StatCard, Button, Badge, Progress, Avatar, EmptyState } from '@components/UI'

const icons = {
  students: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  teachers: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  courses: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  ),
  batches: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  payments: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  reports: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  settings: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  arrowRight: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  plus: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  clock: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

export default function AdminDashboard({ 
  stats = {}, 
  recent_students = [], 
  recent_payments = [],
  monthly_revenue = [],
  batch_performance = []
}) {
  const {
    total_students = 0,
    total_teachers = 0,
    total_courses = 0,
    total_batches = 0,
    active_students = 0,
    pending_payments = 0,
    monthly_earnings = 0,
    total_revenue = 0,
    attendance_rate = 0
  } = stats

  const quickActions = [
    { 
      title: 'Add Student', 
      href: '/admin/students/new', 
      icon: icons.plus,
      color: 'from-blue-500 to-blue-600'
    },
    { 
      title: 'Add Teacher', 
      href: '/admin/teachers/new', 
      icon: icons.plus,
      color: 'from-green-500 to-green-600'
    },
    { 
      title: 'Create Batch', 
      href: '/admin/batches/new', 
      icon: icons.plus,
      color: 'from-purple-500 to-purple-600'
    },
    { 
      title: 'Add Course', 
      href: '/admin/courses/new', 
      icon: icons.plus,
      color: 'from-gold-500 to-gold-600'
    }
  ]

  return (
    <Layout>
      <Head title="Admin Dashboard" />

      <div className="space-y-6">
        <div className="app-section flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--app-text-muted)' }}>Overview of your music institution</p>
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--app-text-muted)' }}>
            {icons.clock}
            <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Students"
            value={total_students}
            icon={icons.students}
            change={active_students > 0 ? `${active_students} active` : null}
            changeType="positive"
          />
          <StatCard
            title="Teachers"
            value={total_teachers}
            icon={icons.teachers}
          />
          <StatCard
            title="Active Batches"
            value={total_batches}
            icon={icons.batches}
          />
          <StatCard
            title="Monthly Revenue"
            value={`₹${monthly_earnings.toLocaleString('en-IN')}`}
            icon={icons.payments}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card padding={false}>
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Students</h2>
                  <Link href="/admin/students" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                    View all {icons.arrowRight}
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {recent_students && recent_students.length > 0 ? (
                  recent_students.slice(0, 5).map((student) => (
                    <Link
                      key={student.id}
                      href={`/admin/students/${student.id}`}
                      className="flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar name={student.name} size="md" src={student.avatar} />
                        <div>
                          <h3 className="font-medium text-gray-900">{student.name}</h3>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={student.status === 'active' ? 'success' : 'default'}>
                          {student.status || 'active'}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{student.enrolled_batches || 0} batches</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No students enrolled yet.
                  </div>
                )}
              </div>
            </Card>

            <Card padding={false}>
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>
                  <Link href="/admin/payments" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                    View all {icons.arrowRight}
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {recent_payments && recent_payments.length > 0 ? (
                  recent_payments.slice(0, 5).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 sm:p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                          {icons.payments}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{payment.student_name}</h3>
                          <p className="text-sm text-gray-500">{payment.payment_method}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₹{payment.amount?.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-gray-500">{payment.date}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No payments recorded yet.
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, idx) => (
                  <Link
                    key={idx}
                    href={action.href}
                    className="flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-colors hover:bg-gray-100"
                    style={{ borderColor: 'var(--app-border)' }}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} text-white flex items-center justify-center mb-2`}>
                      {action.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{action.title}</span>
                  </Link>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">This Month</span>
                  <span className="font-semibold text-gray-900">₹{monthly_earnings?.toLocaleString('en-IN') || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Total Revenue</span>
                  <span className="font-semibold text-gray-900">₹{total_revenue?.toLocaleString('en-IN') || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Pending</span>
                  <span className="font-semibold text-amber-600">₹{pending_payments?.toLocaleString('en-IN') || 0}</span>
                </div>
              </div>
              <Link 
                href="/admin/reports/earnings"
                className="block mt-4 text-center text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                View Detailed Reports
              </Link>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">System Stats</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500 text-sm">Overall Attendance</span>
                    <span className="text-sm font-medium">{attendance_rate}%</span>
                  </div>
                  <Progress value={attendance_rate} color="primary" size="sm" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500 text-sm">Active Students</span>
                    <span className="text-sm font-medium">{active_students}/{total_students}</span>
                  </div>
                  <Progress 
                    value={total_students > 0 ? (active_students / total_students) * 100 : 0} 
                    color="success" 
                    size="sm" 
                  />
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white">
              <h2 className="text-lg font-semibold mb-2">System Settings</h2>
              <p className="text-primary-100 text-sm mb-4">Configure fee structures, email templates, and more.</p>
              <div className="space-y-2">
                <Link 
                  href="/admin/fee_structures"
                  className="block w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium text-center transition-colors"
                >
                  Fee Management
                </Link>
                <Link 
                  href="/admin/gallery"
                  className="block w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium text-center transition-colors"
                >
                  Gallery Settings
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
