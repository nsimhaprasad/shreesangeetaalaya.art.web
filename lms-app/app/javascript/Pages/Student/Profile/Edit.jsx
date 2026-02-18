import { Head, Link, useForm } from '@inertiajs/react'
import Layout from '@components/Layout'

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
    put('/student/profile', {
      preserveScroll: true,
      onSuccess: () => {
        // Success message will be handled by flash messages
      }
    })
  }

  return (
    <Layout>
      <Head title="Edit Profile" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <Link
            href="/student/profile"
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            Cancel
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-3">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={data.name}
                  onChange={e => setData('name', e.target.value)}
                  className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={data.email}
                  onChange={e => setData('email', e.target.value)}
                  className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={data.phone}
                  onChange={e => setData('phone', e.target.value)}
                  className={`w-full px-4 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="date_of_birth"
                  value={data.date_of_birth}
                  onChange={e => setData('date_of_birth', e.target.value)}
                  className={`w-full px-4 py-2 border ${errors.date_of_birth ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.date_of_birth && (
                  <p className="mt-1 text-sm text-red-600">{errors.date_of_birth}</p>
                )}
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  id="gender"
                  value={data.gender}
                  onChange={e => setData('gender', e.target.value)}
                  className={`w-full px-4 py-2 border ${errors.gender ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-3">
              Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  id="address"
                  value={data.address}
                  onChange={e => setData('address', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  value={data.city}
                  onChange={e => setData('city', e.target.value)}
                  className={`w-full px-4 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  value={data.state}
                  onChange={e => setData('state', e.target.value)}
                  className={`w-full px-4 py-2 border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                )}
              </div>

              <div>
                <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postal_code"
                  value={data.postal_code}
                  onChange={e => setData('postal_code', e.target.value)}
                  className={`w-full px-4 py-2 border ${errors.postal_code ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.postal_code && (
                  <p className="mt-1 text-sm text-red-600">{errors.postal_code}</p>
                )}
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  value={data.country}
                  onChange={e => setData('country', e.target.value)}
                  className={`w-full px-4 py-2 border ${errors.country ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                )}
              </div>
            </div>
          </div>

          {/* Guardian Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-3">
              Guardian Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="guardian_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Guardian Name
                </label>
                <input
                  type="text"
                  id="guardian_name"
                  value={data.guardian_name}
                  onChange={e => setData('guardian_name', e.target.value)}
                  className={`w-full px-4 py-2 border ${errors.guardian_name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.guardian_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.guardian_name}</p>
                )}
              </div>

              <div>
                <label htmlFor="guardian_relationship" className="block text-sm font-medium text-gray-700 mb-2">
                  Relationship
                </label>
                <select
                  id="guardian_relationship"
                  value={data.guardian_relationship}
                  onChange={e => setData('guardian_relationship', e.target.value)}
                  className={`w-full px-4 py-2 border ${errors.guardian_relationship ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Select Relationship</option>
                  <option value="parent">Parent</option>
                  <option value="guardian">Guardian</option>
                  <option value="spouse">Spouse</option>
                  <option value="sibling">Sibling</option>
                  <option value="other">Other</option>
                </select>
                {errors.guardian_relationship && (
                  <p className="mt-1 text-sm text-red-600">{errors.guardian_relationship}</p>
                )}
              </div>

              <div>
                <label htmlFor="guardian_phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Guardian Phone
                </label>
                <input
                  type="tel"
                  id="guardian_phone"
                  value={data.guardian_phone}
                  onChange={e => setData('guardian_phone', e.target.value)}
                  className={`w-full px-4 py-2 border ${errors.guardian_phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.guardian_phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.guardian_phone}</p>
                )}
              </div>

              <div>
                <label htmlFor="guardian_email" className="block text-sm font-medium text-gray-700 mb-2">
                  Guardian Email
                </label>
                <input
                  type="email"
                  id="guardian_email"
                  value={data.guardian_email}
                  onChange={e => setData('guardian_email', e.target.value)}
                  className={`w-full px-4 py-2 border ${errors.guardian_email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.guardian_email && (
                  <p className="mt-1 text-sm text-red-600">{errors.guardian_email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-3">
              Additional Information
            </h2>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="emergency_contact" className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact
                </label>
                <input
                  type="text"
                  id="emergency_contact"
                  value={data.emergency_contact}
                  onChange={e => setData('emergency_contact', e.target.value)}
                  placeholder="Name and phone number"
                  className={`w-full px-4 py-2 border ${errors.emergency_contact ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.emergency_contact && (
                  <p className="mt-1 text-sm text-red-600">{errors.emergency_contact}</p>
                )}
              </div>

              <div>
                <label htmlFor="medical_conditions" className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Conditions
                </label>
                <textarea
                  id="medical_conditions"
                  value={data.medical_conditions}
                  onChange={e => setData('medical_conditions', e.target.value)}
                  rows={3}
                  placeholder="Any medical conditions or allergies we should be aware of"
                  className={`w-full px-4 py-2 border ${errors.medical_conditions ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.medical_conditions && (
                  <p className="mt-1 text-sm text-red-600">{errors.medical_conditions}</p>
                )}
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  value={data.notes}
                  onChange={e => setData('notes', e.target.value)}
                  rows={3}
                  placeholder="Any additional information you'd like to share"
                  className={`w-full px-4 py-2 border ${errors.notes ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.notes && (
                  <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4">
            <Link
              href="/student/profile"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={processing}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
