import { Head, Link, useForm } from '@inertiajs/react'
import Layout from '../../../Components/Layout'
import Card from '../../../Components/Card'
import Button from '../../../Components/Button'
import TextInput from '../../../Components/TextInput'
import SelectInput from '../../../Components/SelectInput'
import DateInput from '../../../Components/DateInput'

export default function Edit({ fee_offer, offer_types, statuses, applicable_to_options, duration_options, errors }) {
  const { data, setData, put, processing } = useForm({
    name: fee_offer.name || '',
    description: fee_offer.description || '',
    offer_type: fee_offer.offer_type || 'percentage_discount',
    duration_months: fee_offer.duration_months || 3,
    discount_percentage: fee_offer.discount_percentage || '',
    discount_amount: fee_offer.discount_amount || '',
    special_price: fee_offer.special_price || '',
    applicable_to: fee_offer.applicable_to || 'all_students',
    valid_from: fee_offer.valid_from || '',
    valid_to: fee_offer.valid_to || '',
    status: fee_offer.status || 'active'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    put(`/admin/fee_offers/${fee_offer.id}`)
  }

  const offerTypeOptions = offer_types.map(type => ({
    value: type,
    label: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }))

  const statusOptions = statuses.map(s => ({
    value: s,
    label: s.charAt(0).toUpperCase() + s.slice(1)
  }))

  const applicableToOptions = applicable_to_options.map(option => ({
    value: option,
    label: option.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }))

  return (
    <Layout>
      <Head title="Edit Fee Offer" />

      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Link href="/admin/fee_offers">
            <Button variant="secondary" size="sm">
              Back to Fee Offers
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Fee Offer</h1>
          <p className="mt-1 text-sm text-gray-600">
            Update offer details
          </p>
        </div>

        {errors && errors.length > 0 && (
          <Card className="mb-6 bg-red-50 border-red-200">
            <div className="text-red-800">
              <p className="font-medium">There were errors with your submission:</p>
              <ul className="mt-2 list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </Card>
        )}

        <Card>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Offer Name */}
              <TextInput
                label="Offer Name"
                name="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                placeholder="e.g., Summer Special 2024"
                required
              />

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the offer..."
                />
              </div>

              {/* Offer Type */}
              <SelectInput
                label="Offer Type"
                name="offer_type"
                value={data.offer_type}
                onChange={(e) => setData('offer_type', e.target.value)}
                options={offerTypeOptions}
                required
              />

              {/* Conditional Fields based on Offer Type */}
              {data.offer_type === 'percentage_discount' && (
                <TextInput
                  label="Discount Percentage (%)"
                  name="discount_percentage"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={data.discount_percentage}
                  onChange={(e) => setData('discount_percentage', e.target.value)}
                  placeholder="e.g., 10"
                  required
                />
              )}

              {data.offer_type === 'flat_discount' && (
                <TextInput
                  label="Discount Amount (INR)"
                  name="discount_amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={data.discount_amount}
                  onChange={(e) => setData('discount_amount', e.target.value)}
                  placeholder="e.g., 500"
                  required
                />
              )}

              {data.offer_type === 'special_package' && (
                <TextInput
                  label="Special Package Price (INR)"
                  name="special_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={data.special_price}
                  onChange={(e) => setData('special_price', e.target.value)}
                  placeholder="e.g., 5000"
                />
              )}

              {/* Duration */}
              <SelectInput
                label="Package Duration (Months)"
                name="duration_months"
                value={data.duration_months}
                onChange={(e) => setData('duration_months', e.target.value)}
                options={duration_options}
              />

              {/* Applicable To */}
              <SelectInput
                label="Applicable To"
                name="applicable_to"
                value={data.applicable_to}
                onChange={(e) => setData('applicable_to', e.target.value)}
                options={applicableToOptions}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Valid From */}
                <DateInput
                  label="Valid From"
                  name="valid_from"
                  value={data.valid_from}
                  onChange={(e) => setData('valid_from', e.target.value)}
                  required
                />

                {/* Valid To */}
                <DateInput
                  label="Valid To"
                  name="valid_to"
                  value={data.valid_to}
                  onChange={(e) => setData('valid_to', e.target.value)}
                  required
                />
              </div>

              {/* Status */}
              <SelectInput
                label="Status"
                name="status"
                value={data.status}
                onChange={(e) => setData('status', e.target.value)}
                options={statusOptions}
                required
              />

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-yellow-900 mb-2">Important Notes:</h4>
                <ul className="text-sm text-yellow-800 list-disc list-inside space-y-1">
                  <li>Changing offer details may affect existing enrollments using this offer</li>
                  <li>Set status to 'inactive' to temporarily disable the offer</li>
                  <li>Expired offers cannot be reactivated</li>
                </ul>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-6 border-t">
                <Link href="/admin/fee_offers">
                  <Button variant="secondary" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={processing}
                >
                  {processing ? 'Updating...' : 'Update Fee Offer'}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  )
}
