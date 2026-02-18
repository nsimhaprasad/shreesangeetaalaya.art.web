import { Head, Link, router } from '@inertiajs/react'
import Layout from '../../../Components/Layout'
import Card from '../../../Components/Card'
import Badge from '../../../Components/Badge'
import Button from '../../../Components/Button'

export default function Show({ payment }) {
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this payment record? This action cannot be undone.')) {
      router.delete(`/teacher/payments/${payment.id}`)
    }
  }

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toFixed(2)}`
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (datetime) => {
    return new Date(datetime).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Layout>
      <Head title={`Payment Details - ${payment.student.name}`} />

      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Details</h1>
            <p className="mt-1 text-sm text-gray-600">
              View detailed information about this payment
            </p>
          </div>
          <div className="flex space-x-2">
            <Link href={`/teacher/payments/${payment.id}/receipt`}>
              <Button variant="info">
                View Receipt
              </Button>
            </Link>
            <Link href={`/teacher/payments/${payment.id}/edit`}>
              <Button variant="primary">
                Edit Payment
              </Button>
            </Link>
            <Link href="/teacher/payments">
              <Button variant="secondary">
                Back to List
              </Button>
            </Link>
          </div>
        </div>

        {/* Payment Summary Card */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-green-600">{payment.display_amount}</h2>
              <p className="text-sm text-gray-600">Payment Amount</p>
            </div>
            <Badge variant={payment.payment_method === 'cash' ? 'success' : 'info'} className="text-lg px-4 py-2">
              {payment.payment_method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Payment Date</h3>
              <p className="text-lg font-semibold text-gray-900">{formatDate(payment.payment_date)}</p>
            </div>

            {payment.transaction_reference && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Transaction Reference</h3>
                <p className="text-lg font-semibold text-gray-900">{payment.transaction_reference}</p>
              </div>
            )}

            {payment.months_covered && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Months Covered</h3>
                <p className="text-lg font-semibold text-gray-900">{payment.months_covered} month(s)</p>
              </div>
            )}

            {payment.classes_covered && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Classes Covered</h3>
                <p className="text-lg font-semibold text-gray-900">{payment.classes_covered} class(es)</p>
              </div>
            )}
          </div>
        </Card>

        {/* Student Information */}
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Student Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Student Name</h3>
              <p className="text-base text-gray-900">{payment.student.name}</p>
            </div>

            {payment.student.email && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                <p className="text-base text-gray-900">{payment.student.email}</p>
              </div>
            )}

            {payment.student.phone && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Phone</h3>
                <p className="text-base text-gray-900">{payment.student.phone}</p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Student ID</h3>
              <p className="text-base text-gray-900">#{payment.student.id}</p>
            </div>
          </div>

          <div className="mt-4">
            <Link href={`/teacher/students/${payment.student.id}`}>
              <Button variant="secondary" size="sm">
                View Student Profile
              </Button>
            </Link>
          </div>
        </Card>

        {/* Batch Information */}
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Batch & Course Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Batch Name</h3>
              <p className="text-base text-gray-900">{payment.batch_enrollment.batch_name}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Course Name</h3>
              <p className="text-base text-gray-900">{payment.batch_enrollment.course_name}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Enrollment ID</h3>
              <p className="text-base text-gray-900">#{payment.batch_enrollment.id}</p>
            </div>
          </div>
        </Card>

        {/* Fee Offer Information */}
        {payment.fee_offer && (
          <Card className="mb-6 bg-green-50 border-green-200">
            <h2 className="text-xl font-semibold text-green-900 mb-4">Fee Offer Applied</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-green-700 mb-1">Offer Name</h3>
                <p className="text-base text-green-900 font-semibold">{payment.fee_offer.name}</p>
              </div>

              {payment.fee_offer.discount_percentage && (
                <div>
                  <h3 className="text-sm font-medium text-green-700 mb-1">Discount Percentage</h3>
                  <p className="text-base text-green-900 font-semibold">{payment.fee_offer.discount_percentage}%</p>
                </div>
              )}

              {payment.fee_offer.discount_amount && (
                <div>
                  <h3 className="text-sm font-medium text-green-700 mb-1">Discount Amount</h3>
                  <p className="text-base text-green-900 font-semibold">{formatCurrency(payment.fee_offer.discount_amount)}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Notes */}
        {payment.notes && (
          <Card className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{payment.notes}</p>
          </Card>
        )}

        {/* Additional Information */}
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {payment.recorded_by && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Recorded By</h3>
                <p className="text-base text-gray-900">{payment.recorded_by}</p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Created At</h3>
              <p className="text-base text-gray-900">{formatDateTime(payment.created_at)}</p>
            </div>

            {payment.updated_at !== payment.created_at && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h3>
                <p className="text-base text-gray-900">{formatDateTime(payment.updated_at)}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button variant="danger" onClick={handleDelete}>
            Delete Payment
          </Button>

          <div className="flex space-x-2">
            <Link href={`/teacher/payments/${payment.id}/receipt`}>
              <Button variant="info">
                Print Receipt
              </Button>
            </Link>
            <Link href={`/teacher/payments/${payment.id}/edit`}>
              <Button variant="primary">
                Edit Payment
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}
