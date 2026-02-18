import { Head, Link } from '@inertiajs/react'
import Layout from '@components/Layout'
import { useState } from 'react'

export default function StudentCoursesIndex({
  enrollments = [],
  courses = [],
  batches = []
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-300',
      completed: 'bg-blue-100 text-blue-800 border-blue-300',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      dropped: 'bg-red-100 text-red-800 border-red-300'
    }
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300'
  }

  const getDifficultyColor = (level) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    }
    return colors[level] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = enrollment.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enrollment.batch_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || enrollment.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'bg-green-500'
    if (percentage >= 75) return 'bg-blue-500'
    if (percentage >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <Layout>
      <Head title="My Courses" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <div className="text-sm text-gray-600">
            {enrollments.length} {enrollments.length === 1 ? 'Course' : 'Courses'} Enrolled
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <p className="text-sm font-medium text-gray-600 mb-1">Active Courses</p>
            <p className="text-3xl font-bold text-gray-900">
              {enrollments.filter(e => e.status === 'active').length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
            <p className="text-3xl font-bold text-gray-900">
              {enrollments.filter(e => e.status === 'completed').length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <p className="text-sm font-medium text-gray-600 mb-1">Total Batches</p>
            <p className="text-3xl font-bold text-gray-900">
              {new Set(enrollments.map(e => e.batch_id)).size}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <p className="text-sm font-medium text-gray-600 mb-1">Avg. Attendance</p>
            <p className="text-3xl font-bold text-gray-900">
              {enrollments.length > 0
                ? (enrollments.reduce((acc, e) => acc + (e.attendance_percentage || 0), 0) / enrollments.length).toFixed(0)
                : 0}%
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search courses or batches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="dropped">Dropped</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredEnrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEnrollments.map((enrollment) => (
              <Link
                key={enrollment.id}
                href={`/student/courses/${enrollment.course_id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"
              >
                {/* Course Header with Gradient */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-6 text-white">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold flex-1">{enrollment.course_name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${getStatusColor(enrollment.status)} bg-white`}>
                      {enrollment.status}
                    </span>
                  </div>

                  {enrollment.course_description && (
                    <p className="text-blue-100 text-sm line-clamp-2">
                      {enrollment.course_description}
                    </p>
                  )}
                </div>

                {/* Course Body */}
                <div className="p-6 space-y-4">
                  {/* Batch Info */}
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="font-medium">{enrollment.batch_name}</span>
                  </div>

                  {/* Difficulty & Duration */}
                  <div className="flex items-center gap-3">
                    {enrollment.difficulty_level && (
                      <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${getDifficultyColor(enrollment.difficulty_level)}`}>
                        {enrollment.difficulty_level}
                      </span>
                    )}
                    {enrollment.duration_months && (
                      <span className="text-sm text-gray-600">
                        {enrollment.duration_months} {enrollment.duration_months === 1 ? 'month' : 'months'}
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {enrollment.progress_percentage !== undefined && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-gray-600">Progress</span>
                        <span className="text-xs font-semibold text-gray-700">
                          {enrollment.progress_percentage.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getProgressColor(enrollment.progress_percentage)}`}
                          style={{ width: `${enrollment.progress_percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {enrollment.completed_sessions || 0} / {enrollment.total_sessions || 0} sessions
                      </p>
                    </div>
                  )}

                  {/* Stats Row */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Attendance</p>
                      <p className={`text-lg font-bold ${
                        enrollment.attendance_percentage >= 75 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {(enrollment.attendance_percentage || 0).toFixed(0)}%
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-600 mb-1">Resources</p>
                      <p className="text-lg font-bold text-blue-600">
                        {enrollment.resource_count || 0}
                      </p>
                    </div>
                  </div>

                  {/* Schedule Info */}
                  {enrollment.schedule && (
                    <div className="text-xs text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {enrollment.schedule}
                    </div>
                  )}

                  {/* Enrollment Date */}
                  <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                    Enrolled on {formatDate(enrollment.enrollment_date)}
                  </div>
                </div>

                {/* View Details Button */}
                <div className="px-6 pb-6">
                  <div className="w-full bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium py-2 px-4 rounded-lg text-center transition">
                    View Course Details
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'You are not enrolled in any courses yet'}
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}
