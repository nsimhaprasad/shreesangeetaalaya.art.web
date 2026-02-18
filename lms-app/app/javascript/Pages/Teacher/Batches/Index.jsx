import { Head, Link } from '@inertiajs/react'
import Layout from '@components/Layout'
import { Card, Button, Badge, StatusBadge, Progress, EmptyState, StatCard } from '@components/UI'

const icons = {
  plus: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  users: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  calendar: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  chevronRight: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}

export default function BatchesIndex({ batches = [] }) {
  return (
    <Layout>
      <Head title="My Batches" />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">My Batches</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your class batches and groups</p>
          </div>
          <Link href="/teacher/batches/new" className="btn-primary">
            {icons.plus}
            <span>Create Batch</span>
          </Link>
        </div>

        {batches.length === 0 ? (
          <EmptyState
            icon={icons.users}
            title="No batches yet"
            description="Create your first batch to start organizing students into classes"
            action={
              <Link href="/teacher/batches/new" className="btn-primary">
                Create First Batch
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {batches.map((batch) => (
              <Link key={batch.id} href={`/teacher/batches/${batch.id}`}>
                <Card hover className="h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{batch.name}</h3>
                      <p className="text-sm text-gray-500">{batch.course_name}</p>
                    </div>
                    <StatusBadge status={batch.status} />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Type</span>
                      <Badge variant={batch.class_type === 'one_on_one' ? 'primary' : 'info'}>
                        {batch.class_type === 'one_on_one' ? '1-on-1' : 'Group'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Students</span>
                      <span className="font-medium">
                        {batch.student_count || 0}
                        {batch.max_students && ` / ${batch.max_students}`}
                      </span>
                    </div>

                    {batch.max_students && (
                      <Progress 
                        value={batch.student_count || 0} 
                        max={batch.max_students}
                        size="sm"
                        color={(batch.student_count || 0) >= batch.max_students ? 'danger' : 'primary'}
                      />
                    )}

                    {batch.schedule && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Schedule</span>
                        <span className="text-gray-700">{batch.schedule}</span>
                      </div>
                    )}

                    {batch.current_fee && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Fee</span>
                        <span className="font-semibold text-green-600">₹{batch.current_fee}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-primary-600">
                    <span>View details</span>
                    {icons.chevronRight}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
