import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import Layout from '../../../Components/Layout'
import Card from '../../../Components/Card'
import Badge from '../../../Components/Badge'
import Button from '../../../Components/Button'
import TextInput from '../../../Components/TextInput'
import SelectInput from '../../../Components/SelectInput'

export default function Index({ fee_structures, filters, pagination, class_types, fee_types }) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '')
  const [classType, setClassType] = useState(filters.class_type || '')
  const [feeType, setFeeType] = useState(filters.fee_type || '')
  const [status, setStatus] = useState(filters.status || '')

  const handleSearch = () => {
    router.get('/admin/fee_structures', {
      search: searchTerm,
      class_type: classType,
      fee_type: feeType,
      status: status
    }, {
      preserveState: true,
      preserveScroll: true
    })
  }

  const handleReset = () => {
    setSearchTerm('')
    setClassType('')
    setFeeType('')
    setStatus('')
    router.get('/admin/fee_structures', {}, {
      preserveState: true,
      preserveScroll: true
    })
  }

  const handlePageChange = (page) => {
    router.get('/admin/fee_structures', {
      page: page,
      search: searchTerm,
      class_type: classType,
      fee_type: feeType,
      status: status
    }, {
      preserveState: true,
      preserveScroll: true
    })
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this fee structure?')) {
      router.delete(`/admin/fee_structures/${id}`)
    }
  }

  const classTypeOptions = class_types.map(type => ({
    value: type,
    label: type.replace('_', '-')
  }))

  const feeTypeOptions = fee_types.map(type => ({
    value: type,
    label: type.replace('_', ' ')
  }))

  const statusOptions = [
    { value: 'current', label: 'Current' },
    { value: 'active', label: 'Active' }
  ]

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  return (
    <Layout>
      <Head title="Fee Structures" />

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fee Structures</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage fee structures for batches
            </p>
          </div>
          <div className="flex space-x-3">
            <Link href="/admin/fee_structures/history">
              <Button variant="secondary">
                View History
              </Button>
            </Link>
            <Link href="/admin/fee_structures/new">
              <Button variant="primary">
                Create Fee Structure
              </Button>
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <TextInput
                label="Search by Batch"
                name="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by batch name..."
              />
            </div>

            <SelectInput
              label="Class Type"
              name="class_type"
              value={classType}
              onChange={(e) => setClassType(e.target.value)}
              options={classTypeOptions}
              placeholder="All Types"
            />

            <SelectInput
              label="Fee Type"
              name="fee_type"
              value={feeType}
              onChange={(e) => setFeeType(e.target.value)}
              options={feeTypeOptions}
              placeholder="All Types"
            />

            <SelectInput
              label="Status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={statusOptions}
              placeholder="All"
            />
          </div>

          <div className="flex space-x-2 mt-4">
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
        </Card>

        {/* Results Info */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {fee_structures.length} of {pagination.total_count} fee structures
        </div>

        {/* Fee Structures Table */}
        {fee_structures.length > 0 ? (
          <Card padding={false}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Batch
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fee Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Effective Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fee_structures.map((feeStructure) => (
                    <tr key={feeStructure.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {feeStructure.batch_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {feeStructure.course_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="info">
                          {feeStructure.class_type.replace('_', '-')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {feeStructure.fee_type.replace('_', ' ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatAmount(feeStructure.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(feeStructure.effective_from).toLocaleDateString()}
                          {feeStructure.effective_to && (
                            <> - {new Date(feeStructure.effective_to).toLocaleDateString()}</>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {feeStructure.current ? (
                          <Badge variant="success">Current</Badge>
                        ) : feeStructure.active ? (
                          <Badge variant="warning">Future</Badge>
                        ) : (
                          <Badge variant="secondary">Expired</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link href={`/admin/fee_structures/${feeStructure.id}/edit`}>
                            <Button variant="secondary" size="sm">
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(feeStructure.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No fee structures found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filters.search || filters.class_type ? 'Try adjusting your filters' : 'Get started by creating a new fee structure'}
              </p>
              {!filters.search && !filters.class_type && (
                <div className="mt-6">
                  <Link href="/admin/fee_structures/new">
                    <Button variant="primary">
                      Create Fee Structure
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
