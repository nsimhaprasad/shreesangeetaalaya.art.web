import { Head, Link, useForm, router } from '@inertiajs/react'
import Layout from '@components/Layout'
import { useState, useEffect } from 'react'

const STATUS_COLORS = {
  present: 'bg-green-100 text-green-800 border-green-300',
  absent: 'bg-red-100 text-red-800 border-red-300',
  late: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  excused: 'bg-blue-100 text-blue-800 border-blue-300',
  default: 'bg-gray-100 text-gray-800 border-gray-300'
}

const STATUS_LABELS = {
  present: 'Present',
  absent: 'Absent',
  late: 'Late',
  excused: 'Excused'
}

export default function MarkAttendance({
  batch = null,
  class_session = null,
  students = [],
  selected_date = null,
  batches = []
}) {
  const [selectedBatch, setSelectedBatch] = useState(batch?.id || '')
  const [selectedDate, setSelectedDate] = useState(selected_date || new Date().toISOString().split('T')[0])
  const [attendanceData, setAttendanceData] = useState({})
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Initialize attendance data from students
  useEffect(() => {
    if (students.length > 0) {
      const initialData = {}
      students.forEach(student => {
        initialData[student.id] = {
          student_id: student.id,
          status: student.attendance?.status || 'present',
          notes: student.attendance?.notes || ''
        }
      })
      setAttendanceData(initialData)
      saveToHistory(initialData)
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
      router.get('/teacher/attendances/mark_attendance', {
        batch_id: batchId,
        date: selectedDate
      })
    }
  }

  const handleDateChange = (e) => {
    const date = e.target.value
    setSelectedDate(date)
    if (selectedBatch) {
      router.get('/teacher/attendances/mark_attendance', {
        batch_id: selectedBatch,
        date: date
      })
    }
  }

  const updateAttendance = (studentId, field, value) => {
    const newData = {
      ...attendanceData,
      [studentId]: {
        ...attendanceData[studentId],
        [field]: value
      }
    }
    setAttendanceData(newData)
    saveToHistory(newData)
  }

  const markAllPresent = () => {
    const newData = { ...attendanceData }
    Object.keys(newData).forEach(studentId => {
      newData[studentId].status = 'present'
    })
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    const attendanceArray = Object.values(attendanceData)

    try {
      await router.post('/teacher/attendances/bulk_mark', {
        batch_id: selectedBatch,
        date: selectedDate,
        attendance_data: attendanceArray
      }, {
        preserveScroll: true,
        onSuccess: () => {
          setSuccessMessage('Attendance marked successfully!')
          setTimeout(() => setSuccessMessage(''), 3000)
        },
        onError: (errors) => {
          console.error('Error saving attendance:', errors)
        },
        onFinish: () => {
          setIsSaving(false)
        }
      })
    } catch (error) {
      console.error('Error:', error)
      setIsSaving(false)
    }
  }

  const getStatusColor = (status) => {
    return STATUS_COLORS[status] || STATUS_COLORS.default
  }

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  return (
    <Layout>
      <Head title="Mark Attendance" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Mark Attendance</h1>
          <Link
            href="/teacher/attendances"
            className="text-blue-600 hover:text-blue-800"
          >
            &larr; Back to Attendance
          </Link>
        </div>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.course_name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {batch && students.length > 0 && (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {batch.name} - {batch.course_name}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={undo}
                      disabled={!canUndo}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 rounded text-sm"
                    >
                      &#8630; Undo
                    </button>
                    <button
                      type="button"
                      onClick={redo}
                      disabled={!canRedo}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 rounded text-sm"
                    >
                      &#8631; Redo
                    </button>
                    <button
                      type="button"
                      onClick={markAllPresent}
                      className="px-4 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
                    >
                      Mark All Present
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {students.map((student) => {
                    const attendance = attendanceData[student.id] || {}
                    return (
                      <div
                        key={student.id}
                        className={`border rounded-lg p-4 ${getStatusColor(attendance.status)}`}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                          <div className="md:col-span-3">
                            <h3 className="font-medium">{student.name}</h3>
                            <p className="text-sm opacity-75">{student.email}</p>
                          </div>

                          <div className="md:col-span-4 flex gap-2">
                            {Object.keys(STATUS_LABELS).map((status) => (
                              <button
                                key={status}
                                type="button"
                                onClick={() => updateAttendance(student.id, 'status', status)}
                                className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-all ${
                                  attendance.status === status
                                    ? STATUS_COLORS[status] + ' border-2'
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                {STATUS_LABELS[status]}
                              </button>
                            ))}
                          </div>

                          <div className="md:col-span-5">
                            <input
                              type="text"
                              placeholder="Add notes (optional)"
                              value={attendance.notes || ''}
                              onChange={(e) => updateAttendance(student.id, 'notes', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Link
                  href="/teacher/attendances"
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-md transition-colors"
                >
                  {isSaving ? 'Saving...' : 'Save Attendance'}
                </button>
              </div>
            </form>
          )}

          {!batch && (
            <div className="text-center py-8 text-gray-500">
              Please select a batch and date to mark attendance
            </div>
          )}

          {batch && students.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No students enrolled in this batch
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
