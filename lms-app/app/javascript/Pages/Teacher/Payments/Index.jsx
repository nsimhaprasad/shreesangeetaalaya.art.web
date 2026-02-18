import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import Layout from '@components/Layout'
import { Card, Button, Badge, Avatar, StatCard, SearchInput, EmptyState } from '@components/UI'

export default function PaymentsIndex({ payments, batches, filters, summary, pagination, payment_methods }) {
  const [searchTerm, setSearchTerm] = useState(filters?.search || '')
  const [paymentMethod, setPaymentMethod] = useState(filters?.payment_method || '')

  const handleSearch = () => {
    router.get('/teacher/payments', { search: searchTerm, payment_method: paymentMethod }, { preserveState: true })
  }

  const handleReset = () => {
    setSearchTerm('')
    setPaymentMethod('')
    router.get('/teacher/payments', {}, { preserveState: true })
  }

  return (
    <Layout>
      <Head title="Payments" />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">Payments</h1>
            <p className="text-gray-500 text-sm">Record and track student payments</p>
          </div>
          <Link href="/teacher/payments/new" className="btn-primary">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Record Payment
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="text-center">
            <p className="text-sm text-gray-500 mb-1">Total Collected</p>
            <p className="text-2xl font-bold text-green-600">₹{(summary?.total_received || 0).toLocaleString('en-IN')}</p>
          </Card>
          <Card className="text-center">
            <p className="text-sm text-gray-500 mb-1">This Month</p>
            <p className="text-2xl font-bold text-gray-900">₹{(summary?.this_month || 0).toLocaleString('en-IN')}</p>
          </Card>
          <Card className="text-center">
            <p className="text-sm text-gray-500 mb-1">Outstanding</p>
            <p className="text-2xl font-bold text-amber-600">₹{(summary?.outstanding || 0).toLocaleString('en-IN')}</p>
          </Card>
          <Card className="text-center">
            <p className="text-sm text-gray-500 mb-1">Total Payments</p>
            <p className="text-2xl font-bold text-gray-900">{summary?.count || 0}</p>
          </Card>
        </div>

        <Card>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <SearchInput
              placeholder="Search by student name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="input w-48"
            >
              <option value="">All Methods</option>
              {(payment_methods || []).map(m => (
                <option key={m} value={m}>{m.replace('_', ' ')}</option>
              ))}
            </select>
            <Button onClick={handleSearch}>Search</Button>
            <Button variant="ghost" onClick={handleReset}>Reset</Button>
          </div>
        </Card>

        {payments && payments.length > 0 ? (
          <Card padding={false}>
            <div className="divide-y divide-gray-100">
              {payments.map(payment => (
                <div key={payment.id} className="flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <Avatar name={payment.student_name} size="md" />
                    <div>
                      <p className="font-medium text-gray-900">{payment.student_name}</p>
                      <p className="text-sm text-gray-500">{payment.batch_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{payment.display_amount}</p>
                    <p className="text-sm text-gray-500">{payment.payment_date}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={payment.payment_method === 'cash' ? 'success' : 'info'}>
                        {payment.payment_method?.replace('_', ' ')}
                      </Badge>
                      <Link href={`/teacher/payments/${payment.id}/receipt`} className="text-sm text-primary-600 hover:text-primary-700">
                        Receipt
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <EmptyState
            title="No payments recorded"
            description="Start recording payments from students"
            action={<Link href="/teacher/payments/new" className="btn-primary">Record Payment</Link>}
          />
        )}
      </div>
    </Layout>
  )
}
