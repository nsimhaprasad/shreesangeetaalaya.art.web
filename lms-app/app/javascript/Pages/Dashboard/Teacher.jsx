import { Head, Link } from '@inertiajs/react'
import Layout from '@components/Layout'

export default function TeacherDashboard({ stats = {}, batches = [], upcoming_classes = [] }) {
  const {
    total_students = 0,
    total_batches = 0,
    classes_today = 0,
    pending_attendance = 0,
  } = stats

  const statCards = [
    { title: 'My Students', value: total_students, icon: '👨‍🎓', color: 'bg-blue-500' },
    { title: 'My Batches', value: total_batches, icon: '👥', color: 'bg-green-500' },
    { title: 'Classes Today', value: classes_today, icon: '📅', color: 'bg-purple-500' },
    { title: 'Pending Attendance', value: pending_attendance, icon: '📋', color: 'bg-yellow-500' },
  ]

  return (
    <Layout>
      <Head title="Teacher Dashboard" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
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
                  <Link
                    key={batch.id}
                    href={`/teacher/batches/${batch.id}`}
                    className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <h3 className="font-medium text-gray-900">{batch.name}</h3>
                    <p className="text-sm text-gray-600">
                      {batch.course_name} - {batch.student_count} students
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {batch.schedule}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No batches assigned yet.</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/teacher/attendances"
                className="block w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-md text-blue-700 font-medium transition-colors"
              >
                📋 Mark Attendance
              </Link>
              <Link
                href="/teacher/students"
                className="block w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-md text-green-700 font-medium transition-colors"
              >
                👨‍🎓 View All Students
              </Link>
              <Link
                href="/teacher/batches"
                className="block w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-md text-purple-700 font-medium transition-colors"
              >
                👥 View All Batches
              </Link>
              <Link
                href="/teacher/learning_resources"
                className="block w-full text-left px-4 py-3 bg-yellow-50 hover:bg-yellow-100 rounded-md text-yellow-700 font-medium transition-colors"
              >
                📖 Manage Resources
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
