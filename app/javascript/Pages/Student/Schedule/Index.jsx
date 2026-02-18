import { Head, Link } from '@inertiajs/react'
import { useState } from 'react'
import Layout from '@components/Layout'
import { Card, Button, Badge, EmptyState, Select } from '@components/UI'

const icons = {
  calendar: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  list: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  ),
  grid: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  chevronLeft: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  chevronRight: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  clock: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

export default function StudentScheduleIndex({
  sessions = [],
  batches = [],
  current_month = new Date().getMonth(),
  current_year = new Date().getFullYear()
}) {
  const [viewMode, setViewMode] = useState('calendar')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [filterBatch, setFilterBatch] = useState('')

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
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay()

  const getSessionsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return sessions.filter(session => {
      const sessionDate = new Date(session.date).toISOString().split('T')[0]
      const matchesDate = sessionDate === dateStr
      const matchesBatch = !filterBatch || session.batch_id === parseInt(filterBatch)
      return matchesDate && matchesBatch
    })
  }

  const renderCalendar = () => {
    const month = selectedDate.getMonth()
    const year = selectedDate.getFullYear()
    const daysInMonth = getDaysInMonth(month, year)
    const firstDay = getFirstDayOfMonth(month, year)

    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="min-h-[80px] bg-gray-50"></div>)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const daySessions = getSessionsForDate(date)
      const isToday = new Date().toDateString() === date.toDateString()

      days.push(
        <div
          key={day}
          className={`min-h-[80px] border border-gray-100 p-2 ${
            isToday ? 'bg-primary-50' : 'bg-white'
          }`}
        >
          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary-600' : 'text-gray-700'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {daySessions.slice(0, 2).map((session, idx) => (
              <div
                key={idx}
                className="text-xs bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded truncate"
              >
                {formatTime(session.start_time)} {session.course_name}
              </div>
            ))}
            {daySessions.length > 2 && (
              <div className="text-xs text-gray-500">+{daySessions.length - 2} more</div>
            )}
          </div>
        </div>
      )
    }

    return days
  }

  const filteredSessions = sessions.filter(session => {
    if (!filterBatch) return true
    return session.batch_id === parseInt(filterBatch)
  })

  const upcomingSessions = filteredSessions
    .filter(session => new Date(session.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 10)

  const batchOptions = [
    { value: '', label: 'All Batches' },
    ...batches.map(batch => ({ value: batch.id, label: `${batch.name} - ${batch.course_name}` }))
  ]

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

  const goToToday = () => setSelectedDate(new Date())

  const getDaysUntil = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = date - today
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <Layout>
      <Head title="My Schedule" />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">My Schedule</h1>
            <p className="text-gray-500 text-sm mt-1">View your upcoming classes</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'calendar' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('calendar')}
              icon={icons.grid}
            >
              Calendar
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              icon={icons.list}
            >
              List
            </Button>
          </div>
        </div>

        <Card>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <Select
              value={filterBatch}
              onChange={(e) => setFilterBatch(e.target.value)}
              options={batchOptions}
              className="w-full sm:w-64"
            />
            {viewMode === 'calendar' && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={previousMonth} icon={icons.chevronLeft} />
                <span className="text-sm font-semibold text-gray-900 min-w-[140px] text-center">
                  {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                </span>
                <Button variant="ghost" size="sm" onClick={nextMonth} icon={icons.chevronRight} />
                <Button variant="secondary" size="sm" onClick={goToToday}>Today</Button>
              </div>
            )}
          </div>
        </Card>

        {viewMode === 'calendar' && (
          <Card padding={false}>
            <div className="grid grid-cols-7">
              {daysOfWeek.map(day => (
                <div key={day} className="text-center font-medium text-gray-500 py-3 text-sm border-b border-gray-100">
                  {day}
                </div>
              ))}
              {renderCalendar()}
            </div>
          </Card>
        )}

        {viewMode === 'list' && (
          <>
            {upcomingSessions.length > 0 ? (
              <div className="space-y-3">
                {upcomingSessions.map((session, index) => {
                  const daysUntil = getDaysUntil(session.date)
                  return (
                    <Card key={index} className="border-l-4 border-primary-500">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{session.course_name}</h3>
                            <Badge variant="primary">{session.batch_name}</Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              {icons.calendar}
                              {formatDate(session.date)}
                            </span>
                            <span className="flex items-center gap-1">
                              {icons.clock}
                              {formatTime(session.start_time)} - {formatTime(session.end_time)}
                            </span>
                          </div>
                          {session.topic && (
                            <p className="text-sm text-gray-500 mt-2">{session.topic}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            daysUntil === 0 ? 'bg-green-100 text-green-700' :
                            daysUntil === 1 ? 'bg-primary-100 text-primary-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`}
                          </span>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <EmptyState
                icon={icons.calendar}
                title="No upcoming classes"
                description={filterBatch ? "Try selecting a different batch" : "Check back later for new class schedules"}
              />
            )}
          </>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="text-center">
            <p className="text-sm text-gray-500 mb-1">Classes This Week</p>
            <p className="text-2xl font-bold text-gray-900">
              {filteredSessions.filter(s => {
                const sessionDate = new Date(s.date)
                const today = new Date()
                const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
                return sessionDate >= today && sessionDate <= weekFromNow
              }).length}
            </p>
          </Card>
          <Card className="text-center">
            <p className="text-sm text-gray-500 mb-1">Classes This Month</p>
            <p className="text-2xl font-bold text-gray-900">
              {filteredSessions.filter(s => {
                const sessionDate = new Date(s.date)
                return sessionDate.getMonth() === selectedDate.getMonth() &&
                       sessionDate.getFullYear() === selectedDate.getFullYear()
              }).length}
            </p>
          </Card>
          <Card className="text-center">
            <p className="text-sm text-gray-500 mb-1">Total Sessions</p>
            <p className="text-2xl font-bold text-gray-900">{filteredSessions.length}</p>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
