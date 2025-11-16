import { Head, Link } from '@inertiajs/react'
import Layout from '../../../Components/Layout'
import Card from '../../../Components/Card'
import Badge from '../../../Components/Badge'
import Button from '../../../Components/Button'

export default function Show({ payment }) {
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
      <Head title={`Payment Receipt - ${payment.receipt_number}`} />

      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Receipt</h1>
            <p className="mt-1 text-sm text-gray-600">
              Receipt Number: {payment.receipt_number}
            </p>
          </div>
          <Link href="/student/payments">
            <Button variant="secondary">
              Back to Payments
            </Button>
          </Link>
        </div>

        {/* Payment Summary Card */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-green-600">{payment.display_amount}</h2>
              <p className="text-sm text-gray-600">Amount Paid</p>
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

        {/* Course/Batch Details */}
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Course & Batch Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Course Name</h3>
              <p className="text-base text-gray-900">{payment.batch_enrollment.course_name}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Batch Name</h3>
              <p className="text-base text-gray-900">{payment.batch_enrollment.batch_name}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Class Type</h3>
              <p className="text-base text-gray-900">
                {payment.batch_enrollment.class_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </p>
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
            <h2 className="text-xl font-semibold text-green-900 mb-4">Discount Applied</h2>
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
              <h3 className="text-sm font-medium text-gray-500 mb-1">Receipt Date</h3>
              <p className="text-base text-gray-900">{formatDateTime(payment.created_at)}</p>
            </div>
          </div>
        </Card>

        {/* Information Notice */}
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Payment Confirmation</h3>
              <p className="mt-1 text-sm text-blue-700">
                This receipt confirms your payment. Please keep this for your records. If you have any questions about this payment, please contact your teacher or the administration.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  )
}
