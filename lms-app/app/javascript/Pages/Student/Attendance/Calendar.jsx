import { Head, Link, router } from '@inertiajs/react'
import Layout from '@components/Layout'
import Card from '@components/Card'
import Badge from '@components/Badge'
import Button from '@components/Button'
import SelectInput from '@components/SelectInput'
import { useState } from 'react'

const STATUS_VARIANTS = {
  present: 'success',
  absent: 'danger',
  late: 'warning',
  excused: 'primary',
  not_marked: 'default'
}

const STATUS_COLORS = {
  present: 'bg-green-500',
  absent: 'bg-red-500',
  late: 'bg-yellow-500',
  excused: 'bg-blue-500',
  not_marked: 'bg-gray-300'
}

const STATUS_LABELS = {
  present: 'Present',
  absent: 'Absent',
  late: 'Late',
  excused: 'Excused',
  not_marked: 'Not Marked'
}

export default function StudentAttendanceCalendar({
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
      router.get('/student/attendances/calendar', {
        batch_id: batchId,
        start_date: startDate,
        end_date: endDate
      })
    }
  }

  const handleDateRangeChange = () => {
    if (selectedBatch) {
      router.get('/student/attendances/calendar', {
        batch_id: selectedBatch,
        start_date: startDate,
        end_date: endDate
      })
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatTime = (timeString) => {
    if (!timeString) return ''
    return new Date(`2000-01-01 ${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    return STATUS_COLORS[status] || STATUS_COLORS.not_marked
  }

  const goToCurrentMonth = () => {
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    setStartDate(firstDay.toISOString().split('T')[0])
    setEndDate(lastDay.toISOString().split('T')[0])

    if (selectedBatch) {
      router.get('/student/attendances/calendar', {
        batch_id: selectedBatch,
        start_date: firstDay.toISOString().split('T')[0],
        end_date: lastDay.toISOString().split('T')[0]
      })
    }
  }

  const calculateStats = () => {
    if (calendar_data.length === 0) return null

    const present = calendar_data.filter(d => d.status === 'present').length
    const absent = calendar_data.filter(d => d.status === 'absent').length
    const late = calendar_data.filter(d => d.status === 'late').length
    const excused = calendar_data.filter(d => d.status === 'excused').length
    const notMarked = calendar_data.filter(d => d.status === 'not_marked').length
    const total = calendar_data.length
    const markedTotal = total - notMarked
    const attendancePercentage = markedTotal > 0 ? (present / markedTotal * 100).toFixed(1) : 0

    return { present, absent, late, excused, notMarked, total, attendancePercentage }
  }

  const stats = calculateStats()

  return (
    <Layout>
      <Head title="My Attendance Calendar" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">My Attendance Calendar</h1>
          <Link href="/student/attendances">
            <Button variant="secondary">&larr; Back to Attendance</Button>
          </Link>
        </div>

        <Card>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <SelectInput
              label="Select Batch"
              value={selectedBatch}
              onChange={handleBatchChange}
              options={[
                { value: '', label: '-- Select a batch --' },
                ...batches.map((batch) => ({
                  value: batch.id,
                  label: `${batch.name} (${batch.course_name})`
                }))
              ]}
            />

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
              <Button onClick={handleDateRangeChange} className="flex-1">
                Apply Filter
              </Button>
              <Button variant="secondary" onClick={goToCurrentMonth}>
                Today
              </Button>
            </div>
          </div>

          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
              <Card className="bg-green-50 text-center" padding={false}>
                <div className="p-3">
                  <div className="text-2xl font-bold text-green-600">{stats.present}</div>
                  <div className="text-xs text-gray-600">Present</div>
                </div>
              </Card>
              <Card className="bg-red-50 text-center" padding={false}>
                <div className="p-3">
                  <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
                  <div className="text-xs text-gray-600">Absent</div>
                </div>
              </Card>
              <Card className="bg-yellow-50 text-center" padding={false}>
                <div className="p-3">
                  <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
                  <div className="text-xs text-gray-600">Late</div>
                </div>
              </Card>
              <Card className="bg-blue-50 text-center" padding={false}>
                <div className="p-3">
                  <div className="text-2xl font-bold text-blue-600">{stats.excused}</div>
                  <div className="text-xs text-gray-600">Excused</div>
                </div>
              </Card>
              <Card className="bg-gray-50 text-center" padding={false}>
                <div className="p-3">
                  <div className="text-2xl font-bold text-gray-600">{stats.notMarked}</div>
                  <div className="text-xs text-gray-600">Not Marked</div>
                </div>
              </Card>
              <Card className="bg-purple-50 text-center" padding={false}>
                <div className="p-3">
                  <div className="text-2xl font-bold text-purple-600">{stats.attendancePercentage}%</div>
                  <div className="text-xs text-gray-600">Rate</div>
                </div>
              </Card>
            </div>
          )}

          {selectedBatch && calendar_data.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm mb-4">
                <span className="font-medium">Legend:</span>
                {Object.keys(STATUS_LABELS).map((status) => (
                  <div key={status} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded ${STATUS_COLORS[status]}`}></div>
                    <span>{STATUS_LABELS[status]}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {calendar_data.map((day, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-lg p-4 ${getStatusColor(day.status)} bg-opacity-10`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {formatDate(day.date)}
                      </h3>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(day.status)}`}></div>
                    </div>

                    {day.class_time && (
                      <div className="text-xs text-gray-600 mb-2">
                        {formatTime(day.class_time)}
                      </div>
                    )}

                    <Badge variant={STATUS_VARIANTS[day.status] || 'default'}>
                      {STATUS_LABELS[day.status] || 'Unknown'}
                    </Badge>

                    {day.notes && (
                      <div className="mt-2 text-xs text-gray-600 border-t pt-2">
                        <strong>Note:</strong> {day.notes}
                      </div>
                    )}

                    {day.marked_at && (
                      <div className="mt-2 text-xs text-gray-500">
                        Marked: {new Date(day.marked_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedBatch && calendar_data.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No class sessions found for the selected date range</p>
              <p className="text-sm mt-2">Try selecting a different date range</p>
            </div>
          )}

          {!selectedBatch && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">Please select a batch to view your attendance calendar</p>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  )
}