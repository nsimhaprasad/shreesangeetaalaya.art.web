import { Head, Link, router } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import Layout from '@components/Layout'
import { Card, CardTitle, Button, Badge, Avatar, StatusBadge, Select, EmptyState } from '@components/UI'

const STATUS_CONFIG = {
  present: { label: 'Present', color: 'success', bg: 'bg-green-50 border-green-200' },
  absent: { label: 'Absent', color: 'danger', bg: 'bg-red-50 border-red-200' },
  late: { label: 'Late', color: 'warning', bg: 'bg-amber-50 border-amber-200' },
  excused: { label: 'Excused', color: 'info', bg: 'bg-blue-50 border-blue-200' }
}

export default function MarkAttendance({ batch, class_session, students, selected_date, batches }) {
  const [selectedBatch, setSelectedBatch] = useState(batch?.id || '')
  const [selectedDate, setSelectedDate] = useState(selected_date || new Date().toISOString().split('T')[0])
  const [attendanceData, setAttendanceData] = useState({})
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (students?.length > 0) {
      const initial = {}
      students.forEach(s => {
        initial[s.id] = {
          student_id: s.id,
          status: s.attendance?.status || 'present',
          notes: s.attendance?.notes || ''
        }
      })
      setAttendanceData(initial)
      setHistory([JSON.parse(JSON.stringify(initial))])
      setHistoryIndex(0)
    }
  }, [students])

  const saveToHistory = (data) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(JSON.parse(JSON.stringify(data)))
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const handleBatchChange = (e) => {
    const batchId = e.target.value
    setSelectedBatch(batchId)
    if (batchId) {
      router.get('/teacher/attendances/mark_attendance', { batch_id: batchId, date: selectedDate })
    }
  }

  const handleDateChange = (e) => {
    const date = e.target.value
    setSelectedDate(date)
    if (selectedBatch) {
      router.get('/teacher/attendances/mark_attendance', { batch_id: selectedBatch, date })
    }
  }

  const updateStatus = (studentId, status) => {
    const newData = {
      ...attendanceData,
      [studentId]: { ...attendanceData[studentId], status }
    }
    setAttendanceData(newData)
    saveToHistory(newData)
  }

  const updateNotes = (studentId, notes) => {
    const newData = {
      ...attendanceData,
      [studentId]: { ...attendanceData[studentId], notes }
    }
    setAttendanceData(newData)
  }

  const markAllPresent = () => {
    const newData = { ...attendanceData }
    Object.keys(newData).forEach(id => { newData[id].status = 'present' })
    setAttendanceData(newData)
    saveToHistory(newData)
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setAttendanceData(JSON.parse(JSON.stringify(history[historyIndex - 1])))
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setAttendanceData(JSON.parse(JSON.stringify(history[historyIndex + 1])))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaving(true)
    router.post('/teacher/attendances/bulk_mark', {
      batch_id: selectedBatch,
      date: selectedDate,
      attendance_data: Object.values(attendanceData)
    }, {
      preserveScroll: true,
      onFinish: () => setSaving(false)
    })
  }

  const statusCounts = {
    present: Object.values(attendanceData).filter(a => a.status === 'present').length,
    absent: Object.values(attendanceData).filter(a => a.status === 'absent').length,
    late: Object.values(attendanceData).filter(a => a.status === 'late').length,
    excused: Object.values(attendanceData).filter(a => a.status === 'excused').length
  }

  return (
    <Layout>
      <Head title="Mark Attendance" />

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/teacher/attendances" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">Mark Attendance</h1>
            <p className="text-gray-500 text-sm">Record student attendance for a class</p>
          </div>
        </div>

        <Card>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="label">Select Batch</label>
              <select value={selectedBatch} onChange={handleBatchChange} className="input">
                <option value="">-- Select a batch --</option>
                {batches?.map(b => (
                  <option key={b.id} value={b.id}>{b.name} ({b.course_name})</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="label">Class Date</label>
              <input type="date" value={selectedDate} onChange={handleDateChange} className="input" />
            </div>
          </div>
        </Card>

        {batch && students?.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.entries(statusCounts).map(([status, count]) => (
                <Card key={status} className={`text-center ${STATUS_CONFIG[status].bg}`}>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-sm text-gray-600">{STATUS_CONFIG[status].label}</p>
                </Card>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              <Card padding={false}>
                <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="mb-1">{batch.name}</CardTitle>
                    <p className="text-sm text-gray-500">{batch.course_name}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="secondary" onClick={undo} disabled={historyIndex <= 0}>
                      Undo
                    </Button>
                    <Button type="button" variant="secondary" onClick={redo} disabled={historyIndex >= history.length - 1}>
                      Redo
                    </Button>
                    <Button type="button" variant="success" onClick={markAllPresent}>
                      All Present
                    </Button>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {students.map(student => {
                    const attendance = attendanceData[student.id] || {}
                    const config = STATUS_CONFIG[attendance.status] || STATUS_CONFIG.present
                    
                    return (
                      <div key={student.id} className={`p-4 sm:p-5 ${config.bg}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex items-center gap-3 flex-1">
                            <Avatar name={student.name} size="md" />
                            <div>
                              <p className="font-medium text-gray-900">{student.name}</p>
                              <p className="text-sm text-gray-500">{student.email}</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            {Object.entries(STATUS_CONFIG).map(([status, cfg]) => (
                              <button
                                key={status}
                                type="button"
                                onClick={() => updateStatus(student.id, status)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                  attendance.status === status
                                    ? `bg-${cfg.color === 'success' ? 'green' : cfg.color === 'danger' ? 'red' : cfg.color === 'warning' ? 'amber' : 'blue'}-600 text-white`
                                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                                }`}
                              >
                                {cfg.label}
                              </button>
                            ))}
                          </div>

                          <input
                            type="text"
                            placeholder="Notes..."
                            value={attendance.notes || ''}
                            onChange={(e) => updateNotes(student.id, e.target.value)}
                            className="input w-full sm:w-48"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="p-4 sm:p-6 border-t border-gray-100 flex justify-end gap-3">
                  <Link href="/teacher/attendances" className="btn-secondary">Cancel</Link>
                  <Button type="submit" loading={saving}>Save Attendance</Button>
                </div>
              </Card>
            </form>
          </>
        )}

        {batch && students?.length === 0 && (
          <EmptyState
            title="No students in this batch"
            description="Add students to the batch before marking attendance"
          />
        )}
      </div>
    </Layout>
  )
}
