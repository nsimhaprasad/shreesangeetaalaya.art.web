import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import Layout from '@components/Layout'
import { 
  Card, Button, Badge, Avatar, Progress, EmptyState,
  Input, Select, SearchInput, ConfirmModal 
} from '@components/UI'

const icons = {
  plus: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  filter: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  ),
  chevronRight: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}

export default function StudentIndex({ students, filters, pagination }) {
  const [searchTerm, setSearchTerm] = useState(filters?.search || '')
  const [status, setStatus] = useState(filters?.status || '')
  const [showFilters, setShowFilters] = useState(false)
  const [deleteModal, setDeleteModal] = useState({ open: false, student: null })

  const handleSearch = () => {
    router.get('/teacher/students', {
      search: searchTerm,
      status: status,
    }, { preserveState: true, preserveScroll: true })
  }

  const handleReset = () => {
    setSearchTerm('')
    setStatus('')
    router.get('/teacher/students', {}, { preserveState: true })
  }

  const handlePageChange = (page) => {
    router.get('/teacher/students', {
      page,
      search: searchTerm,
      status: status,
    }, { preserveState: true, preserveScroll: true })
  }

  const handleDelete = () => {
    if (deleteModal.student) {
      router.delete(`/teacher/students/${deleteModal.student.id}`)
      setDeleteModal({ open: false, student: null })
    }
  }

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ]

  return (
    <Layout>
      <Head title="Students" />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">Students</h1>
            <p className="text-gray-500 text-sm mt-1">Manage and track your students</p>
          </div>
          <Link href="/teacher/students/new" className="btn-primary">
            {icons.plus}
            <span>Add Student</span>
          </Link>
        </div>

        <Card>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchInput
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClear={searchTerm ? () => setSearchTerm('') : undefined}
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={statusOptions}
                className="w-40"
              />
              <Button onClick={handleSearch}>Search</Button>
              <Button variant="ghost" onClick={handleReset}>Reset</Button>
            </div>
          </div>
        </Card>

        {pagination && (
          <p className="text-sm text-gray-500">
            Showing {students?.length || 0} of {pagination.total_count || 0} students
          </p>
        )}

        {students && students.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {students.map((student) => (
              <Link
                key={student.id}
                href={`/teacher/students/${student.id}`}
                className="block"
              >
                <Card hover className="h-full">
                  <div className="flex items-start gap-4">
                    <Avatar 
                      name={`${student.first_name} ${student.last_name}`} 
                      src={student.avatar_url}
                      size="lg"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {student.full_name || `${student.first_name} ${student.last_name}`}
                        </h3>
                        <StatusBadge status={student.status} />
                      </div>
                      <p className="text-sm text-gray-500 truncate">{student.email}</p>
                      {student.phone && (
                        <p className="text-xs text-gray-400">{student.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Batches</p>
                      <p className="font-medium text-gray-900">{student.batch_count || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Attendance</p>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {student.attendance_percentage || 0}%
                        </span>
                        {(student.attendance_percentage || 0) < 75 && (
                          <span className="w-2 h-2 bg-amber-500 rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center text-sm text-primary-600">
                    <span>View details</span>
                    {icons.chevronRight}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            title="No students found"
            description={searchTerm || status ? "Try adjusting your search filters" : "Add your first student to get started"}
            action={
              !searchTerm && !status && (
                <Link href="/teacher/students/new" className="btn-primary">
                  Add Student
                </Link>
              )
            }
          />
        )}

        {pagination && pagination.total_pages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600 px-4">
              Page {pagination.current_page} of {pagination.total_pages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.total_pages}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, student: null })}
        onConfirm={handleDelete}
        title="Delete Student"
        message={`Are you sure you want to delete ${deleteModal.student?.full_name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </Layout>
  )
}
