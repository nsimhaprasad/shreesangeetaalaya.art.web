import { Head, Link } from '@inertiajs/react'
import Layout from '@components/Layout'
import { Card, StatCard, Button, Badge, Progress, Avatar, EmptyState } from '@components/UI'

const icons = {
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
  attendance: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  payment: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  calendar: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
  ),
  play: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  download: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  )
}

export default function StudentDashboard({ 
  stats = {}, 
  batches = [], 
  recent_attendance = [], 
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

  const quickLinks = [
    { title: 'My Courses', href: '/student/courses', icon: icons.courses, color: 'from-blue-500 to-blue-600' },
    { title: 'Schedule', href: '/student/schedule', icon: icons.calendar, color: 'from-green-500 to-green-600' },
    { title: 'Resources', href: '/student/learning_resources', icon: icons.play, color: 'from-purple-500 to-purple-600' },
    { title: 'Payments', href: '/student/payments', icon: icons.payment, color: 'from-gold-500 to-gold-600' }
  ]

  return (
    <Layout>
      <Head title="Dashboard" />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">My Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Track your musical journey progress</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {icons.clock}
            <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Enrolled Courses"
            value={enrolled_courses}
            icon={icons.courses}
          />
          <StatCard
            title="Active Batches"
            value={total_batches}
            icon={icons.batches}
          />
          <StatCard
            title="Attendance"
            value={`${attendance_percentage}%`}
            icon={icons.attendance}
          />
          <StatCard
            title="Pending Fee"
            value={`₹${pending_fee.toLocaleString('en-IN')}`}
            icon={icons.payment}
          />
        </div>

        {attendance_percentage < 75 && attendance_percentage > 0 && (
          <Card className="bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-200 rounded-lg text-amber-700">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-amber-900">Low Attendance Alert</p>
                <p className="text-sm text-amber-700">Your attendance is below 75%. Please attend more classes to maintain good standing.</p>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card padding={false}>
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">My Batches</h2>
                  <Link href="/student/batches" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                    View all {icons.arrowRight}
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {batches && batches.length > 0 ? (
                  batches.map((batch) => (
                    <Link
                      key={batch.id}
                      href={`/student/batches/${batch.id}`}
                      className="flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                          {icons.batches}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{batch.name}</h3>
                          <p className="text-sm text-gray-500">{batch.course_name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{batch.teacher_name}</p>
                        </div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <Badge variant="success">{batch.status || 'Active'}</Badge>
                        <p className="text-xs text-gray-500 mt-1">{batch.schedule}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <EmptyState
                    icon={icons.batches}
                    title="No batches enrolled"
                    description="You haven't been enrolled in any batches yet."
                    action={
                      <Link href="/student/courses" className="btn-primary">
                        Browse Courses
                      </Link>
                    }
                  />
                )}
              </div>
            </Card>

            <Card padding={false}>
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Upcoming Classes</h2>
                  <Link href="/student/schedule" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                    Full schedule {icons.arrowRight}
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
                        <p className="text-sm text-gray-500">{cls.class_time} • {cls.teacher_name}</p>
                      </div>
                      <Badge variant="info">{cls.class_type || 'Class'}</Badge>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No upcoming classes scheduled.
                  </div>
                )}
              </div>
            </Card>

            <Card padding={false}>
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Learning Resources</h2>
                  <Link href="/student/learning_resources" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                    View all {icons.arrowRight}
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {recent_resources && recent_resources.length > 0 ? (
                  recent_resources.slice(0, 3).map((resource) => (
                    <Link
                      key={resource.id}
                      href={`/student/learning_resources/${resource.id}`}
                      className="flex items-center gap-4 p-4 sm:p-5 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                        {resource.resource_type === 'video' ? icons.play : icons.download}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{resource.title}</h3>
                        <p className="text-sm text-gray-500 capitalize">{resource.resource_type}</p>
                      </div>
                      {resource.is_new && <Badge variant="primary">New</Badge>}
                    </Link>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No learning resources assigned yet.
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h2>
              <div className="grid grid-cols-2 gap-3">
                {quickLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-center"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${link.color} text-white flex items-center justify-center mb-2`}>
                      {link.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{link.title}</span>
                  </Link>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Progress</h2>
              <div className="text-center py-4">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64" cy="64" r="56"
                      fill="none"
                      stroke="#f3f4f6"
                      strokeWidth="12"
                    />
                    <circle
                      cx="64" cy="64" r="56"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${progressPercentage * 3.52} 352`}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ed7612" />
                        <stop offset="100%" stopColor="#ca8a04" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">{progressPercentage}%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{completed_classes} of {total_classes} classes completed</p>
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Attendance Summary</h2>
              <div className="text-center py-4">
                <div className="text-4xl font-bold text-gray-900 mb-2">{attendance_percentage}%</div>
                <Progress 
                  value={attendance_percentage} 
                  color={attendance_percentage >= 75 ? 'success' : 'warning'} 
                />
                <p className="text-sm text-gray-500 mt-2">
                  {attendance_percentage >= 75 ? 'Great attendance!' : 'Try to improve attendance'}
                </p>
              </div>
            </Card>

            {upcoming_payments && upcoming_payments.length > 0 && (
              <Card className="bg-gradient-to-br from-gold-50 to-white border-gold-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Upcoming Payments</h2>
                <div className="space-y-2">
                  {upcoming_payments.slice(0, 2).map((payment, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-gold-100 last:border-0">
                      <span className="text-sm text-gray-600">{payment.description}</span>
                      <span className="font-medium text-gray-900">₹{payment.amount}</span>
                    </div>
                  ))}
                </div>
                <Link 
                  href="/student/payments" 
                  className="block text-center mt-4 text-sm font-medium text-gold-700 hover:text-gold-800"
                >
                  View Payment History
                </Link>
              </Card>
            )}

            <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white">
              <h2 className="text-lg font-semibold mb-2">Need Help?</h2>
              <p className="text-primary-100 text-sm mb-4">Questions about your course or schedule? We're here to help.</p>
              <Link href="/student/profile" className="block w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium text-center transition-colors">
                Contact Teacher
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
