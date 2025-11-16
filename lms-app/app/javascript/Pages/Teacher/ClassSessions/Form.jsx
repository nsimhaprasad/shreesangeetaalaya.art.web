import { Head, Link, useForm } from '@inertiajs/react'
import Layout from '@components/Layout'

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

  return (
    <Layout>
      <Head title={is_edit ? 'Edit Class Session' : 'Schedule Class Session'} />

      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Link
            href="/teacher/class_sessions"
            className="text-blue-600 hover:text-blue-800 mb-2 inline-block"
          >
            ← Back to Sessions
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {is_edit ? 'Edit Class Session' : 'Schedule Class Session'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Batch Selection */}
          <div>
            <label htmlFor="batch_id" className="block text-sm font-medium text-gray-700 mb-2">
              Batch *
            </label>
            <select
              id="batch_id"
              value={data.batch_id}
              onChange={(e) => setData('batch_id', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={is_edit}
            >
              <option value="">Select a batch</option>
              {batches.map((batch) => (
                <option key={batch.value} value={batch.value}>
                  {batch.label} - {batch.course_name}
                </option>
              ))}
            </select>
            {errors.batch_id && (
              <p className="mt-1 text-sm text-red-600">{errors.batch_id}</p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="class_date" className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                id="class_date"
                value={data.class_date}
                onChange={(e) => setData('class_date', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.class_date && (
                <p className="mt-1 text-sm text-red-600">{errors.class_date}</p>
              )}
            </div>

            <div>
              <label htmlFor="class_time" className="block text-sm font-medium text-gray-700 mb-2">
                Time *
              </label>
              <input
                type="time"
                id="class_time"
                value={data.class_time}
                onChange={(e) => setData('class_time', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.class_time && (
                <p className="mt-1 text-sm text-red-600">{errors.class_time}</p>
              )}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label htmlFor="duration_minutes" className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              id="duration_minutes"
              value={data.duration_minutes}
              onChange={(e) => setData('duration_minutes', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              min="15"
              step="15"
            />
            {errors.duration_minutes && (
              <p className="mt-1 text-sm text-red-600">{errors.duration_minutes}</p>
            )}
          </div>

          {/* Topic */}
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
              Topic
            </label>
            <input
              type="text"
              id="topic"
              value={data.topic}
              onChange={(e) => setData('topic', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Raag Yaman - Aroha and Avaroha"
            />
            {errors.topic && (
              <p className="mt-1 text-sm text-red-600">{errors.topic}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Lesson plan and objectives..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Location and Meeting Link */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                id="location"
                value={data.location}
                onChange={(e) => setData('location', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Room 101, Studio A"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div>

            <div>
              <label htmlFor="meeting_link" className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Link
              </label>
              <input
                type="url"
                id="meeting_link"
                value={data.meeting_link}
                onChange={(e) => setData('meeting_link', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://zoom.us/j/..."
              />
              <p className="mt-1 text-sm text-gray-500">For online classes</p>
              {errors.meeting_link && (
                <p className="mt-1 text-sm text-red-600">{errors.meeting_link}</p>
              )}
            </div>
          </div>

          {/* Homework */}
          <div>
            <label htmlFor="homework" className="block text-sm font-medium text-gray-700 mb-2">
              Homework/Practice Assignment
            </label>
            <textarea
              id="homework"
              value={data.homework}
              onChange={(e) => setData('homework', e.target.value)}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Practice assignments for students..."
            />
            {errors.homework && (
              <p className="mt-1 text-sm text-red-600">{errors.homework}</p>
            )}
          </div>

          {/* Notes */}
          {is_edit && (
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Session Notes
              </label>
              <textarea
                id="notes"
                value={data.notes}
                onChange={(e) => setData('notes', e.target.value)}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Post-class notes and observations..."
              />
              {errors.notes && (
                <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
              )}
            </div>
          )}

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              id="status"
              value={data.status}
              onChange={(e) => setData('status', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rescheduled">Rescheduled</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Link
              href="/teacher/class_sessions"
              className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={processing}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50"
            >
              {processing
                ? 'Saving...'
                : is_edit
                ? 'Update Session'
                : 'Schedule Session'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
