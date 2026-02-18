import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import Layout from '../../../Components/Layout'
import Card from '../../../Components/Card'
import Badge from '../../../Components/Badge'
import Button from '../../../Components/Button'
import TextInput from '../../../Components/TextInput'
import SelectInput from '../../../Components/SelectInput'
import DateInput from '../../../Components/DateInput'

export default function Index({ students, filters, pagination }) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '')
  const [status, setStatus] = useState(filters.status || '')
  const [enrollmentFrom, setEnrollmentFrom] = useState(filters.enrollment_from || '')
  const [enrollmentTo, setEnrollmentTo] = useState(filters.enrollment_to || '')

  const handleSearch = () => {
    router.get('/teacher/students', {
      search: searchTerm,
      status: status,
      enrollment_from: enrollmentFrom,
      enrollment_to: enrollmentTo
    }, {
      preserveState: true,
      preserveScroll: true
    })
  }

  const handleReset = () => {
    setSearchTerm('')
    setStatus('')
    setEnrollmentFrom('')
    setEnrollmentTo('')
    router.get('/teacher/students', {}, {
      preserveState: true,
      preserveScroll: true
    })
  }

  const handlePageChange = (page) => {
    router.get('/teacher/students', {
      page: page,
      search: searchTerm,
      status: status,
      enrollment_from: enrollmentFrom,
      enrollment_to: enrollmentTo
    }, {
      preserveState: true,
      preserveScroll: true
    })
  }

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' }
  ]

  return (
    <Layout>
      <Head title="Students" />

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Students</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your students and track their progress
            </p>
          </div>
          <Link href="/teacher/students/new">
            <Button variant="primary">
              Add New Student
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <TextInput
                label="Search"
                name="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or phone..."
              />
            </div>

            <SelectInput
              label="Status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={statusOptions}
              placeholder="All Statuses"
            />

            <div className="flex items-end space-x-2">
              <Button
                variant="primary"
                onClick={handleSearch}
                className="flex-1"
              >
                Search
              </Button>
              <Button
                variant="secondary"
                onClick={handleReset}
              >
                Reset
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <DateInput
              label="Enrollment From"
              name="enrollment_from"
              value={enrollmentFrom}
              onChange={(e) => setEnrollmentFrom(e.target.value)}
            />

            <DateInput
              label="Enrollment To"
              name="enrollment_to"
              value={enrollmentTo}
              onChange={(e) => setEnrollmentTo(e.target.value)}
            />
          </div>
        </Card>

        {/* Results Info */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {students.length} of {pagination.total_count} students
        </div>

        {/* Students Grid */}
        {students.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <Card key={student.id} padding={false} className="hover:shadow-lg transition-shadow duration-200">
                <Link href={`/teacher/students/${student.id}`} className="block">
                  <div className="p-6">
                    {/* Avatar Placeholder */}
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                          {student.first_name?.charAt(0) || 'S'}{student.last_name?.charAt(0) || ''}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {student.full_name}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">{student.email}</p>
                        {student.phone && (
                          <p className="text-sm text-gray-500">{student.phone}</p>
                        )}
                      </div>

                      <Badge variant={student.status}>
                        {student.status}
                      </Badge>
                    </div>

                    {/* Student Details */}
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Enrollment Date:</span>
                        <span className="font-medium text-gray-900">
                          {student.enrollment_date ? new Date(student.enrollment_date).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Batches:</span>
                        <span className="font-medium text-gray-900">
                          {student.batch_count || 0}
                        </span>
                      </div>

                      {student.guardian_name && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Guardian:</span>
                          <span className="font-medium text-gray-900 truncate ml-2">
                            {student.guardian_name}
                          </span>
                        </div>
                      )}

                      {student.attendance_percentage !== null && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Attendance:</span>
                          <span className="font-medium text-gray-900">
                            {student.attendance_percentage}%
                          </span>
                        </div>
                      )}

                      {student.payment_status && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Payment Status:</span>
                          <Badge variant={student.payment_status}>
                            {student.payment_status}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  {student.batches && (
                    <div className="border-t border-gray-200 px-6 py-3 bg-gray-50">
                      <p className="text-xs text-gray-600 truncate">
                        <span className="font-medium">Classes:</span> {student.batches || 'No batches'}
                      </p>
                    </div>
                  )}
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filters.search || filters.status ? 'Try adjusting your filters' : 'Get started by adding a new student'}
              </p>
              {!filters.search && !filters.status && (
                <div className="mt-6">
                  <Link href="/teacher/students/new">
                    <Button variant="primary">
                      Add New Student
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page {pagination.current_page} of {pagination.total_pages}
            </div>

            <div className="flex space-x-2">
              <Button
                variant="secondary"
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
              >
                Previous
              </Button>

              {[...Array(pagination.total_pages)].map((_, index) => {
                const page = index + 1
                // Show first page, last page, current page, and pages around current page
                if (
                  page === 1 ||
                  page === pagination.total_pages ||
                  (page >= pagination.current_page - 2 && page <= pagination.current_page + 2)
                ) {
                  return (
                    <Button
                      key={page}
                      variant={page === pagination.current_page ? 'primary' : 'secondary'}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  )
                } else if (
                  page === pagination.current_page - 3 ||
                  page === pagination.current_page + 3
                ) {
                  return <span key={page} className="px-2 py-2">...</span>
                }
                return null
              })}

              <Button
                variant="secondary"
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.total_pages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
