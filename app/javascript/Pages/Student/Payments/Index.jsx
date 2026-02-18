import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import Layout from '@components/Layout'
import { Card, Button, Badge, EmptyState, Select, Input } from '@components/UI'

const icons = {
  check: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  currency: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  receipt: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  chevronRight: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}

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
    }, { preserveState: true, preserveScroll: true })
  }

  const handleReset = () => {
    setPaymentMethod('')
    setFromDate('')
    setToDate('')
    setBatchId('')
    router.get('/student/payments', {}, { preserveState: true, preserveScroll: true })
  }

  const handlePageChange = (page) => {
    router.get('/student/payments', {
      page,
      payment_method: paymentMethod,
      from_date: fromDate,
      to_date: toDate,
      batch_id: batchId
    }, { preserveState: true, preserveScroll: true })
  }

  const paymentMethodOptions = [
    { value: '', label: 'All Methods' },
    ...payment_methods.map(method => ({
      value: method,
      label: method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    }))
  ]

  const batchOptions = [
    { value: '', label: 'All Batches' },
    ...batches.map(batch => ({ value: batch.id, label: batch.name }))
  ]

  const formatCurrency = (amount) => `₹${parseFloat(amount).toFixed(2)}`

  return (
    <Layout>
      <Head title="My Payments" />

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">My Payments</h1>
          <p className="text-gray-500 text-sm mt-1">View your payment history and outstanding balance</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-3">
              {icons.check}
            </div>
            <p className="text-sm text-gray-500">Total Paid</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.total_paid)}</p>
          </Card>

          <Card className="text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${summary.outstanding_balance > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} mb-3`}>
              {icons.currency}
            </div>
            <p className="text-sm text-gray-500">Outstanding</p>
            <p className={`text-2xl font-bold ${summary.outstanding_balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formatCurrency(summary.outstanding_balance)}
            </p>
          </Card>

          <Card className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 mb-3">
              {icons.receipt}
            </div>
            <p className="text-sm text-gray-500">Total Payments</p>
            <p className="text-2xl font-bold text-gray-900">{summary.count}</p>
          </Card>
        </div>

        {summary.outstanding_balance > 0 && (
          <Card className="bg-amber-50 border border-amber-200">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="font-medium text-amber-800">Outstanding Payment</h3>
                <p className="text-sm text-amber-700 mt-1">
                  You have an outstanding balance of {formatCurrency(summary.outstanding_balance)}. Please make a payment at your earliest convenience.
                </p>
              </div>
            </div>
          </Card>
        )}

        <Card>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              options={paymentMethodOptions}
              className="sm:w-40"
            />
            <Select
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              options={batchOptions}
              className="sm:w-40"
            />
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              placeholder="From"
              className="sm:w-36"
            />
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              placeholder="To"
              className="sm:w-36"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSearch}>Filter</Button>
            <Button variant="ghost" onClick={handleReset}>Reset</Button>
          </div>
        </Card>

        {pagination && (
          <p className="text-sm text-gray-500">
            Showing {payments?.length || 0} of {pagination.total_count || 0} payments
          </p>
        )}

        {payments && payments.length > 0 ? (
          <Card padding={false}>
            <div className="divide-y divide-gray-100">
              {payments.map((payment) => (
                <Link
                  key={payment.id}
                  href={`/student/payments/${payment.id}`}
                  className="block p-4 sm:p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{payment.batch_name}</h3>
                        <Badge variant={payment.payment_method === 'cash' ? 'success' : 'info'}>
                          {payment.payment_method?.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">{payment.course_name}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                        <span>{new Date(payment.payment_date).toLocaleDateString()}</span>
                        {payment.months_covered && <span>{payment.months_covered} month(s)</span>}
                        {payment.has_offer && <span className="text-green-600">{payment.fee_offer}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{payment.display_amount}</p>
                      <div className="flex items-center text-sm text-primary-600 mt-1">
                        <span>Details</span>
                        {icons.chevronRight}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        ) : (
          <EmptyState
            icon={icons.currency}
            title="No payments found"
            description={filters.payment_method ? "Try adjusting your filters" : "You haven't made any payments yet"}
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
    </Layout>
  )
}
