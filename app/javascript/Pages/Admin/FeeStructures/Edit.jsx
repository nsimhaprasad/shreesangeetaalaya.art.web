import { Head, Link, useForm } from '@inertiajs/react'
import Layout from '../../../Components/Layout'
import Card from '../../../Components/Card'
import Button from '../../../Components/Button'
import TextInput from '../../../Components/TextInput'
import SelectInput from '../../../Components/SelectInput'
import DateInput from '../../../Components/DateInput'

export default function Edit({ fee_structure, batches, class_types, fee_types, errors }) {
  const { data, setData, put, processing } = useForm({
    batch_id: fee_structure.batch_id || '',
    class_type: fee_structure.class_type || 'group',
    fee_type: fee_structure.fee_type || 'monthly',
    amount: fee_structure.amount || '',
    effective_from: fee_structure.effective_from || '',
    effective_to: fee_structure.effective_to || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    put(`/admin/fee_structures/${fee_structure.id}`)
  }

  const batchOptions = batches.map(batch => ({
    value: batch.value,
    label: batch.label
  }))

  const classTypeOptions = class_types.map(type => ({
    value: type,
    label: type.replace('_', '-')
  }))

  const feeTypeOptions = fee_types.map(type => ({
    value: type,
    label: type.replace('_', ' ')
  }))

  return (
    <Layout>
      <Head title="Edit Fee Structure" />

      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Link href="/admin/fee_structures">
            <Button variant="secondary" size="sm">
              Back to Fee Structures
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Fee Structure</h1>
          <p className="mt-1 text-sm text-gray-600">
            Update fee structure details
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
              {/* Batch Selection */}
              <SelectInput
                label="Batch"
                name="batch_id"
                value={data.batch_id}
                onChange={(e) => setData('batch_id', e.target.value)}
                options={batchOptions}
                placeholder="Select a batch"
                required
              />

              {/* Class Type */}
              <SelectInput
                label="Class Type"
                name="class_type"
                value={data.class_type}
                onChange={(e) => setData('class_type', e.target.value)}
                options={classTypeOptions}
                required
              />

              {/* Fee Type */}
              <SelectInput
                label="Fee Type"
                name="fee_type"
                value={data.fee_type}
                onChange={(e) => setData('fee_type', e.target.value)}
                options={feeTypeOptions}
                required
              />

              {/* Amount */}
              <TextInput
                label="Amount (INR)"
                name="amount"
                type="number"
                step="0.01"
                value={data.amount}
                onChange={(e) => setData('amount', e.target.value)}
                placeholder="Enter fee amount"
                required
              />

              {/* Effective From */}
              <DateInput
                label="Effective From"
                name="effective_from"
                value={data.effective_from}
                onChange={(e) => setData('effective_from', e.target.value)}
                required
              />

              {/* Effective To */}
              <DateInput
                label="Effective To (Optional)"
                name="effective_to"
                value={data.effective_to}
                onChange={(e) => setData('effective_to', e.target.value)}
                help="Leave blank if this fee structure has no end date"
              />

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-yellow-900 mb-2">Caution:</h4>
                <ul className="text-sm text-yellow-800 list-disc list-inside space-y-1">
                  <li>Changing fee structures may affect existing enrollments and payments</li>
                  <li>Fee structures cannot have overlapping dates for the same batch and class type</li>
                  <li>Consider creating a new fee structure with a future effective date instead</li>
                </ul>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-6 border-t">
                <Link href="/admin/fee_structures">
                  <Button variant="secondary" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={processing}
                >
                  {processing ? 'Updating...' : 'Update Fee Structure'}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  )
}
