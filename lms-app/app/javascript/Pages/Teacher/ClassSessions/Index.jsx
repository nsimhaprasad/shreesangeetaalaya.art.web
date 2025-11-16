import { Head, Link, router } from '@inertiajs/react'
import Layout from '@components/Layout'
import { useState, useMemo } from 'react'

export default function ClassSessionsIndex({ sessions = [], batches = [], start_date, end_date }) {
  const [currentMonth, setCurrentMonth] = useState(new Date(start_date))
  const [view, setView] = useState('calendar') // 'calendar' or 'list'
  const [selectedBatch, setSelectedBatch] = useState('')

  // Navigate months
  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(currentMonth.getMonth() + direction)
    setCurrentMonth(newMonth)

    const newStartDate = new Date(newMonth.getFullYear(), newMonth.getMonth(), 1)
    const newEndDate = new Date(newMonth.getFullYear(), newMonth.getMonth() + 1, 0)

    router.get('/teacher/class_sessions', {
      start_date: newStartDate.toISOString().split('T')[0],
      end_date: newEndDate.toISOString().split('T')[0],
    })
  }

  // Get calendar days
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }, [currentMonth])

  // Group sessions by date
  const sessionsByDate = useMemo(() => {
    const grouped = {}
    sessions.forEach((session) => {
      if (!selectedBatch || session.batch_id === parseInt(selectedBatch)) {
        if (!grouped[session.class_date]) {
          grouped[session.class_date] = []
        }
        grouped[session.class_date].push(session)
      }
    })
    return grouped
  }, [sessions, selectedBatch])

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-blue-500',
      completed: 'bg-green-500',
      cancelled: 'bg-red-500',
      rescheduled: 'bg-yellow-500',
    }
    return colors[status] || 'bg-gray-500'
  }

  const formatDate = (date) => {
    return date.toISOString().split('T')[0]
  }

  const isToday = (date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  return (
    <Layout>
      <Head title="Class Sessions" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Class Sessions</h1>
          <div className="flex space-x-3">
            <Link
              href="/teacher/class_sessions/new_recurring"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
            >
              + Create Recurring
            </Link>
            <Link
              href="/teacher/class_sessions/new"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              + Schedule Session
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <label htmlFor="batch-filter" className="text-sm text-gray-600 mr-2">
                  Filter by Batch:
                </label>
                <select
                  id="batch-filter"
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Batches</option>
                  {batches.map((batch) => (
                    <option key={batch.value} value={batch.value}>
                      {batch.label} - {batch.course_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setView('calendar')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  view === 'calendar'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Calendar
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  view === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        {view === 'calendar' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigateMonth(-1)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md font-medium"
              >
                ← Previous
              </button>
              <h2 className="text-2xl font-semibold text-gray-900">
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <button
                onClick={() => navigateMonth(1)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md font-medium"
              >
                Next →
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="text-center font-semibold text-gray-600 py-2 text-sm"
                >
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {calendarDays.map((date, index) => {
                const dateStr = date ? formatDate(date) : null
                const daySessions = dateStr ? sessionsByDate[dateStr] || [] : []

                return (
                  <div
                    key={index}
                    className={`min-h-[100px] border rounded-md p-2 ${
                      date
                        ? isToday(date)
                          ? 'bg-blue-50 border-blue-300'
                          : 'bg-white border-gray-200'
                        : 'bg-gray-50'
                    }`}
                  >
                    {date && (
                      <>
                        <div className="text-sm font-medium text-gray-700 mb-1">
                          {date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {daySessions.map((session) => (
                            <Link
                              key={session.id}
                              href={`/teacher/class_sessions/${session.id}`}
                              className={`block text-xs p-1 rounded text-white ${getStatusColor(
                                session.status
                              )} hover:opacity-80 transition-opacity`}
                            >
                              <div className="truncate">{session.batch_name}</div>
                              <div className="truncate">{session.class_time}</div>
                            </Link>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* List View */}
        {view === 'list' && (
          <div className="bg-white rounded-lg shadow-md">
            {sessions.filter((s) => !selectedBatch || s.batch_id === parseInt(selectedBatch))
              .length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500 text-lg">No sessions scheduled</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {sessions
                  .filter((s) => !selectedBatch || s.batch_id === parseInt(selectedBatch))
                  .map((session) => (
                    <Link
                      key={session.id}
                      href={`/teacher/class_sessions/${session.id}`}
                      className="block p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {session.topic || 'Class Session'}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{session.batch_name}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {session.class_date} at {session.class_time}
                            {session.duration_minutes && ` (${session.duration_minutes} mins)`}
                          </p>
                          {session.location && (
                            <p className="text-sm text-gray-500 mt-1">
                              Location: {session.location}
                            </p>
                          )}
                        </div>
                        <div className="ml-4">
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-medium text-white ${getStatusColor(
                              session.status
                            )}`}
                          >
                            {session.status}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Status Legend:</p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Scheduled</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Completed</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Cancelled</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Rescheduled</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
