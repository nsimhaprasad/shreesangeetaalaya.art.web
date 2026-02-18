import { Head, Link, useForm } from '@inertiajs/react'
import Layout from '@components/Layout'
import { Card, Button, Input, Select, TextArea } from '@components/UI'

const icons = {
  arrowLeft: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  )
}

export default function StudentProfileEdit({ student = {} }) {
  const { data, setData, put, processing, errors } = useForm({
    name: student.name || '',
    email: student.email || '',
    phone: student.phone || '',
    date_of_birth: student.date_of_birth || '',
    gender: student.gender || '',
    address: student.address || '',
    city: student.city || '',
    state: student.state || '',
    postal_code: student.postal_code || '',
    country: student.country || 'India',
    guardian_name: student.guardian_name || '',
    guardian_phone: student.guardian_phone || '',
    guardian_email: student.guardian_email || '',
    guardian_relationship: student.guardian_relationship || '',
    emergency_contact: student.emergency_contact || '',
    medical_conditions: student.medical_conditions || '',
    notes: student.notes || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    put('/student/profile', { preserveScroll: true })
  }

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' }
  ]

  const relationshipOptions = [
    { value: 'parent', label: 'Parent' },
    { value: 'guardian', label: 'Guardian' },
    { value: 'spouse', label: 'Spouse' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'other', label: 'Other' }
  ]

  return (
    <Layout>
      <Head title="Edit Profile" />

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/student/profile" className="text-gray-500 hover:text-gray-700">
            {icons.arrowLeft}
          </Link>
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">Edit Profile</h1>
            <p className="text-gray-500 text-sm mt-1">Update your personal information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  error={errors.name}
                  required
                />
                <Input
                  type="email"
                  label="Email"
                  name="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  error={errors.email}
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="tel"
                  label="Phone Number"
                  name="phone"
                  value={data.phone}
                  onChange={(e) => setData('phone', e.target.value)}
                  error={errors.phone}
                />
                <Input
                  type="date"
                  label="Date of Birth"
                  name="date_of_birth"
                  value={data.date_of_birth}
                  onChange={(e) => setData('date_of_birth', e.target.value)}
                  error={errors.date_of_birth}
                />
              </div>
              <Select
                label="Gender"
                name="gender"
                value={data.gender}
                onChange={(e) => setData('gender', e.target.value)}
                options={genderOptions}
                placeholder="Select Gender"
                error={errors.gender}
              />
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <TextArea
                label="Address"
                name="address"
                value={data.address}
                onChange={(e) => setData('address', e.target.value)}
                error={errors.address}
                rows={2}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="City"
                  name="city"
                  value={data.city}
                  onChange={(e) => setData('city', e.target.value)}
                  error={errors.city}
                />
                <Input
                  label="State"
                  name="state"
                  value={data.state}
                  onChange={(e) => setData('state', e.target.value)}
                  error={errors.state}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Postal Code"
                  name="postal_code"
                  value={data.postal_code}
                  onChange={(e) => setData('postal_code', e.target.value)}
                  error={errors.postal_code}
                />
                <Input
                  label="Country"
                  name="country"
                  value={data.country}
                  onChange={(e) => setData('country', e.target.value)}
                  error={errors.country}
                />
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Guardian Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Guardian Name"
                  name="guardian_name"
                  value={data.guardian_name}
                  onChange={(e) => setData('guardian_name', e.target.value)}
                  error={errors.guardian_name}
                />
                <Select
                  label="Relationship"
                  name="guardian_relationship"
                  value={data.guardian_relationship}
                  onChange={(e) => setData('guardian_relationship', e.target.value)}
                  options={relationshipOptions}
                  placeholder="Select Relationship"
                  error={errors.guardian_relationship}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="tel"
                  label="Guardian Phone"
                  name="guardian_phone"
                  value={data.guardian_phone}
                  onChange={(e) => setData('guardian_phone', e.target.value)}
                  error={errors.guardian_phone}
                />
                <Input
                  type="email"
                  label="Guardian Email"
                  name="guardian_email"
                  value={data.guardian_email}
                  onChange={(e) => setData('guardian_email', e.target.value)}
                  error={errors.guardian_email}
                />
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
            <div className="space-y-4">
              <Input
                label="Emergency Contact"
                name="emergency_contact"
                value={data.emergency_contact}
                onChange={(e) => setData('emergency_contact', e.target.value)}
                placeholder="Name and phone number"
                error={errors.emergency_contact}
              />
              <TextArea
                label="Medical Conditions"
                name="medical_conditions"
                value={data.medical_conditions}
                onChange={(e) => setData('medical_conditions', e.target.value)}
                placeholder="Any medical conditions or allergies we should be aware of"
                error={errors.medical_conditions}
                rows={2}
              />
              <TextArea
                label="Additional Notes"
                name="notes"
                value={data.notes}
                onChange={(e) => setData('notes', e.target.value)}
                placeholder="Any additional information you'd like to share"
                error={errors.notes}
                rows={2}
              />
            </div>
          </Card>

          <div className="flex items-center justify-end gap-3">
            <Link href="/student/profile" className="btn-secondary">
              Cancel
            </Link>
            <Button type="submit" loading={processing}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
