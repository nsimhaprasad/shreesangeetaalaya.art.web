import { Head, Link, router } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import Layout from '../../../Components/Layout'
import Card from '../../../Components/Card'
import Button from '../../../Components/Button'
import TextInput from '../../../Components/TextInput'
import SelectInput from '../../../Components/SelectInput'
import DateInput from '../../../Components/DateInput'
import TextAreaInput from '../../../Components/TextAreaInput'

export default function New({ students, fee_offers, payment_methods, payment, errors }) {
  const [formData, setFormData] = useState({
    student_id: payment.student_id || '',
    batch_enrollment_id: payment.batch_enrollment_id || '',
    amount: payment.amount || 0,
    payment_date: payment.payment_date || new Date().toISOString().split('T')[0],
    payment_method: payment.payment_method || 'cash',
    fee_offer_id: payment.fee_offer_id || '',
    transaction_reference: payment.transaction_reference || '',
    months_covered: payment.months_covered || '',
    classes_covered: payment.classes_covered || '',
    notes: payment.notes || ''
  })

  const [enrollments, setEnrollments] = useState([])
  const [selectedEnrollment, setSelectedEnrollment] = useState(null)
  const [calculatedAmount, setCalculatedAmount] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // Fetch enrollments when student is selected
  useEffect(() => {
    if (formData.student_id) {
      fetch(`/teacher/payments/student_enrollments?student_id=${formData.student_id}`)
        .then(response => response.json())
        .then(data => {
          setEnrollments(data.enrollments)
          // Reset enrollment selection
          setFormData(prev => ({ ...prev, batch_enrollment_id: '' }))
        })
        .catch(error => console.error('Error fetching enrollments:', error))
    } else {
      setEnrollments([])
    }
  }, [formData.student_id])

  // Update selected enrollment when changed
  useEffect(() => {
    if (formData.batch_enrollment_id) {
      const enrollment = enrollments.find(e => e.id === parseInt(formData.batch_enrollment_id))
      setSelectedEnrollment(enrollment)

      // Auto-set amount to fee amount if not already set
      if (enrollment && (!formData.amount || formData.amount === 0)) {
        setFormData(prev => ({ ...prev, amount: enrollment.fee_amount || 0 }))
      }
    } else {
      setSelectedEnrollment(null)
    }
  }, [formData.batch_enrollment_id, enrollments])

  // Calculate amount when relevant fields change
  useEffect(() => {
    if (formData.batch_enrollment_id && (formData.fee_offer_id || formData.months_covered || formData.classes_covered)) {
      calculateAmount()
    }
  }, [formData.batch_enrollment_id, formData.fee_offer_id, formData.months_covered, formData.classes_covered])

  const calculateAmount = () => {
    setIsCalculating(true)

    const params = new URLSearchParams({
      batch_enrollment_id: formData.batch_enrollment_id,
      fee_offer_id: formData.fee_offer_id || '',
      months_covered: formData.months_covered || '',
      classes_covered: formData.classes_covered || ''
    })

    fetch(`/teacher/payments/calculate_amount?${params}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
      }
    })
      .then(response => response.json())
      .then(data => {
        setCalculatedAmount(data)
        setFormData(prev => ({ ...prev, amount: data.final_amount }))
        setIsCalculating(false)
      })
      .catch(error => {
        console.error('Error calculating amount:', error)
        setIsCalculating(false)
      })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    router.post('/teacher/payments', { payment: formData })
  }

  const studentOptions = students.map(student => ({
    value: student.id,
    label: student.name
  }))

  const enrollmentOptions = enrollments.map(enrollment => ({
    value: enrollment.id,
    label: `${enrollment.batch_name} - ${enrollment.course_name} (₹${enrollment.fee_amount || 0})`
  }))

  const paymentMethodOptions = payment_methods.map(method => ({
    value: method,
    label: method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }))

  const feeOfferOptions = fee_offers.map(offer => ({
    value: offer.id,
    label: `${offer.name} ${offer.discount_percentage ? `(${offer.discount_percentage}% off)` : offer.discount_amount ? `(₹${offer.discount_amount} off)` : ''}`
  }))

  return (
    <Layout>
      <Head title="Record New Payment" />

      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Record New Payment</h1>
            <p className="mt-1 text-sm text-gray-600">
              Record a payment received from a student
            </p>
          </div>
          <Link href="/teacher/payments">
            <Button variant="secondary">
              Back to Payments
            </Button>
          </Link>
        </div>

        {errors && errors.length > 0 && (
          <Card className="mb-6 bg-red-50 border-red-200">
            <div className="text-red-800">
              <h3 className="font-semibold mb-2">Please correct the following errors:</h3>
              <ul className="list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </Card>
        )}

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Selection */}
              <div className="md:col-span-2">
                <SelectInput
                  label="Student"
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleChange}
                  options={studentOptions}
                  placeholder="Select a student"
                  required
                />
              </div>

              {/* Batch Enrollment Selection */}
              <div className="md:col-span-2">
                <SelectInput
                  label="Batch Enrollment"
                  name="batch_enrollment_id"
                  value={formData.batch_enrollment_id}
                  onChange={handleChange}
                  options={enrollmentOptions}
                  placeholder={formData.student_id ? "Select a batch enrollment" : "Please select a student first"}
                  required
                  disabled={!formData.student_id}
                />
                {selectedEnrollment && (
                  <p className="mt-1 text-sm text-gray-500">
                    Fee Type: {selectedEnrollment.fee_type?.replace('_', ' ')} |
                    Base Fee: ₹{selectedEnrollment.fee_amount || 0}
                  </p>
                )}
              </div>

              {/* Amount */}
              <TextInput
                label="Amount (₹)"
                name="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0"
              />

              {/* Payment Date */}
              <DateInput
                label="Payment Date"
                name="payment_date"
                value={formData.payment_date}
                onChange={handleChange}
                required
              />

              {/* Payment Method */}
              <SelectInput
                label="Payment Method"
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                options={paymentMethodOptions}
                required
              />

              {/* Transaction Reference */}
              <TextInput
                label="Transaction Reference"
                name="transaction_reference"
                value={formData.transaction_reference}
                onChange={handleChange}
                placeholder="Transaction ID, Check #, etc."
              />

              {/* Fee Offer */}
              <div className="md:col-span-2">
                <SelectInput
                  label="Fee Offer (Optional)"
                  name="fee_offer_id"
                  value={formData.fee_offer_id}
                  onChange={handleChange}
                  options={feeOfferOptions}
                  placeholder="No offer"
                />
              </div>

              {/* Months Covered */}
              {selectedEnrollment?.fee_type === 'monthly' && (
                <TextInput
                  label="Months Covered"
                  name="months_covered"
                  type="number"
                  min="1"
                  value={formData.months_covered}
                  onChange={handleChange}
                  placeholder="Number of months"
                />
              )}

              {/* Classes Covered */}
              {selectedEnrollment?.fee_type === 'per_class' && (
                <TextInput
                  label="Classes Covered"
                  name="classes_covered"
                  type="number"
                  min="1"
                  value={formData.classes_covered}
                  onChange={handleChange}
                  placeholder="Number of classes"
                />
              )}

              {/* Notes */}
              <div className="md:col-span-2">
                <TextAreaInput
                  label="Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Additional notes about this payment..."
                  rows={3}
                />
              </div>
            </div>

            {/* Amount Calculation Summary */}
            {calculatedAmount && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Payment Calculation</h3>
                <div className="space-y-1 text-sm text-blue-800">
                  <div className="flex justify-between">
                    <span>Base Amount:</span>
                    <span>₹{calculatedAmount.base_amount}</span>
                  </div>
                  {calculatedAmount.discount > 0 && (
                    <div className="flex justify-between text-green-700">
                      <span>Discount:</span>
                      <span>- ₹{calculatedAmount.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-base pt-2 border-t border-blue-300">
                    <span>Final Amount:</span>
                    <span>₹{calculatedAmount.final_amount}</span>
                  </div>
                </div>
              </div>
            )}
          </Card>

          <div className="flex justify-end space-x-4">
            <Link href="/teacher/payments">
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </Link>
            <Button variant="primary" type="submit">
              Record Payment
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
