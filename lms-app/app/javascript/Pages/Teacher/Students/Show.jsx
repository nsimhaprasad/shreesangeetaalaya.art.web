import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import Layout from '@components/Layout'
import { 
  Card, CardHeader, CardTitle, Button, Badge, Avatar, Progress, 
  StatusBadge, ConfirmModal, EmptyState 
} from '@components/UI'

const icons = {
  arrowLeft: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  edit: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  trash: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  phone: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  mail: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  calendar: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  location: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

export default function StudentShow({ student }) {
  const [deleteModal, setDeleteModal] = useState(false)

  const handleDelete = () => {
    router.delete(`/teacher/students/${student.id}`)
  }

  const attendancePercentage = student?.attendance_summary?.percentage || 0
  const attendanceColor = attendancePercentage >= 75 ? 'success' : attendancePercentage >= 50 ? 'warning' : 'danger'

  return (
    <Layout>
      <Head title={`${student?.full_name || 'Student'} - Profile`} />

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/teacher/students" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            {icons.arrowLeft}
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-display font-bold text-gray-900">Student Profile</h1>
          </div>
          <div className="flex gap-2">
            <Link href={`/teacher/students/${student?.id}/edit`} className="btn-outline">
              {icons.edit}
              <span className="hidden sm:inline">Edit</span>
            </Link>
            <Button variant="danger" onClick={() => setDeleteModal(true)}>
              {icons.trash}
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <Avatar 
                  name={student?.full_name || 'Student'} 
                  src={student?.avatar_url}
                  size="xl"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-semibold text-gray-900">{student?.full_name}</h2>
                    <StatusBadge status={student?.status} />
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      {icons.mail}
                      <span>{student?.email}</span>
                    </div>
                    {student?.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        {icons.phone}
                        <span>{student.phone}</span>
                      </div>
                    )}
                    {student?.enrollment_date && (
                      <div className="flex items-center gap-2 text-gray-600">
                        {icons.calendar}
                        <span>Enrolled: {new Date(student.enrollment_date).toLocaleDateString('en-IN')}</span>
                      </div>
                    )}
                    {student?.address && (
                      <div className="flex items-center gap-2 text-gray-600">
                        {icons.location}
                        <span>{student.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {(student?.guardian_name || student?.guardian_phone || student?.guardian_email) && (
              <Card>
                <CardTitle>Guardian Information</CardTitle>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {student?.guardian_name && (
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium text-gray-900">{student.guardian_name}</p>
                    </div>
                  )}
                  {student?.guardian_phone && (
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{student.guardian_phone}</p>
                    </div>
                  )}
                  {student?.guardian_email && (
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{student.guardian_email}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            <Card>
              <CardTitle>Enrolled Batches</CardTitle>
              {student?.batches && student.batches.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {student.batches.map((batch) => (
                    <Link
                      key={batch.id}
                      href={`/teacher/batches/${batch.id}`}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{batch.name}</p>
                        <p className="text-sm text-gray-500">{batch.course_name}</p>
                      </div>
                      <Badge variant="primary">{batch.schedule}</Badge>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No batches enrolled"
                  description="This student is not enrolled in any batches yet."
                />
              )}
            </Card>

            {student?.notes && (
              <Card>
                <CardTitle>Notes</CardTitle>
                <p className="mt-4 text-gray-600 whitespace-pre-wrap">{student.notes}</p>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardTitle>Attendance</CardTitle>
              <div className="mt-4 text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">{attendancePercentage}%</div>
                <Progress value={attendancePercentage} color={attendanceColor} className="mb-4" />
                <p className="text-sm text-gray-500">
                  {student?.attendance_summary?.present || 0} present of {student?.attendance_summary?.total_classes || 0} classes
                </p>
              </div>
              {attendancePercentage < 75 && (
                <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                  <p className="text-sm text-amber-700">
                    Attendance is below 75%. Please encourage the student to attend more classes.
                  </p>
                </div>
              )}
            </Card>

            <Card>
              <CardTitle>Payment Summary</CardTitle>
              <div className="mt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Total Paid</span>
                  <span className="font-semibold text-green-600">
                    ₹{(student?.payment_summary?.total_paid || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Pending</span>
                  <span className="font-semibold text-amber-600">
                    ₹{(student?.payment_summary?.pending || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                {student?.payment_summary?.last_payment && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Last Payment</span>
                    <span className="text-gray-700">
                      {new Date(student.payment_summary.last_payment).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                )}
                <Link 
                  href={`/teacher/payments/new?student_id=${student?.id}`}
                  className="btn-primary w-full mt-2"
                >
                  Record Payment
                </Link>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white">
              <h3 className="font-semibold mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <Link 
                  href={`/teacher/attendances?student_id=${student?.id}`}
                  className="block w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm text-center transition-colors"
                >
                  View Attendance
                </Link>
                <Link 
                  href={`/teacher/payments?student_id=${student?.id}`}
                  className="block w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm text-center transition-colors"
                >
                  Payment History
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Student"
        message={`Are you sure you want to delete ${student?.full_name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </Layout>
  )
}
