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

export default function ClassSessionForm({ session, batches = [], is_edit = false }) {
  const { data, setData, post, put, processing, errors } = useForm({
    batch_id: session?.batch_id || '',
    class_date: session?.class_date || '',
    class_time: session?.class_time || '',
    duration_minutes: session?.duration_minutes || 60,
    topic: session?.topic || '',
    description: session?.description || '',
    status: session?.status || 'scheduled',
    location: session?.location || '',
    meeting_link: session?.meeting_link || '',
    homework: session?.homework || '',
    notes: session?.notes || '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (is_edit) {
      put(`/teacher/class_sessions/${session.id}`)
    } else {
      post('/teacher/class_sessions')
    }
  }

  const batchOptions = batches.map((batch) => ({
    value: batch.value,
    label: `${batch.label} - ${batch.course_name}`
  }))

  const statusOptions = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'rescheduled', label: 'Rescheduled' },
  ]

  return (
    <Layout>
      <Head title={is_edit ? 'Edit Class Session' : 'Schedule Class Session'} />

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/teacher/class_sessions" className="text-gray-500 hover:text-gray-700">
            {icons.arrowLeft}
          </Link>
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">
              {is_edit ? 'Edit Class Session' : 'Schedule Class Session'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {is_edit ? 'Update the session details' : 'Create a new class session'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Details</h3>
            
            <div className="space-y-4">
              <Select
                label="Batch"
                name="batch_id"
                value={data.batch_id}
                onChange={(e) => setData('batch_id', e.target.value)}
                options={batchOptions}
                placeholder="Select a batch"
                required
                disabled={is_edit}
                error={errors.batch_id}
              />

              <Input
                label="Topic"
                name="topic"
                value={data.topic}
                onChange={(e) => setData('topic', e.target.value)}
                placeholder="e.g., Raag Yaman - Aroha and Avaroha"
                error={errors.topic}
              />

              <TextArea
                label="Description"
                name="description"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                rows={3}
                placeholder="Lesson plan and objectives..."
                error={errors.description}
              />
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Date & Time</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="date"
                label="Date"
                name="class_date"
                value={data.class_date}
                onChange={(e) => setData('class_date', e.target.value)}
                required
                error={errors.class_date}
              />

              <Input
                type="time"
                label="Time"
                name="class_time"
                value={data.class_time}
                onChange={(e) => setData('class_time', e.target.value)}
                required
                error={errors.class_time}
              />

              <Input
                type="number"
                label="Duration (minutes)"
                name="duration_minutes"
                value={data.duration_minutes}
                onChange={(e) => setData('duration_minutes', e.target.value)}
                min="15"
                step="15"
                error={errors.duration_minutes}
              />

              <Select
                label="Status"
                name="status"
                value={data.status}
                onChange={(e) => setData('status', e.target.value)}
                options={statusOptions}
                required
                error={errors.status}
              />
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Location"
                name="location"
                value={data.location}
                onChange={(e) => setData('location', e.target.value)}
                placeholder="e.g., Room 101, Studio A"
                error={errors.location}
              />

              <Input
                type="url"
                label="Meeting Link"
                name="meeting_link"
                value={data.meeting_link}
                onChange={(e) => setData('meeting_link', e.target.value)}
                placeholder="https://zoom.us/j/..."
                hint="For online classes"
                error={errors.meeting_link}
              />
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h3>
            
            <div className="space-y-4">
              <TextArea
                label="Homework / Practice Assignment"
                name="homework"
                value={data.homework}
                onChange={(e) => setData('homework', e.target.value)}
                rows={3}
                placeholder="Practice assignments for students..."
                error={errors.homework}
              />

              {is_edit && (
                <TextArea
                  label="Session Notes"
                  name="notes"
                  value={data.notes}
                  onChange={(e) => setData('notes', e.target.value)}
                  rows={3}
                  placeholder="Post-class notes and observations..."
                  error={errors.notes}
                />
              )}
            </div>
          </Card>

          <div className="flex items-center justify-end gap-3">
            <Link href="/teacher/class_sessions" className="btn-secondary">
              Cancel
            </Link>
            <Button type="submit" loading={processing}>
              {is_edit ? 'Update Session' : 'Schedule Session'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
