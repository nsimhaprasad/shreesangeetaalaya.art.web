import { Head, Link } from '@inertiajs/react'
import Layout from '@components/Layout'

export default function StudentCourseShow({
  course = {},
  enrollment = {},
  batches = [],
  upcoming_sessions = [],
  recent_attendance = [],
  learning_resources = [],
  progress_stats = {}
}) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (timeString) => {
    if (!timeString) return ''
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      dropped: 'bg-red-100 text-red-800',
      present: 'bg-green-100 text-green-800',
      absent: 'bg-red-100 text-red-800',
      late: 'bg-yellow-100 text-yellow-800',
      excused: 'bg-blue-100 text-blue-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getDifficultyColor = (level) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    }
    return colors[level] || 'bg-gray-100 text-gray-800'
  }

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

  return (
    <Layout>
      <Head title={course.name || 'Course Details'} />

      <div className="space-y-6">
        {/* Back Link */}
        <Link
          href="/student/courses"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to My Courses
        </Link>

        {/* Course Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{course.name}</h1>
              <p className="text-blue-100 text-lg">{course.description}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold uppercase ${getStatusColor(enrollment.status)} bg-white ml-4`}>
              {enrollment.status}
            </span>
          </div>

          <div className="flex flex-wrap gap-4 mt-6">
            {course.difficulty_level && (
              <div className={`px-3 py-1 rounded-lg text-sm font-semibold ${getDifficultyColor(course.difficulty_level)}`}>
                {course.difficulty_level}
              </div>
            )}
            {course.duration_months && (
              <div className="flex items-center text-blue-100">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {course.duration_months} {course.duration_months === 1 ? 'month' : 'months'}
              </div>
            )}
            {enrollment.enrollment_date && (
              <div className="flex items-center text-blue-100">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Enrolled {formatDate(enrollment.enrollment_date)}
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <p className="text-sm font-medium text-gray-600 mb-1">Attendance Rate</p>
            <p className={`text-3xl font-bold ${getAttendanceColor(progress_stats.attendance_percentage || 0)}`}>
              {(progress_stats.attendance_percentage || 0).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {progress_stats.present_count || 0} / {progress_stats.total_sessions || 0} classes
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <p className="text-sm font-medium text-gray-600 mb-1">Course Progress</p>
            <p className="text-3xl font-bold text-gray-900">
              {(progress_stats.progress_percentage || 0).toFixed(0)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {progress_stats.completed_sessions || 0} sessions completed
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <p className="text-sm font-medium text-gray-600 mb-1">Learning Resources</p>
            <p className="text-3xl font-bold text-gray-900">
              {learning_resources.length}
            </p>
            <p className="text-xs text-gray-500 mt-1">Available materials</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <p className="text-sm font-medium text-gray-600 mb-1">Batches Enrolled</p>
            <p className="text-3xl font-bold text-gray-900">
              {batches.length}
            </p>
            <p className="text-xs text-gray-500 mt-1">Active batches</p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall Progress</h2>

          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block text-gray-600">
                  {progress_stats.completed_sessions || 0} / {progress_stats.total_sessions || 0} sessions completed
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-gray-700">
                  {(progress_stats.progress_percentage || 0).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${progress_stats.progress_percentage || 0}%` }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getProgressColor(progress_stats.progress_percentage || 0)}`}
              ></div>
            </div>
          </div>

          {progress_stats.attendance_percentage < 75 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Your attendance for this course is below 75%. Please attend classes regularly.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Batches Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Enrolled Batches</h2>

            {batches.length > 0 ? (
              <div className="space-y-4">
                {batches.map((batch, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">{batch.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${getStatusColor(batch.status)}`}>
                        {batch.status}
                      </span>
                    </div>

                    {batch.schedule && (
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {batch.schedule}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-600">Start Date</p>
                        <p className="font-medium text-sm">{formatDate(batch.start_date)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">End Date</p>
                        <p className="font-medium text-sm">{formatDate(batch.end_date)}</p>
                      </div>
                    </div>

                    {batch.teacher_name && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-600">Instructor</p>
                        <p className="font-medium text-sm">{batch.teacher_name}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No batches enrolled</p>
              </div>
            )}
          </div>

          {/* Upcoming Sessions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Sessions</h2>

            {upcoming_sessions.length > 0 ? (
              <div className="space-y-3">
                {upcoming_sessions.map((session, index) => (
                  <div key={index} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                    <h3 className="font-semibold text-gray-900">{session.batch_name}</h3>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-700">
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
                    </div>
                    {session.topic && (
                      <p className="text-sm text-gray-600 mt-2">Topic: {session.topic}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2">No upcoming sessions</p>
              </div>
            )}
          </div>
        </div>

        {/* Learning Resources */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Learning Resources</h2>
            <Link
              href="/student/learning_resources"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Resources
            </Link>
          </div>

          {learning_resources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {learning_resources.map((resource, index) => (
                <Link
                  key={index}
                  href={`/student/learning_resources/${resource.id}`}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      resource.resource_type === 'video' ? 'bg-red-100' :
                      resource.resource_type === 'pdf' ? 'bg-blue-100' :
                      resource.resource_type === 'audio' ? 'bg-purple-100' :
                      'bg-green-100'
                    }`}>
                      {resource.resource_type === 'video' && (
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        </svg>
                      )}
                      {resource.resource_type === 'pdf' && (
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      )}
                      {resource.resource_type === 'audio' && (
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{resource.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(resource.created_at)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="mt-2">No learning resources available</p>
            </div>
          )}
        </div>

        {/* Recent Attendance */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Attendance</h2>
            <Link
              href="/student/attendances"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Attendance
            </Link>
          </div>

          {recent_attendance.length > 0 ? (
            <div className="space-y-3">
              {recent_attendance.map((attendance, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{attendance.batch_name}</p>
                    <p className="text-xs text-gray-500">{formatDate(attendance.date)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusColor(attendance.status)}`}>
                    {attendance.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No attendance records yet</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
