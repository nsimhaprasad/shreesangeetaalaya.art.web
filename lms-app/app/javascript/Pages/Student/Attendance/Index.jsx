import { Head, Link, router } from '@inertiajs/react'
import Layout from '@components/Layout'
import { useState } from 'react'

const STATUS_COLORS = {
  present: 'bg-green-100 text-green-800 border-green-300',
  absent: 'bg-red-100 text-red-800 border-red-300',
  late: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  excused: 'bg-blue-100 text-blue-800 border-blue-300',
  not_marked: 'bg-gray-100 text-gray-600 border-gray-300'
}

const STATUS_ICONS = {
  present: '&#10004;',
  absent: '&#10008;',
  late: '&#9200;',
  excused: '&#9432;'
}

export default function StudentAttendanceIndex({
  batches = [],
  recent_attendances = [],
  stats = {}
}) {
  const [selectedBatch, setSelectedBatch] = useState('')
  const [filteredAttendances, setFilteredAttendances] = useState(recent_attendances)

  const handleBatchFilter = (e) => {
    const batchId = e.target.value
    setSelectedBatch(batchId)

    if (batchId === '') {
      setFilteredAttendances(recent_attendances)
    } else {
      const batch = batches.find(b => b.id === parseInt(batchId))
      setFilteredAttendances(
        recent_attendances.filter(att => att.batch_name === batch?.name)
      )
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    return STATUS_COLORS[status] || STATUS_COLORS.not_marked
  }

  const getPercentageColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600'
    if (percentage >= 75) return 'text-blue-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPercentageBarColor = (percentage) => {
    if (percentage >= 90) return 'bg-green-500'
    if (percentage >= 75) return 'bg-blue-500'
    if (percentage >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <Layout>
      <Head title="My Attendance" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">My Attendance</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Classes</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.total_classes || 0}</p>
          </div>

          <div className="bg-green-50 rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Present</h3>
            <p className="text-3xl font-bold text-green-600">{stats.present || 0}</p>
          </div>

          <div className="bg-red-50 rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Absent</h3>
            <p className="text-3xl font-bold text-red-600">{stats.absent || 0}</p>
          </div>

          <div className="bg-yellow-50 rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Late</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.late || 0}</p>
          </div>

          <div className="bg-blue-50 rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Attendance Rate</h3>
            <p className={`text-3xl font-bold ${getPercentageColor(stats.attendance_percentage || 0)}`}>
              {(stats.attendance_percentage || 0).toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall Attendance Progress</h2>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block text-gray-600">
                    {stats.present || 0} / {stats.total_classes || 0} classes attended
                  </span>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-semibold inline-block ${getPercentageColor(stats.attendance_percentage || 0)}`}>
                    {(stats.attendance_percentage || 0).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-gray-200">
                <div
                  style={{ width: `${stats.attendance_percentage || 0}%` }}
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getPercentageBarColor(stats.attendance_percentage || 0)}`}
                ></div>
              </div>
            </div>

            {stats.attendance_percentage < 75 && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-yellow-400">&#9888;</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Your attendance is below 75%. Please try to attend classes regularly to maintain good academic standing.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Attendance Records</h2>

            <div className="flex items-center gap-4">
              <select
                value={selectedBatch}
                onChange={handleBatchFilter}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Batches</option>
                {batches.map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredAttendances.length > 0 ? (
            <div className="space-y-3">
              {filteredAttendances.map((attendance) => (
                <div
                  key={attendance.id}
                  className={`border-2 rounded-lg p-4 ${getStatusColor(attendance.status)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {formatDate(attendance.date)}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusColor(attendance.status)}`}
                          dangerouslySetInnerHTML={{ __html: STATUS_ICONS[attendance.status] || '' }}
                        >
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusColor(attendance.status)}`}
                        >
                          {attendance.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600">
                          <strong>Batch:</strong> {attendance.batch_name}
                        </span>
                        <span className="text-gray-600">
                          <strong>Course:</strong> {attendance.course_name}
                        </span>
                      </div>

                      {attendance.notes && (
                        <div className="mt-2 text-sm text-gray-700">
                          <strong>Notes:</strong> {attendance.notes}
                        </div>
                      )}
                    </div>

                    <div className="text-right text-xs text-gray-500">
                      Marked: {new Date(attendance.marked_at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No attendance records found</p>
              <p className="text-sm mt-2">
                {selectedBatch
                  ? 'Try selecting a different batch or wait for your teacher to mark attendance'
                  : 'Your attendance records will appear here once your teacher marks them'}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Batch-wise Breakdown</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {batches.map((batch) => (
              <div key={batch.id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg text-gray-900">{batch.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{batch.course_name}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Classes attended:</span>
                    <span className="font-medium">
                      {recent_attendances.filter(a => a.batch_name === batch.name).length}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {batches.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>You are not enrolled in any batches yet.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
