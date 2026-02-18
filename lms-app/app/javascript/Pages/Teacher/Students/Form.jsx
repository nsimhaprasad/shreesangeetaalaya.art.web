import { Head, Link, useForm } from '@inertiajs/react'
import Layout from '@components/Layout'
import { Card, CardTitle, Button, Input, Select, TextArea } from '@components/UI'

const icons = {
  arrowLeft: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  user: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  shield: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  document: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

export default function StudentForm({ student = {}, statuses = ['active', 'inactive'] }) {
  const isEditing = !!student?.id

  const { data, setData, post, put, processing, errors } = useForm({
    first_name: student.first_name || '',
    last_name: student.last_name || '',
    email: student.email || '',
    phone: student.phone || '',
    date_of_birth: student.date_of_birth || '',
    address: student.address || '',
    enrollment_date: student.enrollment_date || new Date().toISOString().split('T')[0],
    guardian_name: student.guardian_name || '',
    guardian_phone: student.guardian_phone || '',
    guardian_email: student.guardian_email || '',
    emergency_contact: student.emergency_contact || '',
    preferred_class_time: student.preferred_class_time || '',
    notes: student.notes || '',
    status: student.status || 'active',
    avatar: null
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const url = isEditing ? `/teacher/students/${student.id}` : '/teacher/students'
    const method = isEditing ? put : post
    method(url, { preserveScroll: true })
  }

  const statusOptions = statuses.map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))

  return (
    <Layout>
      <Head title={isEditing ? 'Edit Student' : 'New Student'} />

      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/teacher/students" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            {icons.arrowLeft}
          </Link>
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">
              {isEditing ? 'Edit Student' : 'Add New Student'}
            </h1>
            <p className="text-gray-500 text-sm">
              {isEditing ? 'Update student information' : 'Fill in the details to add a new student'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
                {icons.user}
              </div>
              <CardTitle className="mb-0">Personal Information</CardTitle>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={data.first_name}
                onChange={(e) => setData('first_name', e.target.value)}
                error={errors.first_name}
                required
              />
              <Input
                label="Last Name"
                value={data.last_name}
                onChange={(e) => setData('last_name', e.target.value)}
                error={errors.last_name}
                required
              />
              <Input
                label="Email"
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                error={errors.email}
                required
              />
              <Input
                label="Phone"
                type="tel"
                value={data.phone}
                onChange={(e) => setData('phone', e.target.value)}
                error={errors.phone}
              />
              <Input
                label="Date of Birth"
                type="date"
                value={data.date_of_birth}
                onChange={(e) => setData('date_of_birth', e.target.value)}
                error={errors.date_of_birth}
                max={new Date().toISOString().split('T')[0]}
              />
              <Input
                label="Enrollment Date"
                type="date"
                value={data.enrollment_date}
                onChange={(e) => setData('enrollment_date', e.target.value)}
                error={errors.enrollment_date}
                required
              />
              <Select
                label="Status"
                value={data.status}
                onChange={(e) => setData('status', e.target.value)}
                options={statusOptions}
                error={errors.status}
                required
              />
              <Input
                label="Preferred Class Time"
                value={data.preferred_class_time}
                onChange={(e) => setData('preferred_class_time', e.target.value)}
                error={errors.preferred_class_time}
                placeholder="e.g., Morning, Evening"
              />
            </div>

            <div className="mt-4">
              <TextArea
                label="Address"
                value={data.address}
                onChange={(e) => setData('address', e.target.value)}
                error={errors.address}
                rows={2}
              />
            </div>

            <div className="mt-4">
              <label className="label">Profile Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setData('avatar', e.target.files[0])}
                className="input"
              />
              {errors.avatar && <p className="mt-1 text-sm text-red-600">{errors.avatar}</p>}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg text-green-600">
                {icons.shield}
              </div>
              <CardTitle className="mb-0">Guardian Information</CardTitle>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Guardian Name"
                value={data.guardian_name}
                onChange={(e) => setData('guardian_name', e.target.value)}
                error={errors.guardian_name}
              />
              <Input
                label="Guardian Phone"
                type="tel"
                value={data.guardian_phone}
                onChange={(e) => setData('guardian_phone', e.target.value)}
                error={errors.guardian_phone}
              />
              <Input
                label="Guardian Email"
                type="email"
                value={data.guardian_email}
                onChange={(e) => setData('guardian_email', e.target.value)}
                error={errors.guardian_email}
              />
              <Input
                label="Emergency Contact"
                type="tel"
                value={data.emergency_contact}
                onChange={(e) => setData('emergency_contact', e.target.value)}
                error={errors.emergency_contact}
              />
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                {icons.document}
              </div>
              <CardTitle className="mb-0">Additional Notes</CardTitle>
            </div>

            <TextArea
              value={data.notes}
              onChange={(e) => setData('notes', e.target.value)}
              error={errors.notes}
              rows={4}
              placeholder="Any additional information about the student..."
            />
          </Card>

          <div className="flex items-center justify-end gap-3 pb-8">
            <Link href="/teacher/students" className="btn-secondary">
              Cancel
            </Link>
            <Button type="submit" loading={processing}>
              {isEditing ? 'Update Student' : 'Add Student'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
