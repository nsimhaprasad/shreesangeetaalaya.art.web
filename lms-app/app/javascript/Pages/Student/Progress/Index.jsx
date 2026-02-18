import { Head, Link } from '@inertiajs/react'
import Layout from '@components/Layout'
import { useState } from 'react'

export default function StudentProgressIndex({
  enrollments = [],
  overall_stats = {},
  course_progress = []
}) {
  const [selectedCourse, setSelectedCourse] = useState('all')

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'bg-green-500'
    if (percentage >= 75) return 'bg-blue-500'
    if (percentage >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600'
    if (percentage >= 75) return 'text-blue-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getGradeColor = (grade) => {
    const gradeColors = {
      'A+': 'bg-green-100 text-green-800',
      'A': 'bg-green-100 text-green-800',
      'B+': 'bg-blue-100 text-blue-800',
      'B': 'bg-blue-100 text-blue-800',
      'C+': 'bg-yellow-100 text-yellow-800',
      'C': 'bg-yellow-100 text-yellow-800',
      'D': 'bg-orange-100 text-orange-800',
      'F': 'bg-red-100 text-red-800'
    }
    return gradeColors[grade] || 'bg-gray-100 text-gray-800'
  }

  const filteredProgress = selectedCourse === 'all'
    ? course_progress
    : course_progress.filter(p => p.course_id === parseInt(selectedCourse))

  return (
    <Layout>
      <Head title="My Progress" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">My Progress</h1>
          <Link
            href="/student/courses"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View Courses
          </Link>
        </div>

        {/* Overall Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Overall Progress</p>
                <p className="text-3xl font-bold text-gray-900">
                  {(overall_stats.overall_progress || 0).toFixed(0)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Attendance Rate</p>
                <p className={`text-3xl font-bold ${getAttendanceColor(overall_stats.attendance_percentage || 0)}`}>
                  {(overall_stats.attendance_percentage || 0).toFixed(1)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Completed Sessions</p>
                <p className="text-3xl font-bold text-gray-900">
                  {overall_stats.completed_sessions || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  of {overall_stats.total_sessions || 0} total
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Courses</p>
                <p className="text-3xl font-bold text-gray-900">
                  {enrollments.filter(e => e.status === 'active').length}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  of {enrollments.length} total
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall Progress</h2>

          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block text-gray-600">
                  {overall_stats.completed_sessions || 0} / {overall_stats.total_sessions || 0} sessions completed across all courses
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-gray-700">
                  {(overall_stats.overall_progress || 0).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${overall_stats.overall_progress || 0}%` }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getProgressColor(overall_stats.overall_progress || 0)}`}
              ></div>
            </div>
          </div>

          {overall_stats.attendance_percentage < 75 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Attendance Alert:</strong> Your overall attendance is below 75%. Please attend classes regularly to maintain good academic standing.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Course
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Courses</option>
            {enrollments.map((enrollment) => (
              <option key={enrollment.course_id} value={enrollment.course_id}>
                {enrollment.course_name}
              </option>
            ))}
          </select>
        </div>

        {/* Course Progress Details */}
        <div className="space-y-6">
          {filteredProgress.length > 0 ? (
            filteredProgress.map((progress, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{progress.course_name}</h3>
                    <p className="text-sm text-gray-600">{progress.batch_name}</p>
                  </div>
                  <Link
                    href={`/student/courses/${progress.course_id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Course Details
                  </Link>
                </div>

                {/* Progress Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">Progress</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {(progress.progress_percentage || 0).toFixed(0)}%
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">Attendance</p>
                    <p className={`text-2xl font-bold ${getAttendanceColor(progress.attendance_percentage || 0)}`}>
                      {(progress.attendance_percentage || 0).toFixed(0)}%
                    </p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">Sessions</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {progress.completed_sessions || 0}/{progress.total_sessions || 0}
                    </p>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600 mb-1">Resources</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {progress.resources_accessed || 0}/{progress.total_resources || 0}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-semibold text-gray-700">Course Completion</h4>
                    <span className="text-sm font-semibold text-gray-700">
                      {(progress.progress_percentage || 0).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${getProgressColor(progress.progress_percentage || 0)}`}
                      style={{ width: `${progress.progress_percentage || 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Attendance Breakdown */}
                {progress.attendance_breakdown && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Attendance Breakdown</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-sm text-gray-600">Present</span>
                        <span className="font-semibold text-green-600">
                          {progress.attendance_breakdown.present || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <span className="text-sm text-gray-600">Absent</span>
                        <span className="font-semibold text-red-600">
                          {progress.attendance_breakdown.absent || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <span className="text-sm text-gray-600">Late</span>
                        <span className="font-semibold text-yellow-600">
                          {progress.attendance_breakdown.late || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm text-gray-600">Excused</span>
                        <span className="font-semibold text-blue-600">
                          {progress.attendance_breakdown.excused || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Performance Indicators */}
                {(progress.grade || progress.performance_notes) && (
                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Performance</h4>
                    <div className="flex flex-wrap gap-4">
                      {progress.grade && (
                        <div>
                          <span className="text-sm text-gray-600 mr-2">Current Grade:</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getGradeColor(progress.grade)}`}>
                            {progress.grade}
                          </span>
                        </div>
                      )}
                      {progress.performance_notes && (
                        <div className="flex-1">
                          <p className="text-sm text-gray-700">
                            <strong>Notes:</strong> {progress.performance_notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Alerts */}
                {progress.attendance_percentage < 75 && (
                  <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <p className="text-sm text-yellow-700">
                      <strong>Warning:</strong> Attendance for this course is below 75%.
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No progress data available</h3>
              <p className="text-gray-500">
                {selectedCourse !== 'all'
                  ? 'Try selecting a different course'
                  : 'You are not enrolled in any courses yet'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
