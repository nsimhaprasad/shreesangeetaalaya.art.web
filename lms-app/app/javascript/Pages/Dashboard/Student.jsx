import { Head, Link } from '@inertiajs/react'
import Layout from '@components/Layout'

export default function StudentDashboard({ stats = {}, batches = [], recent_attendance = [], upcoming_payments = [] }) {
  const {
    enrolled_courses = 0,
    total_batches = 0,
    attendance_percentage = 0,
    pending_fee = 0,
  } = stats

  const statCards = [
    { title: 'Enrolled Courses', value: enrolled_courses, icon: '📚', color: 'bg-blue-500' },
    { title: 'Active Batches', value: total_batches, icon: '👥', color: 'bg-green-500' },
    { title: 'Attendance', value: `${attendance_percentage}%`, icon: '📋', color: 'bg-purple-500' },
    { title: 'Pending Fee', value: `₹${pending_fee}`, icon: '💰', color: 'bg-yellow-500' },
  ]

  return (
    <Layout>
      <Head title="Student Dashboard" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">{card.value}</p>
                </div>
                <div className={`${card.color} rounded-full p-3 text-white text-2xl`}>
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">My Batches</h2>
            {batches.length > 0 ? (
              <div className="space-y-3">
                {batches.map((batch) => (
                  <div
                    key={batch.id}
                    className="p-4 bg-gray-50 rounded-md"
                  >
                    <h3 className="font-medium text-gray-900">{batch.name}</h3>
                    <p className="text-sm text-gray-600">{batch.course_name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Teacher: {batch.teacher_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Schedule: {batch.schedule}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">You are not enrolled in any batches yet.</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Links</h2>
            <div className="space-y-3">
              <Link
                href="/student/courses"
                className="block w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-md text-blue-700 font-medium transition-colors"
              >
                📚 My Courses
              </Link>
              <Link
                href="/student/attendances"
                className="block w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-md text-green-700 font-medium transition-colors"
              >
                📋 View Attendance
              </Link>
              <Link
                href="/student/learning_resources"
                className="block w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-md text-purple-700 font-medium transition-colors"
              >
                📖 Learning Resources
              </Link>
              <Link
                href="/student/payments"
                className="block w-full text-left px-4 py-3 bg-yellow-50 hover:bg-yellow-100 rounded-md text-yellow-700 font-medium transition-colors"
              >
                💰 Payment History
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
