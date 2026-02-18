import { Head, Link, useForm } from '@inertiajs/react'
import Layout from '@components/Layout'
import { useState } from 'react'

export default function BatchShow({ batch }) {
  const [showAddStudentModal, setShowAddStudentModal] = useState(false)
  const { delete: destroy } = useForm()

  const getStatusBadgeColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const handleRemoveStudent = (enrollmentId) => {
    if (confirm('Are you sure you want to remove this student from the batch?')) {
      destroy(`/teacher/batches/${batch.id}/batch_enrollments/${enrollmentId}`)
    }
  }

  return (
    <Layout>
      <Head title={batch.name} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/teacher/batches"
              className="text-blue-600 hover:text-blue-800 mb-2 inline-block"
            >
              ← Back to Batches
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{batch.name}</h1>
            <p className="text-gray-600 mt-1">{batch.course.name}</p>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`/teacher/batches/${batch.id}/edit`}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              Edit Batch
            </Link>
            <Link
              href="/teacher/class_sessions/new_recurring"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
            >
              Schedule Classes
            </Link>
          </div>
        </div>

        {/* Batch Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">Status</p>
            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                batch.status
              )}`}
            >
              {batch.status}
            </span>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">Class Type</p>
            <p className="mt-2 text-lg font-semibold text-gray-900">
              {batch.class_type === 'one_on_one' ? '1-on-1' : 'Group'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">Enrollment</p>
            <p className="mt-2 text-lg font-semibold text-gray-900">
              {batch.enrollment_count}
              {batch.max_students && ` / ${batch.max_students}`}
            </p>
            {batch.available_seats !== null && (
              <p className="text-xs text-gray-500 mt-1">
                {batch.available_seats} seats available
              </p>
            )}
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">Current Fee</p>
            <p className="mt-2 text-lg font-semibold text-green-700">
              {batch.fee_structure
                ? `₹${batch.fee_structure.amount}`
                : 'Not set'}
            </p>
            {batch.fee_structure && (
              <p className="text-xs text-gray-500 mt-1">
                {batch.fee_structure.fee_type}
              </p>
            )}
          </div>
        </div>

        {/* Batch Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Batch Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Teacher</p>
              <p className="mt-1 font-medium text-gray-900">{batch.teacher.name}</p>
              <p className="text-sm text-gray-500">{batch.teacher.specialization}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Schedule</p>
              <p className="mt-1 font-medium text-gray-900">
                {batch.schedule || 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Start Date</p>
              <p className="mt-1 font-medium text-gray-900">{batch.start_date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">End Date</p>
              <p className="mt-1 font-medium text-gray-900">
                {batch.end_date || 'Ongoing'}
              </p>
            </div>
            {batch.description && (
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Description</p>
                <p className="mt-1 text-gray-900">{batch.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Students Roster */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Students ({batch.students.length})
            </h2>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">
              + Add Student
            </button>
          </div>

          {batch.students.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No students enrolled yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enrollment Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {batch.students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {student.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{student.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{student.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {student.enrollment_date}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleRemoveStudent(student.enrollment_id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Upcoming Sessions
            </h2>
            <Link
              href="/teacher/class_sessions"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All Sessions →
            </Link>
          </div>

          {batch.upcoming_sessions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No upcoming sessions scheduled</p>
              <Link
                href={`/teacher/class_sessions/new?batch_id=${batch.id}`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
              >
                Schedule a Session
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {batch.upcoming_sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-md"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {session.topic || 'Class Session'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {session.class_date} at {session.class_time}
                      {session.duration_minutes &&
                        ` (${session.duration_minutes} mins)`}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                      session.status
                    )}`}
                  >
                    {session.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
