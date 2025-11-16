import { Head, Link, router } from '@inertiajs/react'
import Layout from '../../../Components/Layout'
import Card from '../../../Components/Card'
import Badge from '../../../Components/Badge'
import Button from '../../../Components/Button'

export default function Show({ student }) {
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      router.delete(`/teacher/students/${student.id}`)
    }
  }

  return (
    <Layout>
      <Head title={`${student.full_name} - Student Profile`} />

      <div className="mb-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <Link href="/teacher/students" className="text-blue-600 hover:text-blue-800 text-sm mb-2 inline-block">
              &larr; Back to Students
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{student.full_name}</h1>
            <p className="mt-1 text-sm text-gray-600">Student Profile</p>
          </div>
          <div className="flex space-x-2">
            <Link href={`/teacher/students/${student.id}/edit`}>
              <Button variant="primary">
                Edit Student
              </Button>
            </Link>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>

        {/* Main Profile Card */}
        <Card className="mb-6">
          <div className="flex items-start space-x-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {student.avatar_url ? (
                <img
                  src={student.avatar_url}
                  alt={student.full_name}
                  className="h-32 w-32 rounded-full object-cover"
                />
              ) : (
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                  {student.first_name?.charAt(0) || 'S'}{student.last_name?.charAt(0) || ''}
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{student.full_name}</h2>
                <Badge variant={student.status}>{student.status}</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="mt-1 text-sm text-gray-900">{student.email}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="mt-1 text-sm text-gray-900">{student.phone || 'N/A'}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Enrollment Date</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {student.enrollment_date ? new Date(student.enrollment_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>

                {student.address && (
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="mt-1 text-sm text-gray-900">{student.address}</p>
                  </div>
                )}

                {student.preferred_class_time && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Preferred Class Time</p>
                    <p className="mt-1 text-sm text-gray-900">{student.preferred_class_time}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Guardian Information */}
        {(student.guardian_name || student.guardian_phone || student.guardian_email) && (
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Guardian Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {student.guardian_name && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Guardian Name</p>
                  <p className="mt-1 text-sm text-gray-900">{student.guardian_name}</p>
                </div>
              )}

              {student.guardian_phone && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Guardian Phone</p>
                  <p className="mt-1 text-sm text-gray-900">{student.guardian_phone}</p>
                </div>
              )}

              {student.guardian_email && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Guardian Email</p>
                  <p className="mt-1 text-sm text-gray-900">{student.guardian_email}</p>
                </div>
              )}
            </div>

            {student.emergency_contact && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">Emergency Contact</p>
                <p className="mt-1 text-sm text-gray-900">{student.emergency_contact}</p>
              </div>
            )}
          </Card>
        )}

        {/* Batch Enrollments */}
        <Card className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrolled Batches</h3>
          {student.batches && student.batches.length > 0 ? (
            <div className="space-y-3">
              {student.batches.map((batch) => (
                <div key={batch.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{batch.name}</p>
                    <p className="text-sm text-gray-600">{batch.course_name}</p>
                    {batch.schedule && (
                      <p className="text-xs text-gray-500 mt-1">{batch.schedule}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Not enrolled in any batches yet</p>
          )}

          {student.batch_enrollments && student.batch_enrollments.length > 0 && (
            <div className="mt-6">
              <h4 className="text-md font-semibold text-gray-900 mb-3">Enrollment History</h4>
              <div className="space-y-2">
                {student.batch_enrollments.map((enrollment) => (
                  <div key={enrollment.id} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium text-gray-900">{enrollment.batch_name}</span>
                      <span className="text-gray-500 mx-2">-</span>
                      <span className="text-gray-600">{enrollment.course_name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-500">
                        {new Date(enrollment.enrolled_at).toLocaleDateString()}
                      </span>
                      <Badge variant={enrollment.status}>{enrollment.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Attendance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Summary</h3>
            {student.attendance_summary && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Classes</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {student.attendance_summary.total_classes}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Present</span>
                  <span className="text-lg font-semibold text-green-600">
                    {student.attendance_summary.present}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Absent</span>
                  <span className="text-lg font-semibold text-red-600">
                    {student.attendance_summary.absent}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Attendance Rate</span>
                    <span className="text-xl font-bold text-blue-600">
                      {student.attendance_summary.percentage}%
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${student.attendance_summary.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {student.recent_attendance && student.recent_attendance.length > 0 && (
              <div className="mt-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Recent Attendance</h4>
                <div className="space-y-2">
                  {student.recent_attendance.map((attendance) => (
                    <div key={attendance.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {attendance.date ? new Date(attendance.date).toLocaleDateString() : 'N/A'}
                      </span>
                      <Badge variant={attendance.status === 'present' ? 'success' : 'danger'}>
                        {attendance.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Payment Summary */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
            {student.payment_summary && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Paid</span>
                  <span className="text-lg font-semibold text-green-600">
                    ${student.payment_summary.total_paid || 0}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="text-lg font-semibold text-yellow-600">
                    ${student.payment_summary.pending || 0}
                  </span>
                </div>

                {student.payment_summary.last_payment && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last Payment</span>
                    <span className="text-sm text-gray-900">
                      {new Date(student.payment_summary.last_payment).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            )}

            {student.recent_payments && student.recent_payments.length > 0 && (
              <div className="mt-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Recent Payments</h4>
                <div className="space-y-2">
                  {student.recent_payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium text-gray-900">${payment.amount}</span>
                        <span className="text-gray-500 mx-2">-</span>
                        <span className="text-gray-600">
                          {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <Badge variant={payment.status}>{payment.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Notes */}
        {student.notes && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{student.notes}</p>
          </Card>
        )}
      </div>
    </Layout>
  )
}
