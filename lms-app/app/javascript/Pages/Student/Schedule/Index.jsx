import { Head, Link } from '@inertiajs/react'
import Layout from '@components/Layout'
import { useState } from 'react'

export default function StudentScheduleIndex({
  sessions = [],
  batches = [],
  current_month = new Date().getMonth(),
  current_year = new Date().getFullYear()
}) {
  const [viewMode, setViewMode] = useState('calendar') // 'calendar' or 'list'
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [filterBatch, setFilterBatch] = useState('all')

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const formatTime = (timeString) => {
    if (!timeString) return ''
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay()
  }

  const getSessionsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return sessions.filter(session => {
      const sessionDate = new Date(session.date).toISOString().split('T')[0]
      const matchesDate = sessionDate === dateStr
      const matchesBatch = filterBatch === 'all' || session.batch_id === parseInt(filterBatch)
      return matchesDate && matchesBatch
    })
  }

  const renderCalendar = () => {
    const month = selectedDate.getMonth()
    const year = selectedDate.getFullYear()
    const daysInMonth = getDaysInMonth(month, year)
    const firstDay = getFirstDayOfMonth(month, year)

    const days = []

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const daySessions = getSessionsForDate(date)
      const isToday = new Date().toDateString() === date.toDateString()

      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-200 p-2 overflow-hidden ${
            isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'
          }`}
        >
          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {daySessions.slice(0, 2).map((session, idx) => (
              <div
                key={idx}
                className="text-xs bg-blue-500 text-white px-1 py-0.5 rounded truncate"
                title={`${session.course_name} - ${formatTime(session.start_time)}`}
              >
                {formatTime(session.start_time)} {session.course_name}
              </div>
            ))}
            {daySessions.length > 2 && (
              <div className="text-xs text-gray-500">
                +{daySessions.length - 2} more
              </div>
            )}
          </div>
        </div>
      )
    }

    return days
  }

  const filteredSessions = sessions.filter(session => {
    if (filterBatch === 'all') return true
    return session.batch_id === parseInt(filterBatch)
  })

  const upcomingSessions = filteredSessions
    .filter(session => new Date(session.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 10)

  const previousMonth = () => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(newDate.getMonth() - 1)
    setSelectedDate(newDate)
  }

  const nextMonth = () => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(newDate.getMonth() + 1)
    setSelectedDate(newDate)
  }

  const goToToday = () => {
    setSelectedDate(new Date())
  }

  return (
    <Layout>
      <Head title="My Schedule" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">My Schedule</h1>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                viewMode === 'calendar'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <svg className="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Calendar
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <svg className="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              List
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Batch
              </label>
              <select
                value={filterBatch}
                onChange={(e) => setFilterBatch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Batches</option>
                {batches.map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch.name} - {batch.course_name}
                  </option>
                ))}
              </select>
            </div>

            {viewMode === 'calendar' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={previousMonth}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="text-center min-w-[180px]">
                  <div className="text-lg font-semibold text-gray-900">
                    {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                  </div>
                </div>

                <button
                  onClick={nextMonth}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  onClick={goToToday}
                  className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Today
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
              {daysOfWeek.map(day => (
                <div
                  key={day}
                  className="bg-gray-100 p-3 text-center font-semibold text-gray-700"
                >
                  {day}
                </div>
              ))}
              {renderCalendar()}
            </div>

            <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-50 border border-blue-300 rounded mr-2"></div>
                Today
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                Class Session
              </div>
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Classes</h2>

            {upcomingSessions.length > 0 ? (
              <div className="space-y-4">
                {upcomingSessions.map((session, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">
                          {session.course_name}
                        </h3>
                        <p className="text-sm text-gray-600">{session.batch_name}</p>

                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-700">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(session.date)}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatTime(session.start_time)} - {formatTime(session.end_time)}
                          </span>
                          {session.duration && (
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              {session.duration} minutes
                            </span>
                          )}
                        </div>

                        {session.topic && (
                          <div className="mt-3 pt-3 border-t border-blue-100">
                            <p className="text-sm text-gray-700">
                              <strong>Topic:</strong> {session.topic}
                            </p>
                          </div>
                        )}

                        {session.notes && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">
                              <strong>Notes:</strong> {session.notes}
                            </p>
                          </div>
                        )}

                        {session.teacher_name && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">
                              <strong>Instructor:</strong> {session.teacher_name}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="ml-4">
                        {(() => {
                          const sessionDate = new Date(session.date)
                          const today = new Date()
                          const diffTime = sessionDate - today
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

                          return (
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                              diffDays === 0 ? 'bg-green-100 text-green-800' :
                              diffDays === 1 ? 'bg-blue-100 text-blue-800' :
                              diffDays <= 7 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {diffDays === 0 ? 'Today' :
                               diffDays === 1 ? 'Tomorrow' :
                               `In ${diffDays} days`}
                            </span>
                          )
                        })()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 text-lg">No upcoming classes scheduled</p>
                <p className="text-sm mt-1">
                  {filterBatch !== 'all'
                    ? 'Try selecting a different batch'
                    : 'Check back later for new class schedules'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <p className="text-sm font-medium text-gray-600 mb-1">Classes This Week</p>
            <p className="text-3xl font-bold text-gray-900">
              {filteredSessions.filter(s => {
                const sessionDate = new Date(s.date)
                const today = new Date()
                const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
                return sessionDate >= today && sessionDate <= weekFromNow
              }).length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <p className="text-sm font-medium text-gray-600 mb-1">Classes This Month</p>
            <p className="text-3xl font-bold text-gray-900">
              {filteredSessions.filter(s => {
                const sessionDate = new Date(s.date)
                return sessionDate.getMonth() === selectedDate.getMonth() &&
                       sessionDate.getFullYear() === selectedDate.getFullYear()
              }).length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <p className="text-sm font-medium text-gray-600 mb-1">Total Sessions</p>
            <p className="text-3xl font-bold text-gray-900">{filteredSessions.length}</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
