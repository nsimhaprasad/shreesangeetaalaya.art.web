import { useForm } from '@inertiajs/react'
import TextInput from '../../../Components/TextInput'
import SelectInput from '../../../Components/SelectInput'
import DateInput from '../../../Components/DateInput'
import TextAreaInput from '../../../Components/TextAreaInput'
import FileInput from '../../../Components/FileInput'
import Button from '../../../Components/Button'
import Card from '../../../Components/Card'

export default function StudentForm({ student, statuses, onSubmit, submitText }) {
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

    if (student.id) {
      // Update existing student
      put(`/teacher/students/${student.id}`, {
        preserveScroll: true,
        onSuccess: () => {
          // Handle success if needed
        }
      })
    } else {
      // Create new student
      post('/teacher/students', {
        preserveScroll: true,
        onSuccess: () => {
          // Handle success if needed
        }
      })
    }
  }

  const statusOptions = statuses.map(status => ({
    value: status,
    label: status.charAt(0).toUpperCase() + status.slice(1)
  }))

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput
            label="First Name"
            name="first_name"
            value={data.first_name}
            onChange={(e) => setData('first_name', e.target.value)}
            error={errors.first_name}
            required
            autoComplete="given-name"
          />

          <TextInput
            label="Last Name"
            name="last_name"
            value={data.last_name}
            onChange={(e) => setData('last_name', e.target.value)}
            error={errors.last_name}
            required
            autoComplete="family-name"
          />

          <TextInput
            label="Email"
            name="email"
            type="email"
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            error={errors.email}
            required
            autoComplete="email"
          />

          <TextInput
            label="Phone"
            name="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => setData('phone', e.target.value)}
            error={errors.phone}
            autoComplete="tel"
          />

          <DateInput
            label="Date of Birth"
            name="date_of_birth"
            value={data.date_of_birth}
            onChange={(e) => setData('date_of_birth', e.target.value)}
            error={errors.date_of_birth}
            max={new Date().toISOString().split('T')[0]}
          />

          <DateInput
            label="Enrollment Date"
            name="enrollment_date"
            value={data.enrollment_date}
            onChange={(e) => setData('enrollment_date', e.target.value)}
            error={errors.enrollment_date}
            required
          />

          <SelectInput
            label="Status"
            name="status"
            value={data.status}
            onChange={(e) => setData('status', e.target.value)}
            options={statusOptions}
            error={errors.status}
            required
          />

          <TextInput
            label="Preferred Class Time"
            name="preferred_class_time"
            value={data.preferred_class_time}
            onChange={(e) => setData('preferred_class_time', e.target.value)}
            error={errors.preferred_class_time}
            placeholder="e.g., Morning, Evening, Weekends"
          />
        </div>

        <div className="mt-6">
          <TextAreaInput
            label="Address"
            name="address"
            value={data.address}
            onChange={(e) => setData('address', e.target.value)}
            error={errors.address}
            rows={3}
            autoComplete="street-address"
          />
        </div>

        <div className="mt-6">
          <FileInput
            label="Profile Photo"
            name="avatar"
            onChange={(e) => setData('avatar', e.target.files[0])}
            error={errors.avatar}
            accept="image/*"
            helpText="Upload a profile photo (JPG, PNG, max 5MB)"
          />
        </div>
      </Card>

      {/* Guardian Information */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Guardian Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput
            label="Guardian Name"
            name="guardian_name"
            value={data.guardian_name}
            onChange={(e) => setData('guardian_name', e.target.value)}
            error={errors.guardian_name}
          />

          <TextInput
            label="Guardian Phone"
            name="guardian_phone"
            type="tel"
            value={data.guardian_phone}
            onChange={(e) => setData('guardian_phone', e.target.value)}
            error={errors.guardian_phone}
          />

          <TextInput
            label="Guardian Email"
            name="guardian_email"
            type="email"
            value={data.guardian_email}
            onChange={(e) => setData('guardian_email', e.target.value)}
            error={errors.guardian_email}
          />

          <TextInput
            label="Emergency Contact"
            name="emergency_contact"
            type="tel"
            value={data.emergency_contact}
            onChange={(e) => setData('emergency_contact', e.target.value)}
            error={errors.emergency_contact}
            placeholder="Emergency contact number"
          />
        </div>
      </Card>

      {/* Additional Notes */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h3>

        <TextAreaInput
          label="Notes"
          name="notes"
          value={data.notes}
          onChange={(e) => setData('notes', e.target.value)}
          error={errors.notes}
          rows={5}
          placeholder="Any additional information about the student..."
        />
      </Card>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          loading={processing}
        >
          {submitText || (student.id ? 'Update Student' : 'Create Student')}
        </Button>
      </div>
    </form>
  )
}
