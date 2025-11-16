import { Head, Link } from '@inertiajs/react'
import Layout from '@components/Layout'

export default function StudentProfileShow({
  student = {},
  enrollments = [],
  attendance_stats = {},
  payment_stats = {}
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

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600'
    if (percentage >= 75) return 'text-blue-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <Layout>
      <Head title="My Profile" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <Link
            href="/student/profile/edit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            Edit Profile
          </Link>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-32"></div>
          <div className="px-6 pb-6">
            <div className="flex items-end -mt-16 mb-6">
              <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-4xl font-bold text-blue-600">
                {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="ml-6 pb-2">
                <h2 className="text-2xl font-bold text-gray-900">{student.name || 'Student Name'}</h2>
                <p className="text-gray-600">{student.email || 'email@example.com'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">Personal Information</h3>

                <div>
                  <label className="text-sm font-medium text-gray-600">Full Name</label>
                  <p className="text-gray-900">{student.name || 'N/A'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{student.email || 'N/A'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-gray-900">{student.phone || 'N/A'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                  <p className="text-gray-900">{formatDate(student.date_of_birth)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Gender</label>
                  <p className="text-gray-900 capitalize">{student.gender || 'N/A'}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">Contact Information</h3>

                <div>
                  <label className="text-sm font-medium text-gray-600">Address</label>
                  <p className="text-gray-900">{student.address || 'N/A'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">City</label>
                  <p className="text-gray-900">{student.city || 'N/A'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">State</label>
                  <p className="text-gray-900">{student.state || 'N/A'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Postal Code</label>
                  <p className="text-gray-900">{student.postal_code || 'N/A'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Country</label>
                  <p className="text-gray-900">{student.country || 'N/A'}</p>
                </div>
              </div>

              {/* Guardian Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">Guardian Information</h3>

                <div>
                  <label className="text-sm font-medium text-gray-600">Guardian Name</label>
                  <p className="text-gray-900">{student.guardian_name || 'N/A'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Guardian Phone</label>
                  <p className="text-gray-900">{student.guardian_phone || 'N/A'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Guardian Email</label>
                  <p className="text-gray-900">{student.guardian_email || 'N/A'}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Relationship</label>
                  <p className="text-gray-900 capitalize">{student.guardian_relationship || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            {(student.emergency_contact || student.medical_conditions || student.notes) && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-lg text-gray-900 mb-4">Additional Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {student.emergency_contact && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Emergency Contact</label>
                      <p className="text-gray-900">{student.emergency_contact}</p>
                    </div>
                  )}

                  {student.medical_conditions && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Medical Conditions</label>
                      <p className="text-gray-900">{student.medical_conditions}</p>
                    </div>
                  )}

                  {student.notes && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Notes</label>
                      <p className="text-gray-900">{student.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Enrolled Courses</p>
                <p className="text-3xl font-bold text-gray-900">{enrollments.length || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Attendance Rate</p>
                <p className={`text-3xl font-bold ${getAttendanceColor(attendance_stats.percentage || 0)}`}>
                  {(attendance_stats.percentage || 0).toFixed(1)}%
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
                <p className="text-sm font-medium text-gray-600 mb-1">Total Classes</p>
                <p className="text-3xl font-bold text-gray-900">{attendance_stats.total_classes || 0}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Outstanding Dues</p>
                <p className={`text-3xl font-bold ${payment_stats.outstanding > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ₹{(payment_stats.outstanding || 0).toLocaleString()}
                </p>
              </div>
              <div className={`w-12 h-12 ${payment_stats.outstanding > 0 ? 'bg-red-100' : 'bg-green-100'} rounded-full flex items-center justify-center`}>
                <svg className={`w-6 h-6 ${payment_stats.outstanding > 0 ? 'text-red-600' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Enrolled Courses */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Enrolled Courses</h2>
            <Link
              href="/student/courses"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Courses
            </Link>
          </div>

          {enrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enrollments.map((enrollment, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{enrollment.course_name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{enrollment.batch_name}</p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                      enrollment.status === 'active' ? 'bg-green-100 text-green-800' :
                      enrollment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {enrollment.status}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Enrolled:</span>
                      <span className="text-gray-900">{formatDate(enrollment.enrollment_date)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="mt-2">No courses enrolled</p>
            </div>
          )}
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Student ID</label>
              <p className="text-gray-900">{student.id || 'N/A'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Registration Date</label>
              <p className="text-gray-900">{formatDate(student.created_at)}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Account Status</label>
              <span className={`inline-block px-2 py-1 rounded text-xs font-semibold uppercase ${
                student.status === 'active' ? 'bg-green-100 text-green-800' :
                student.status === 'inactive' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {student.status || 'Active'}
              </span>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Last Updated</label>
              <p className="text-gray-900">{formatDate(student.updated_at)}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
