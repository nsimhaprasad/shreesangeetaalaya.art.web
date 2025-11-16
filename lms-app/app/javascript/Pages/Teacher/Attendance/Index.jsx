import { Head, Link } from '@inertiajs/react'
import Layout from '@components/Layout'

export default function AttendanceIndex({ batches = [] }) {
  return (
    <Layout>
      <Head title="Attendance Management" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/teacher/attendances/mark_attendance"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md p-6 transition-colors"
          >
            <div className="text-4xl mb-2">&#128203;</div>
            <h3 className="text-xl font-semibold">Mark Attendance</h3>
            <p className="text-sm text-blue-100 mt-1">Quick mark for today's classes</p>
          </Link>

          <Link
            href="/teacher/attendances/calendar"
            className="bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md p-6 transition-colors"
          >
            <div className="text-4xl mb-2">&#128197;</div>
            <h3 className="text-xl font-semibold">Calendar View</h3>
            <p className="text-sm text-green-100 mt-1">View attendance calendar</p>
          </Link>

          <Link
            href="/teacher/attendances/report"
            className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg shadow-md p-6 transition-colors"
          >
            <div className="text-4xl mb-2">&#128202;</div>
            <h3 className="text-xl font-semibold">Reports</h3>
            <p className="text-sm text-purple-100 mt-1">Student attendance reports</p>
          </Link>

          <Link
            href="/teacher/class_sessions"
            className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-md p-6 transition-colors"
          >
            <div className="text-4xl mb-2">&#128197;</div>
            <h3 className="text-xl font-semibold">Class Sessions</h3>
            <p className="text-sm text-yellow-100 mt-1">Manage class sessions</p>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Batches</h2>

          {batches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {batches.map((batch) => (
                <div
                  key={batch.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
                >
                  <h3 className="font-semibold text-lg text-gray-900">{batch.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{batch.course_name}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {batch.student_count} student{batch.student_count !== 1 ? 's' : ''}
                  </p>

                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/teacher/attendances/mark_attendance?batch_id=${batch.id}`}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-2 rounded text-center transition-colors"
                    >
                      Mark Attendance
                    </Link>
                    <Link
                      href={`/teacher/attendances/report?batch_id=${batch.id}`}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white text-sm px-3 py-2 rounded text-center transition-colors"
                    >
                      View Report
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No batches assigned yet.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
