import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import Layout from '../../../Components/Layout'
import Card from '../../../Components/Card'
import Badge from '../../../Components/Badge'
import Button from '../../../Components/Button'
import TextInput from '../../../Components/TextInput'
import SelectInput from '../../../Components/SelectInput'
import DateInput from '../../../Components/DateInput'

export default function Index({ payments, batches, filters, summary, pagination, payment_methods }) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '')
  const [paymentMethod, setPaymentMethod] = useState(filters.payment_method || '')
  const [fromDate, setFromDate] = useState(filters.from_date || '')
  const [toDate, setToDate] = useState(filters.to_date || '')
  const [batchId, setBatchId] = useState(filters.batch_id || '')

  const handleSearch = () => {
    router.get('/teacher/payments', {
      search: searchTerm,
      payment_method: paymentMethod,
      from_date: fromDate,
      to_date: toDate,
      batch_id: batchId
    }, {
      preserveState: true,
      preserveScroll: true
    })
  }

  const handleReset = () => {
    setSearchTerm('')
    setPaymentMethod('')
    setFromDate('')
    setToDate('')
    setBatchId('')
    router.get('/teacher/payments', {}, {
      preserveState: true,
      preserveScroll: true
    })
  }

  const handlePageChange = (page) => {
    router.get('/teacher/payments', {
      page: page,
      search: searchTerm,
      payment_method: paymentMethod,
      from_date: fromDate,
      to_date: toDate,
      batch_id: batchId
    }, {
      preserveState: true,
      preserveScroll: true
    })
  }

  const paymentMethodOptions = payment_methods.map(method => ({
    value: method,
    label: method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }))

  const batchOptions = batches.map(batch => ({
    value: batch.id,
    label: batch.name
  }))

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toFixed(2)}`
  }

  return (
    <Layout>
      <Head title="Payments" />

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Records</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage student payments and view payment history
            </p>
          </div>
          <Link href="/teacher/payments/new">
            <Button variant="primary">
              Record New Payment
            </Button>
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Received</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.total_received)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Payments</p>
                <p className="text-2xl font-bold text-blue-600">{summary.count}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <TextInput
                label="Search Student"
                name="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by student name..."
              />
            </div>

            <SelectInput
              label="Payment Method"
              name="payment_method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              options={paymentMethodOptions}
              placeholder="All Methods"
            />

            <SelectInput
              label="Batch"
              name="batch_id"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              options={batchOptions}
              placeholder="All Batches"
            />

            <DateInput
              label="From Date"
              name="from_date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />

            <DateInput
              label="To Date"
              name="to_date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <div className="flex items-end space-x-2 mt-4">
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
          Showing {payments.length} of {pagination.total_count} payments
        </div>

        {/* Payments Table */}
        {payments.length > 0 ? (
          <Card padding={false}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Batch
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Offer
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{payment.student_name}</div>
                        {payment.transaction_reference && (
                          <div className="text-xs text-gray-500">Ref: {payment.transaction_reference}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{payment.batch_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{payment.display_amount}</div>
                        {payment.months_covered && (
                          <div className="text-xs text-gray-500">{payment.months_covered} month(s)</div>
                        )}
                        {payment.classes_covered && (
                          <div className="text-xs text-gray-500">{payment.classes_covered} class(es)</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(payment.payment_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={payment.payment_method === 'cash' ? 'success' : 'info'}>
                          {payment.payment_method.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.has_offer ? (
                          <span className="text-green-600 font-medium">{payment.fee_offer}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link href={`/teacher/payments/${payment.id}`}>
                            <Button variant="secondary" size="sm">
                              View
                            </Button>
                          </Link>
                          <Link href={`/teacher/payments/${payment.id}/receipt`}>
                            <Button variant="info" size="sm">
                              Receipt
                            </Button>
                          </Link>
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filters.search || filters.payment_method ? 'Try adjusting your filters' : 'Get started by recording a new payment'}
              </p>
              {!filters.search && !filters.payment_method && (
                <div className="mt-6">
                  <Link href="/teacher/payments/new">
                    <Button variant="primary">
                      Record New Payment
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
