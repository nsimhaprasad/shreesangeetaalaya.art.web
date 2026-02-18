import { Head, Link, router } from '@inertiajs/react'
import Layout from '@components/Layout'
import { useState } from 'react'

export default function AttendanceReport({
  batches = [],
  selected_batch_id = null,
  report_data = [],
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
      router.get('/teacher/attendances/report', {
        batch_id: batchId,
        start_date: startDate,
        end_date: endDate
      })
    }
  }

  const handleDateRangeChange = () => {
    if (selectedBatch) {
      router.get('/teacher/attendances/report', {
        batch_id: selectedBatch,
        start_date: startDate,
        end_date: endDate
      })
    }
  }

  const getPercentageColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600 bg-green-50'
    if (percentage >= 75) return 'text-blue-600 bg-blue-50'
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getPercentageBarColor = (percentage) => {
    if (percentage >= 90) return 'bg-green-500'
    if (percentage >= 75) return 'bg-blue-500'
    if (percentage >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const exportToCSV = () => {
    if (report_data.length === 0) return

    const headers = ['Student Name', 'Email', 'Total Classes', 'Present', 'Absent', 'Late', 'Excused', 'Attendance %']
    const rows = report_data.map(student => [
      student.student_name,
      student.student_email,
      student.total_classes,
      student.present,
      student.absent,
      student.late,
      student.excused,
      student.attendance_percentage
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    const batchName = batches.find(b => b.id === parseInt(selectedBatch))?.name || 'batch'
    link.setAttribute('href', url)
    link.setAttribute('download', `attendance_report_${batchName}_${startDate}_to_${endDate}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToPDF = () => {
    window.print()
  }

  const calculateAverageAttendance = () => {
    if (report_data.length === 0) return 0
    const total = report_data.reduce((sum, student) => sum + student.attendance_percentage, 0)
    return (total / report_data.length).toFixed(2)
  }

  const getStudentsWithLowAttendance = () => {
    return report_data.filter(student => student.attendance_percentage < 75)
  }

  return (
    <Layout>
      <Head title="Attendance Report" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Attendance Report</h1>
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

            <div className="flex items-end">
              <button
                onClick={handleDateRangeChange}
                className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              >
                Generate Report
              </button>
            </div>
          </div>

          {selectedBatch && report_data.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Average Attendance</h3>
                  <p className="text-3xl font-bold text-blue-600">{calculateAverageAttendance()}%</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Total Students</h3>
                  <p className="text-3xl font-bold text-green-600">{report_data.length}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Low Attendance</h3>
                  <p className="text-3xl font-bold text-red-600">{getStudentsWithLowAttendance().length}</p>
                  <p className="text-xs text-gray-500 mt-1">(Below 75%)</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 mb-4">
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm flex items-center gap-2"
                >
                  <span>&#128190;</span> Export CSV
                </button>
                <button
                  onClick={exportToPDF}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md text-sm flex items-center gap-2"
                >
                  <span>&#128462;</span> Print/PDF
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Classes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Present
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Absent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Late
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Excused
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Attendance %
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progress
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {report_data.map((student) => (
                      <tr key={student.student_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {student.student_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {student.student_email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.total_classes}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {student.present}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {student.absent}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {student.late}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {student.excused}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded font-medium text-sm ${getPercentageColor(student.attendance_percentage)}`}>
                            {student.attendance_percentage.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getPercentageBarColor(student.attendance_percentage)}`}
                              style={{ width: `${student.attendance_percentage}%` }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {selectedBatch && report_data.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No attendance data found for the selected date range</p>
              <p className="text-sm mt-2">Try selecting a different date range or mark some attendance first</p>
            </div>
          )}

          {!selectedBatch && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">Please select a batch to generate the attendance report</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
