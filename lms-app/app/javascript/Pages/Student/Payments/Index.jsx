import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import Layout from '../../../Components/Layout'
import Card from '../../../Components/Card'
import Badge from '../../../Components/Badge'
import Button from '../../../Components/Button'
import SelectInput from '../../../Components/SelectInput'
import DateInput from '../../../Components/DateInput'

export default function Index({ payments, batches, filters, summary, pagination, payment_methods }) {
  const [paymentMethod, setPaymentMethod] = useState(filters.payment_method || '')
  const [fromDate, setFromDate] = useState(filters.from_date || '')
  const [toDate, setToDate] = useState(filters.to_date || '')
  const [batchId, setBatchId] = useState(filters.batch_id || '')

  const handleSearch = () => {
    router.get('/student/payments', {
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
    setPaymentMethod('')
    setFromDate('')
    setToDate('')
    setBatchId('')
    router.get('/student/payments', {}, {
      preserveState: true,
      preserveScroll: true
    })
  }

  const handlePageChange = (page) => {
    router.get('/student/payments', {
      page: page,
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
      <Head title="My Payments" />

      <div className="mb-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Payment History</h1>
          <p className="mt-1 text-sm text-gray-600">
            View your payment records and outstanding balance
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.total_paid)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Outstanding Balance</p>
                <p className={`text-2xl font-bold ${summary.outstanding_balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(summary.outstanding_balance)}
                </p>
              </div>
              <div className={`p-3 rounded-full ${summary.outstanding_balance > 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                <svg className={`h-8 w-8 ${summary.outstanding_balance > 0 ? 'text-red-600' : 'text-green-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

        {/* Outstanding Balance Alert */}
        {summary.outstanding_balance > 0 && (
          <Card className="mb-6 bg-yellow-50 border-yellow-200">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Outstanding Payment</h3>
                <p className="mt-1 text-sm text-yellow-700">
                  You have an outstanding balance of {formatCurrency(summary.outstanding_balance)}. Please make a payment at your earliest convenience.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              Filter
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

        {/* Payments List */}
        {payments.length > 0 ? (
          <div className="space-y-4">
            {payments.map((payment) => (
              <Card key={payment.id} padding={false} className="hover:shadow-lg transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{payment.batch_name}</h3>
                      <p className="text-sm text-gray-600">{payment.course_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{payment.display_amount}</p>
                      <p className="text-xs text-gray-500">{new Date(payment.payment_date).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Payment Method</p>
                      <Badge variant={payment.payment_method === 'cash' ? 'success' : 'info'}>
                        {payment.payment_method.replace('_', ' ')}
                      </Badge>
                    </div>

                    {payment.transaction_reference && (
                      <div>
                        <p className="text-gray-600">Reference</p>
                        <p className="font-medium text-gray-900">{payment.transaction_reference}</p>
                      </div>
                    )}

                    {payment.months_covered && (
                      <div>
                        <p className="text-gray-600">Period</p>
                        <p className="font-medium text-gray-900">{payment.months_covered} month(s)</p>
                      </div>
                    )}

                    {payment.classes_covered && (
                      <div>
                        <p className="text-gray-600">Classes</p>
                        <p className="font-medium text-gray-900">{payment.classes_covered} class(es)</p>
                      </div>
                    )}

                    {payment.has_offer && (
                      <div>
                        <p className="text-gray-600">Offer Applied</p>
                        <p className="font-medium text-green-600">{payment.fee_offer}</p>
                      </div>
                    )}

                    {payment.recorded_by && (
                      <div>
                        <p className="text-gray-600">Recorded By</p>
                        <p className="font-medium text-gray-900">{payment.recorded_by}</p>
                      </div>
                    )}
                  </div>

                  {payment.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">Notes: {payment.notes}</p>
                    </div>
                  )}

                  <div className="mt-4 flex justify-end">
                    <Link href={`/student/payments/${payment.id}`}>
                      <Button variant="secondary" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filters.payment_method ? 'Try adjusting your filters' : 'You have not made any payments yet'}
              </p>
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
