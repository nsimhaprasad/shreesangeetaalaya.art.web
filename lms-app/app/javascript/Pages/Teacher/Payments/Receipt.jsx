import { Head, Link } from '@inertiajs/react'
import { useEffect } from 'react'
import Button from '../../../Components/Button'

export default function Receipt({ payment }) {
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

  const handlePrint = () => {
    window.print()
  }

  return (
    <>
      <Head title={`Receipt - ${payment.receipt_number}`} />

      {/* Print Button - Hidden when printing */}
      <div className="print:hidden bg-gray-100 p-4 mb-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/teacher/payments">
            <Button variant="secondary">
              Back to Payments
            </Button>
          </Link>
          <Button variant="primary" onClick={handlePrint}>
            Print Receipt
          </Button>
        </div>
      </div>

      {/* Receipt Content */}
      <div className="max-w-4xl mx-auto bg-white p-8 print:p-0">
        {/* Header */}
        <div className="border-b-2 border-gray-900 pb-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment Receipt</h1>
              <p className="text-sm text-gray-600 mt-2">Shree Sangeet Aalaya</p>
              <p className="text-sm text-gray-600">Music Academy & Institute</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{payment.receipt_number}</div>
              <p className="text-sm text-gray-600 mt-1">Receipt Number</p>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Received From</h2>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Student Name</p>
                <p className="font-semibold text-gray-900">{payment.student.name}</p>
              </div>
              {payment.student.email && (
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-gray-900">{payment.student.email}</p>
                </div>
              )}
              {payment.student.phone && (
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="text-gray-900">{payment.student.phone}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Student ID</p>
                <p className="text-gray-900">#{payment.student.id}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h2>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Payment Date</p>
                <p className="font-semibold text-gray-900">{formatDate(payment.payment_date)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="text-gray-900">
                  {payment.payment_method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
              </div>
              {payment.transaction_reference && (
                <div>
                  <p className="text-sm text-gray-600">Transaction Reference</p>
                  <p className="text-gray-900">{payment.transaction_reference}</p>
                </div>
              )}
              {payment.recorded_by && (
                <div>
                  <p className="text-sm text-gray-600">Recorded By</p>
                  <p className="text-gray-900">{payment.recorded_by}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Course/Batch Details */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Details</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Course Name</p>
                <p className="font-semibold text-gray-900">{payment.batch_enrollment.course_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Batch Name</p>
                <p className="font-semibold text-gray-900">{payment.batch_enrollment.batch_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Class Type</p>
                <p className="text-gray-900">
                  {payment.batch_enrollment.class_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
              </div>
              {payment.months_covered && (
                <div>
                  <p className="text-sm text-gray-600">Period Covered</p>
                  <p className="text-gray-900">{payment.months_covered} month(s)</p>
                </div>
              )}
              {payment.classes_covered && (
                <div>
                  <p className="text-sm text-gray-600">Classes Covered</p>
                  <p className="text-gray-900">{payment.classes_covered} class(es)</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Breakdown */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Breakdown</h2>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.batch_enrollment.course_name} - {payment.batch_enrollment.batch_name}
                    {payment.months_covered && ` (${payment.months_covered} month${payment.months_covered > 1 ? 's' : ''})`}
                    {payment.classes_covered && ` (${payment.classes_covered} class${payment.classes_covered > 1 ? 'es' : ''})`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {formatCurrency(payment.amount)}
                  </td>
                </tr>

                {payment.fee_offer && (
                  <>
                    <tr className="bg-green-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">
                        Discount Applied: {payment.fee_offer.name}
                        {payment.fee_offer.discount_percentage && ` (${payment.fee_offer.discount_percentage}%)`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900 text-right">
                        {payment.fee_offer.discount_amount && `- ${formatCurrency(payment.fee_offer.discount_amount)}`}
                      </td>
                    </tr>
                  </>
                )}

                <tr className="bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-gray-900">
                    Total Amount Paid
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-green-600 text-right">
                    {payment.display_amount}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Notes */}
        {payment.notes && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Notes</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">{payment.notes}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t-2 border-gray-900 pt-6 mt-8">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm text-gray-600">Receipt Date</p>
              <p className="font-semibold text-gray-900">{formatDate(payment.created_at)}</p>
            </div>
            <div className="text-right">
              <div className="border-t-2 border-gray-900 pt-2 mt-8 w-64">
                <p className="text-sm text-gray-600">Authorized Signature</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Thank you for your payment!</p>
            <p className="mt-1">This is a computer-generated receipt and is valid without signature.</p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          @page {
            margin: 1cm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </>
  )
}
