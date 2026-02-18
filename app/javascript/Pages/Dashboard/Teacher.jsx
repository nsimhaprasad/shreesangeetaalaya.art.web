import { Head, Link } from '@inertiajs/react'
import Layout from '@components/Layout'
import { Card, StatCard, Button, Badge, Progress, Avatar } from '@components/UI'

const icons = {
  students: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  batches: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  calendar: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  attendance: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  arrowRight: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  clock: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

export default function TeacherDashboard({ stats = {}, batches = [], upcoming_classes = [], recent_payments = [] }) {
  const {
    total_students = 0,
    total_batches = 0,
    classes_today = 0,
    pending_attendance = 0,
    monthly_earnings = 0,
    attendance_rate = 0
  } = stats

  const quickActions = [
    { 
      title: 'Mark Attendance', 
      description: 'Record today\'s class attendance',
      href: '/teacher/attendances',
      icon: icons.attendance,
      color: 'from-primary-500 to-primary-600'
    },
    { 
      title: 'Add Student', 
      description: 'Enroll a new student',
      href: '/teacher/students/new',
      icon: icons.students,
      color: 'from-green-500 to-green-600'
    },
    { 
      title: 'Schedule Class', 
      description: 'Create a new class session',
      href: '/teacher/class_sessions/new',
      icon: icons.calendar,
      color: 'from-purple-500 to-purple-600'
    },
    { 
      title: 'Record Payment', 
      description: 'Log a student payment',
      href: '/teacher/payments/new',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'from-gold-500 to-gold-600'
    }
  ]

  return (
    <Layout>
      <Head title="Teacher Dashboard" />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {icons.clock}
            <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="My Students"
            value={total_students}
            icon={icons.students}
            className="bg-gradient-to-br from-blue-50 to-white"
          />
          <StatCard
            title="Active Batches"
            value={total_batches}
            icon={icons.batches}
            className="bg-gradient-to-br from-green-50 to-white"
          />
          <StatCard
            title="Classes Today"
            value={classes_today}
            icon={icons.calendar}
            className="bg-gradient-to-br from-purple-50 to-white"
          />
          <StatCard
            title="Monthly Earnings"
            value={`₹${monthly_earnings.toLocaleString('en-IN')}`}
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            className="bg-gradient-to-br from-gold-50 to-white"
          />
        </div>

        {pending_attendance > 0 && (
          <Card className="bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-200 rounded-lg text-amber-700">
                  {icons.attendance}
                </div>
                <div>
                  <p className="font-medium text-amber-900">Pending Attendance</p>
                  <p className="text-sm text-amber-700">{pending_attendance} classes need attendance marking</p>
                </div>
              </div>
              <Link href="/teacher/attendances" className="btn bg-amber-600 text-white hover:bg-amber-700">
                Mark Now
              </Link>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card padding={false}>
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">My Batches</h2>
                  <Link href="/teacher/batches" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                    View all {icons.arrowRight}
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {batches.length > 0 ? (
                  batches.slice(0, 5).map((batch) => (
                    <Link
                      key={batch.id}
                      href={`/teacher/batches/${batch.id}`}
                      className="flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                          {icons.batches}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{batch.name}</h3>
                          <p className="text-sm text-gray-500">{batch.course_name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="primary">{batch.student_count || 0} students</Badge>
                        <p className="text-xs text-gray-500 mt-1">{batch.schedule}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No batches assigned yet.
                  </div>
                )}
              </div>
            </Card>

            <Card padding={false}>
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Upcoming Classes</h2>
                  <Link href="/teacher/class_sessions" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                    View schedule {icons.arrowRight}
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {upcoming_classes && upcoming_classes.length > 0 ? (
                  upcoming_classes.slice(0, 4).map((cls, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 sm:p-5">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex flex-col items-center justify-center text-xs">
                        <span className="font-semibold text-gray-900">{new Date(cls.class_date).getDate()}</span>
                        <span className="text-gray-500">{new Date(cls.class_date).toLocaleDateString('en-US', { month: 'short' })}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{cls.topic || cls.batch_name}</h3>
                        <p className="text-sm text-gray-500">{cls.class_time} • {cls.duration_minutes || 60} min</p>
                      </div>
                      <Badge variant={cls.status === 'scheduled' ? 'info' : 'success'}>
                        {cls.status || 'scheduled'}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No upcoming classes scheduled.
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
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-center"
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
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Attendance Rate</h2>
              <div className="text-center py-4">
                <div className="text-4xl font-bold text-gray-900 mb-2">{attendance_rate}%</div>
                <Progress value={attendance_rate} color="primary" />
                <p className="text-sm text-gray-500 mt-2">Overall student attendance</p>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white">
              <h2 className="text-lg font-semibold mb-2">Need Help?</h2>
              <p className="text-primary-100 text-sm mb-4">Check out our guides or contact support for assistance.</p>
              <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
                View Documentation
              </button>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
