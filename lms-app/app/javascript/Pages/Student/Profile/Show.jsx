import { Head, Link } from '@inertiajs/react'
import Layout from '@components/Layout'
import { Card, Button, Badge, StatusBadge, Avatar, StatCard, EmptyState } from '@components/UI'

const icons = {
  edit: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  )
}

export default function StudentProfileShow({
  student = {},
  enrollments = [],
  attendance_stats = {},
  payment_stats = {}
}) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600'
    if (percentage >= 75) return 'text-blue-600'
    if (percentage >= 60) return 'text-amber-600'
    return 'text-red-600'
  }

  return (
    <Layout>
      <Head title="My Profile" />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-500 text-sm mt-1">View and manage your profile information</p>
          </div>
          <Link href="/student/profile/edit" className="btn-primary">
            {icons.edit}
            <span>Edit Profile</span>
          </Link>
        </div>

        <Card padding={false} className="overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 h-24"></div>
          <div className="px-6 pb-6">
            <div className="flex items-end -mt-10 mb-6">
              <Avatar 
                name={student.name || 'Student'} 
                size="xl"
                className="ring-4 ring-white"
              />
              <div className="ml-6 pb-1">
                <h2 className="text-xl font-bold text-gray-900">{student.name || 'Student Name'}</h2>
                <p className="text-gray-500">{student.email || 'email@example.com'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-2">Personal Information</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-900">{student.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{student.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{student.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date of Birth</p>
                    <p className="font-medium text-gray-900">{formatDate(student.date_of_birth)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-2">Contact Information</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500">Address</p>
                    <p className="font-medium text-gray-900">{student.address || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">City</p>
                    <p className="font-medium text-gray-900">{student.city || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">State</p>
                    <p className="font-medium text-gray-900">{student.state || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Postal Code</p>
                    <p className="font-medium text-gray-900">{student.postal_code || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-2">Guardian Information</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500">Guardian Name</p>
                    <p className="font-medium text-gray-900">{student.guardian_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Guardian Phone</p>
                    <p className="font-medium text-gray-900">{student.guardian_phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Relationship</p>
                    <p className="font-medium text-gray-900 capitalize">{student.guardian_relationship || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="text-center">
            <p className="text-sm text-gray-500 mb-1">Enrolled Courses</p>
            <p className="text-2xl font-bold text-gray-900">{enrollments.length || 0}</p>
          </Card>
          <Card className="text-center">
            <p className="text-sm text-gray-500 mb-1">Attendance Rate</p>
            <p className={`text-2xl font-bold ${getAttendanceColor(attendance_stats.percentage || 0)}`}>
              {(attendance_stats.percentage || 0).toFixed(1)}%
            </p>
          </Card>
          <Card className="text-center">
            <p className="text-sm text-gray-500 mb-1">Total Classes</p>
            <p className="text-2xl font-bold text-gray-900">{attendance_stats.total_classes || 0}</p>
          </Card>
          <Card className="text-center">
            <p className="text-sm text-gray-500 mb-1">Outstanding Dues</p>
            <p className={`text-2xl font-bold ${payment_stats.outstanding > 0 ? 'text-red-600' : 'text-green-600'}`}>
              ₹{(payment_stats.outstanding || 0).toLocaleString()}
            </p>
          </Card>
        </div>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Enrolled Courses</h2>
            <Link href="/student/courses" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View All
            </Link>
          </div>

          {enrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enrollments.map((enrollment, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4 hover:border-primary-200 transition-colors">
                  <h3 className="font-semibold text-gray-900 mb-1">{enrollment.course_name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{enrollment.batch_name}</p>
                  <div className="flex items-center justify-between">
                    <StatusBadge status={enrollment.status} />
                    <span className="text-xs text-gray-500">{formatDate(enrollment.enrollment_date)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No courses enrolled"
              description="You haven't enrolled in any courses yet"
            />
          )}
        </Card>
      </div>
    </Layout>
  )
}
