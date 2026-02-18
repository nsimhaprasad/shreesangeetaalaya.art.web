import { Head, Link, router } from '@inertiajs/react'
import Layout from '@components/Layout'
import { useState } from 'react'

const STATUS_COLORS = {
  present: 'bg-green-500',
  absent: 'bg-red-500',
  late: 'bg-yellow-500',
  excused: 'bg-blue-500',
  partial: 'bg-orange-400',
  not_marked: 'bg-gray-200'
}

export default function AttendanceCalendar({
  batches = [],
  selected_batch_id = null,
  calendar_data = [],
  start_date = null,
  end_date = null
}) {
  const [selectedBatch, setSelectedBatch] = useState(selected_batch_id || '')
  const [startDate, setStartDate] = useState(start_date || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(end_date || new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0])

  const handleBatchChange = (e) => {
    const batchId = e.target.value
    setSelectedBatch(batchId)
    if (batchId) {
      router.get('/teacher/attendances/calendar', {
        batch_id: batchId,
        start_date: startDate,
        end_date: endDate
      })
    }
  }

  const handleDateRangeChange = () => {
    if (selectedBatch) {
      router.get('/teacher/attendances/calendar', {
        batch_id: selectedBatch,
        start_date: startDate,
        end_date: endDate
      })
    }
  }

  const getAttendanceColor = (data) => {
    if (data.marked === 0) return STATUS_COLORS.not_marked

    const presentPercentage = (data.present / data.marked) * 100

    if (presentPercentage === 100) return STATUS_COLORS.present
    if (presentPercentage === 0) return STATUS_COLORS.absent
    if (presentPercentage >= 75) return 'bg-green-400'
    if (presentPercentage >= 50) return STATUS_COLORS.partial
    if (presentPercentage >= 25) return 'bg-orange-500'
    return STATUS_COLORS.absent
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const goToCurrentMonth = () => {
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    setStartDate(firstDay.toISOString().split('T')[0])
    setEndDate(lastDay.toISOString().split('T')[0])

    if (selectedBatch) {
      router.get('/teacher/attendances/calendar', {
        batch_id: selectedBatch,
        start_date: firstDay.toISOString().split('T')[0],
        end_date: lastDay.toISOString().split('T')[0]
      })
    }
  }

  return (
    <Layout>
      <Head title="Attendance Calendar" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Attendance Calendar</h1>
          <Link
            href="/teacher/attendances"
            className="text-blue-600 hover:text-blue-800"
          >
            &larr; Back to Attendance
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Batch
              </label>
              <select
                value={selectedBatch}
                onChange={handleBatchChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select a batch --</option>
                {batches.map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch.name} ({batch.course_name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={handleDateRangeChange}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              >
                Apply Filter
              </button>
              <button
                onClick={goToCurrentMonth}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
              >
                Today
              </button>
            </div>
          </div>

          {selectedBatch && calendar_data.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <span className="font-medium">Legend:</span>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${STATUS_COLORS.present}`}></div>
                  <span>100% Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${STATUS_COLORS.partial}`}></div>
                  <span>Partial</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${STATUS_COLORS.absent}`}></div>
                  <span>Low/Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${STATUS_COLORS.not_marked}`}></div>
                  <span>Not Marked</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {calendar_data.map((session, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-lg p-4 ${getAttendanceColor(session)} bg-opacity-20`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {formatDate(session.date)}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getAttendanceColor(session)} text-white`}>
                        {session.attendance_percentage.toFixed(0)}%
                      </span>
                    </div>

                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Students:</span>
                        <span className="font-medium">{session.total_students}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Marked:</span>
                        <span className="font-medium">{session.marked} / {session.total_students}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 mt-2 pt-2 border-t border-gray-300">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-xs">Present: {session.present}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <span className="text-xs">Absent: {session.absent}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <span className="text-xs">Late: {session.late}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="text-xs">Excused: {session.excused}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <Link
                        href={`/teacher/attendances/mark_attendance?batch_id=${selectedBatch}&date=${session.date}`}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {session.marked > 0 ? 'Edit Attendance' : 'Mark Attendance'} &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedBatch && calendar_data.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No class sessions found for the selected date range</p>
              <p className="text-sm mt-2">Try selecting a different date range or create class sessions first</p>
            </div>
          )}

          {!selectedBatch && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">Please select a batch to view the attendance calendar</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
