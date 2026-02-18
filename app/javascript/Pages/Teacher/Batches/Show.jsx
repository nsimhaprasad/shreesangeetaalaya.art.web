import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import Layout from '@components/Layout'
import { 
  Card, CardTitle, Button, Badge, Avatar, StatusBadge, Progress,
  ConfirmModal, EmptyState, StatCard 
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
  calendar: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  plus: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  trash: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
}

export default function BatchShow({ batch }) {
  const [removeModal, setRemoveModal] = useState({ open: false, student: null })

  const handleRemoveStudent = () => {
    if (removeModal.student) {
      router.delete(`/teacher/batches/${batch?.id}/batch_enrollments/${removeModal.student.enrollment_id}`)
      setRemoveModal({ open: false, student: null })
    }
  }

  const capacityPercentage = batch?.max_students 
    ? ((batch?.enrollment_count || 0) / batch.max_students) * 100 
    : 0

  return (
    <Layout>
      <Head title={batch?.name || 'Batch'} />

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/teacher/batches" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            {icons.arrowLeft}
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-display font-bold text-gray-900">{batch?.name}</h1>
            <p className="text-gray-500 text-sm">{batch?.course?.name}</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/teacher/batches/${batch?.id}/edit`} className="btn-outline">
              {icons.edit}
              <span className="hidden sm:inline">Edit</span>
            </Link>
            <Link href={`/teacher/class_sessions/new?batch_id=${batch?.id}`} className="btn-primary">
              {icons.calendar}
              <span className="hidden sm:inline">Schedule</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="text-center">
            <p className="text-sm text-gray-500 mb-1">Status</p>
            <StatusBadge status={batch?.status} />
          </Card>
          <Card className="text-center">
            <p className="text-sm text-gray-500 mb-1">Type</p>
            <p className="font-semibold">{batch?.class_type === 'one_on_one' ? '1-on-1' : 'Group'}</p>
          </Card>
          <Card className="text-center">
            <p className="text-sm text-gray-500 mb-1">Students</p>
            <p className="font-semibold">{batch?.enrollment_count || 0}{batch?.max_students ? ` / ${batch.max_students}` : ''}</p>
            {batch?.max_students && (
              <Progress value={batch.enrollment_count || 0} max={batch.max_students} size="sm" className="mt-2" />
            )}
          </Card>
          <Card className="text-center">
            <p className="text-sm text-gray-500 mb-1">Fee</p>
            <p className="font-semibold text-green-600">
              {batch?.fee_structure ? `₹${batch.fee_structure.amount}` : 'Not set'}
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card padding={false}>
              <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
                <CardTitle className="mb-0">Students ({batch?.students?.length || 0})</CardTitle>
                <Button size="sm">
                  {icons.plus}
                  Add Student
                </Button>
              </div>
              {batch?.students && batch.students.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {batch.students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <Avatar name={student.name} size="md" />
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={student.status} />
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setRemoveModal({ open: true, student })}
                        >
                          {icons.trash}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No students enrolled"
                  description="Add students to this batch to get started"
                />
              )}
            </Card>

            <Card padding={false}>
              <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
                <CardTitle className="mb-0">Upcoming Sessions</CardTitle>
                <Link href={`/teacher/class_sessions?batch_id=${batch?.id}`} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  View all
                </Link>
              </div>
              {batch?.upcoming_sessions && batch.upcoming_sessions.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {batch.upcoming_sessions.slice(0, 5).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 sm:p-5">
                      <div>
                        <p className="font-medium text-gray-900">{session.topic || 'Class Session'}</p>
                        <p className="text-sm text-gray-500">{session.class_date} at {session.class_time}</p>
                      </div>
                      <StatusBadge status={session.status} />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No upcoming sessions"
                  description="Schedule class sessions for this batch"
                  action={
                    <Link href={`/teacher/class_sessions/new?batch_id=${batch?.id}`} className="btn-primary">
                      Schedule Session
                    </Link>
                  }
                />
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardTitle>Batch Details</CardTitle>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Teacher</p>
                  <p className="font-medium text-gray-900">{batch?.teacher?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Schedule</p>
                  <p className="font-medium text-gray-900">{batch?.schedule || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium text-gray-900">
                    {batch?.start_date}{batch?.end_date ? ` - ${batch.end_date}` : ' - Ongoing'}
                  </p>
                </div>
                {batch?.description && (
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="text-gray-700">{batch.description}</p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white">
              <h3 className="font-semibold mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <Link 
                  href={`/teacher/attendances?batch_id=${batch?.id}`}
                  className="block w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm text-center transition-colors"
                >
                  Mark Attendance
                </Link>
                <Link 
                  href={`/teacher/payments/new?batch_id=${batch?.id}`}
                  className="block w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm text-center transition-colors"
                >
                  Record Payment
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={removeModal.open}
        onClose={() => setRemoveModal({ open: false, student: null })}
        onConfirm={handleRemoveStudent}
        title="Remove Student"
        message={`Remove ${removeModal.student?.name} from this batch?`}
        confirmText="Remove"
        variant="danger"
      />
    </Layout>
  )
}
