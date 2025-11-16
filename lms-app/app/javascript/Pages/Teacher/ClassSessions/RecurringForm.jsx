import { Head, Link, useForm } from '@inertiajs/react'
import Layout from '@components/Layout'
import { useState } from 'react'

export default function RecurringClassSessionForm({ batches = [] }) {
  const { data, setData, post, processing, errors } = useForm({
    batch_id: '',
    start_date: '',
    end_date: '',
    class_time: '',
    duration_minutes: 60,
    days_of_week: [],
    topic: '',
    description: '',
    location: '',
    meeting_link: '',
  })

  const [selectedDays, setSelectedDays] = useState([])

  const daysOfWeek = [
    { value: '0', label: 'Sunday' },
    { value: '1', label: 'Monday' },
    { value: '2', label: 'Tuesday' },
    { value: '3', label: 'Wednesday' },
    { value: '4', label: 'Thursday' },
    { value: '5', label: 'Friday' },
    { value: '6', label: 'Saturday' },
  ]

  const toggleDay = (dayValue) => {
    const newSelectedDays = selectedDays.includes(dayValue)
      ? selectedDays.filter((d) => d !== dayValue)
      : [...selectedDays, dayValue]

    setSelectedDays(newSelectedDays)
    setData('days_of_week', newSelectedDays)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    post('/teacher/class_sessions/create_recurring')
  }

  // Calculate estimated sessions
  const estimateSessionCount = () => {
    if (!data.start_date || !data.end_date || selectedDays.length === 0) {
      return 0
    }

    const start = new Date(data.start_date)
    const end = new Date(data.end_date)
    const dayValues = selectedDays.map((d) => parseInt(d))

    let count = 0
    let current = new Date(start)

    while (current <= end) {
      if (dayValues.includes(current.getDay())) {
        count++
      }
      current.setDate(current.getDate() + 1)
    }

    return count
  }

  return (
    <Layout>
      <Head title="Create Recurring Class Sessions" />

      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Link
            href="/teacher/class_sessions"
            className="text-blue-600 hover:text-blue-800 mb-2 inline-block"
          >
            ← Back to Sessions
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Create Recurring Class Sessions
          </h1>
          <p className="text-gray-600 mt-2">
            Schedule multiple class sessions at once for regular batch schedules
          </p>
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
            >
              <option value="">Select a batch</option>
              {batches.map((batch) => (
                <option key={batch.value} value={batch.value}>
                  {batch.label} - {batch.course_name}
                </option>
              ))}
            </select>
            {batches.find((b) => b.value === parseInt(data.batch_id))?.schedule && (
              <p className="mt-2 text-sm text-blue-600">
                Batch Schedule: {batches.find((b) => b.value === parseInt(data.batch_id)).schedule}
              </p>
            )}
            {errors.batch_id && (
              <p className="mt-1 text-sm text-red-600">{errors.batch_id}</p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                id="start_date"
                value={data.start_date}
                onChange={(e) => setData('start_date', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.start_date && (
                <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
              )}
            </div>

            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                id="end_date"
                value={data.end_date}
                onChange={(e) => setData('end_date', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.end_date && (
                <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
              )}
            </div>
          </div>

          {/* Days of Week */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Days of Week *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {daysOfWeek.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDay(day.value)}
                  className={`px-4 py-3 rounded-md font-medium transition-colors ${
                    selectedDays.includes(day.value)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Select all days when classes should occur
            </p>
            {errors.days_of_week && (
              <p className="mt-1 text-sm text-red-600">{errors.days_of_week}</p>
            )}
          </div>

          {/* Time and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="class_time" className="block text-sm font-medium text-gray-700 mb-2">
                Class Time *
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

            <div>
              <label
                htmlFor="duration_minutes"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Duration (minutes) *
              </label>
              <input
                type="number"
                id="duration_minutes"
                value={data.duration_minutes}
                onChange={(e) => setData('duration_minutes', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                min="15"
                step="15"
                required
              />
              {errors.duration_minutes && (
                <p className="mt-1 text-sm text-red-600">{errors.duration_minutes}</p>
              )}
            </div>
          </div>

          {/* Session Info */}
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
              Topic (optional)
            </label>
            <input
              type="text"
              id="topic"
              value={data.topic}
              onChange={(e) => setData('topic', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Regular Practice Session"
            />
            <p className="mt-1 text-sm text-gray-500">
              Leave empty to set topic individually later
            </p>
            {errors.topic && (
              <p className="mt-1 text-sm text-red-600">{errors.topic}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (optional)
            </label>
            <textarea
              id="description"
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="General description for all sessions..."
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
              {errors.meeting_link && (
                <p className="mt-1 text-sm text-red-600">{errors.meeting_link}</p>
              )}
            </div>
          </div>

          {/* Session Count Estimate */}
          {data.start_date && data.end_date && selectedDays.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-sm font-medium text-blue-900">
                Estimated Sessions: {estimateSessionCount()}
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Based on selected days between {data.start_date} and {data.end_date}
              </p>
            </div>
          )}

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
              disabled={processing || selectedDays.length === 0}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50"
            >
              {processing ? 'Creating Sessions...' : 'Create Recurring Sessions'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
