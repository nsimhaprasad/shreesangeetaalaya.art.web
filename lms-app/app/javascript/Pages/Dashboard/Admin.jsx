import { Head, Link } from '@inertiajs/react'
import Layout from '@components/Layout'

export default function AdminDashboard({ stats = {} }) {
  const {
    total_students = 0,
    total_teachers = 0,
    total_courses = 0,
    total_batches = 0,
    active_students = 0,
    pending_payments = 0,
  } = stats

  const statCards = [
    { title: 'Total Students', value: total_students, icon: '👨‍🎓', color: 'bg-blue-500', link: '/admin/students' },
    { title: 'Total Teachers', value: total_teachers, icon: '👨‍🏫', color: 'bg-green-500', link: '/admin/teachers' },
    { title: 'Total Courses', value: total_courses, icon: '📚', color: 'bg-purple-500', link: '/admin/courses' },
    { title: 'Total Batches', value: total_batches, icon: '👥', color: 'bg-yellow-500', link: '/admin/batches' },
    { title: 'Active Students', value: active_students, icon: '✅', color: 'bg-indigo-500', link: '/admin/students' },
    { title: 'Pending Payments', value: pending_payments, icon: '💰', color: 'bg-red-500', link: '/admin/payments' },
  ]

  return (
    <Layout>
      <Head title="Admin Dashboard" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((card) => (
            <Link
              key={card.title}
              href={card.link}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">{card.value}</p>
                  </div>
                  <div className={`${card.color} rounded-full p-3 text-white text-3xl`}>
                    {card.icon}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/admin/students/new"
                className="block w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-md text-blue-700 font-medium transition-colors"
              >
                + Add New Student
              </Link>
              <Link
                href="/admin/teachers/new"
                className="block w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-md text-green-700 font-medium transition-colors"
              >
                + Add New Teacher
              </Link>
              <Link
                href="/admin/batches/new"
                className="block w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-md text-purple-700 font-medium transition-colors"
              >
                + Create New Batch
              </Link>
              <Link
                href="/admin/courses/new"
                className="block w-full text-left px-4 py-3 bg-yellow-50 hover:bg-yellow-100 rounded-md text-yellow-700 font-medium transition-colors"
              >
                + Add New Course
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <p className="text-gray-500 text-sm">No recent activity to display.</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
