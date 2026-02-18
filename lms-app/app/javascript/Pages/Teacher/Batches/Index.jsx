import { Head, Link } from '@inertiajs/react'
import Layout from '@components/Layout'

export default function BatchesIndex({ batches = [] }) {
  const getStatusBadgeColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getClassTypeBadge = (classType) => {
    const badges = {
      one_on_one: '1-on-1',
      group: 'Group',
    }
    return badges[classType] || classType
  }

  return (
    <Layout>
      <Head title="My Batches" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">My Batches</h1>
          <Link
            href="/teacher/batches/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            + Create Batch
          </Link>
        </div>

        {batches.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No batches created yet</p>
            <Link
              href="/teacher/batches/new"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              Create Your First Batch
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batches.map((batch) => (
              <div
                key={batch.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {batch.name}
                      </h3>
                      <p className="text-sm text-gray-600">{batch.course_name}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                        batch.status
                      )}`}
                    >
                      {batch.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">Type:</span>
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                        {getClassTypeBadge(batch.class_type)}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">Students:</span>
                      <span>
                        {batch.student_count}
                        {batch.max_students && ` / ${batch.max_students}`}
                        {batch.available_seats !== null && batch.available_seats > 0 && (
                          <span className="text-green-600 ml-1">
                            ({batch.available_seats} seats available)
                          </span>
                        )}
                        {batch.available_seats === 0 && (
                          <span className="text-red-600 ml-1">(Full)</span>
                        )}
                      </span>
                    </div>

                    {batch.schedule && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium mr-2">Schedule:</span>
                        <span>{batch.schedule}</span>
                      </div>
                    )}

                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">Duration:</span>
                      <span>
                        {batch.start_date}
                        {batch.end_date && ` - ${batch.end_date}`}
                      </span>
                    </div>

                    {batch.current_fee && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium mr-2">Fee:</span>
                        <span className="text-green-700 font-semibold">
                          ₹{batch.current_fee}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      href={`/teacher/batches/${batch.id}`}
                      className="flex-1 text-center px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-md transition-colors"
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/teacher/batches/${batch.id}/edit`}
                      className="flex-1 text-center px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-md transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
