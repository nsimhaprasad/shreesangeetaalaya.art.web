import { Head, Link, router } from '@inertiajs/react'
import { useState, useMemo } from 'react'
import Layout from '@components/Layout'
import { Card, Button, Badge, EmptyState, SearchInput, Select } from '@components/UI'

const icons = {
  plus: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
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
  ),
  location: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

export default function ClassSessionsIndex({ sessions = [], batches = [], start_date, end_date }) {
  const [currentMonth, setCurrentMonth] = useState(new Date(start_date))
  const [view, setView] = useState('calendar')
  const [selectedBatch, setSelectedBatch] = useState('')

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

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }, [currentMonth])

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

  const filteredSessions = sessions.filter((s) => !selectedBatch || s.batch_id === parseInt(selectedBatch))

  const getStatusConfig = (status) => {
    const configs = {
      scheduled: { variant: 'primary', label: 'Scheduled' },
      completed: { variant: 'success', label: 'Completed' },
      cancelled: { variant: 'danger', label: 'Cancelled' },
      rescheduled: { variant: 'warning', label: 'Rescheduled' },
    }
    return configs[status] || { variant: 'default', label: status }
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

  const batchOptions = [
    { value: '', label: 'All Batches' },
    ...batches.map((batch) => ({
      value: batch.value,
      label: `${batch.label} - ${batch.course_name}`
    }))
  ]

  return (
    <Layout>
      <Head title="Class Sessions" />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">Class Sessions</h1>
            <p className="text-gray-500 text-sm mt-1">Schedule and manage your class sessions</p>
          </div>
          <div className="flex gap-2">
            <Link href="/teacher/class_sessions/new_recurring" className="btn-secondary">
              {icons.calendar}
              <span>Recurring</span>
            </Link>
            <Link href="/teacher/class_sessions/new" className="btn-primary">
              {icons.plus}
              <span>Schedule Session</span>
            </Link>
          </div>
        </div>

        <Card>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="w-full sm:w-64">
              <Select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                options={batchOptions}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={view === 'calendar' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setView('calendar')}
                icon={icons.grid}
              >
                Calendar
              </Button>
              <Button
                variant={view === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setView('list')}
                icon={icons.list}
              >
                List
              </Button>
            </div>
          </div>
        </Card>

        {view === 'calendar' && (
          <Card padding={false}>
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth(-1)}
                icon={icons.chevronLeft}
              />
              <h2 className="text-lg font-semibold text-gray-900">
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth(1)}
                icon={icons.chevronRight}
              />
            </div>

            <div className="grid grid-cols-7">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="text-center font-medium text-gray-500 py-3 text-sm border-b border-gray-100"
                >
                  {day}
                </div>
              ))}

              {calendarDays.map((date, index) => {
                const dateStr = date ? formatDate(date) : null
                const daySessions = dateStr ? sessionsByDate[dateStr] || [] : []

                return (
                  <div
                    key={index}
                    className={`min-h-[100px] border-b border-r border-gray-100 p-2 ${
                      date
                        ? isToday(date)
                          ? 'bg-primary-50'
                          : 'bg-white'
                        : 'bg-gray-50'
                    }`}
                  >
                    {date && (
                      <>
                        <div className={`text-sm font-medium mb-1 ${
                          isToday(date) ? 'text-primary-600' : 'text-gray-700'
                        }`}>
                          {date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {daySessions.slice(0, 3).map((session) => {
                            const statusConfig = getStatusConfig(session.status)
                            return (
                              <Link
                                key={session.id}
                                href={`/teacher/class_sessions/${session.id}`}
                                className="block"
                              >
                                <div className={`text-xs px-2 py-1 rounded truncate ${
                                  statusConfig.variant === 'success' ? 'bg-green-100 text-green-700' :
                                  statusConfig.variant === 'danger' ? 'bg-red-100 text-red-700' :
                                  statusConfig.variant === 'warning' ? 'bg-amber-100 text-amber-700' :
                                  'bg-primary-100 text-primary-700'
                                }`}>
                                  {session.class_time} - {session.batch_name}
                                </div>
                              </Link>
                            )
                          })}
                          {daySessions.length > 3 && (
                            <div className="text-xs text-gray-500 px-2">
                              +{daySessions.length - 3} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="p-4 border-t border-gray-100 flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-primary-100"></div>
                <span className="text-xs text-gray-600">Scheduled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-100"></div>
                <span className="text-xs text-gray-600">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-100"></div>
                <span className="text-xs text-gray-600">Cancelled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-amber-100"></div>
                <span className="text-xs text-gray-600">Rescheduled</span>
              </div>
            </div>
          </Card>
        )}

        {view === 'list' && (
          <>
            {filteredSessions.length > 0 ? (
              <Card padding={false}>
                <div className="divide-y divide-gray-100">
                  {filteredSessions.map((session) => {
                    const statusConfig = getStatusConfig(session.status)
                    return (
                      <Link
                        key={session.id}
                        href={`/teacher/class_sessions/${session.id}`}
                        className="block p-4 sm:p-5 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {session.topic || 'Class Session'}
                              </h3>
                              <Badge variant={statusConfig.variant}>
                                {statusConfig.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">{session.batch_name}</p>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {session.class_date}
                              </span>
                              <span className="flex items-center gap-1">
                                {icons.clock}
                                {session.class_time}
                                {session.duration_minutes && ` (${session.duration_minutes} mins)`}
                              </span>
                              {session.location && (
                                <span className="flex items-center gap-1">
                                  {icons.location}
                                  {session.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </Card>
            ) : (
              <EmptyState
                icon={icons.calendar}
                title="No sessions scheduled"
                description="Create your first class session to get started"
                action={
                  <Link href="/teacher/class_sessions/new" className="btn-primary">
                    Schedule Session
                  </Link>
                }
              />
            )}
          </>
        )}
      </div>
    </Layout>
  )
}
