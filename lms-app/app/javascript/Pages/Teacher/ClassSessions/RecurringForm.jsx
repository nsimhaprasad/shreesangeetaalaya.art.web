import { Head, Link, useForm } from '@inertiajs/react'
import { useState } from 'react'
import Layout from '@components/Layout'
import { Card, Button, Input, Select, TextArea, Badge } from '@components/UI'

const icons = {
  arrowLeft: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  calendar: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}

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
    { value: '0', label: 'Sun' },
    { value: '1', label: 'Mon' },
    { value: '2', label: 'Tue' },
    { value: '3', label: 'Wed' },
    { value: '4', label: 'Thu' },
    { value: '5', label: 'Fri' },
    { value: '6', label: 'Sat' },
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

  const batchOptions = batches.map((batch) => ({
    value: batch.value,
    label: `${batch.label} - ${batch.course_name}`
  }))

  const selectedBatchSchedule = batches.find((b) => b.value === parseInt(data.batch_id))?.schedule

  return (
    <Layout>
      <Head title="Create Recurring Class Sessions" />

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/teacher/class_sessions" className="text-gray-500 hover:text-gray-700">
            {icons.arrowLeft}
          </Link>
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">
              Create Recurring Sessions
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Schedule multiple class sessions at once for regular batch schedules
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Batch Selection</h3>
            
            <Select
              label="Batch"
              name="batch_id"
              value={data.batch_id}
              onChange={(e) => setData('batch_id', e.target.value)}
              options={batchOptions}
              placeholder="Select a batch"
              required
              error={errors.batch_id}
            />

            {selectedBatchSchedule && (
              <div className="mt-3 p-3 bg-primary-50 rounded-lg">
                <p className="text-sm text-primary-700">
                  <span className="font-medium">Batch Schedule:</span> {selectedBatchSchedule}
                </p>
              </div>
            )}
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="date"
                label="Start Date"
                name="start_date"
                value={data.start_date}
                onChange={(e) => setData('start_date', e.target.value)}
                required
                error={errors.start_date}
              />

              <Input
                type="date"
                label="End Date"
                name="end_date"
                value={data.end_date}
                onChange={(e) => setData('end_date', e.target.value)}
                required
                error={errors.end_date}
              />
            </div>

            <div className="mt-4">
              <label className="label">Days of Week</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {daysOfWeek.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleDay(day.value)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      selectedDays.includes(day.value)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
              {errors.days_of_week && (
                <p className="mt-1.5 text-sm text-red-600">{errors.days_of_week}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <Input
                type="time"
                label="Class Time"
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
                required
                error={errors.duration_minutes}
              />
            </div>

            {data.start_date && data.end_date && selectedDays.length > 0 && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  {icons.calendar}
                  <span className="font-medium text-green-800">
                    {estimateSessionCount()} sessions will be created
                  </span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Between {data.start_date} and {data.end_date}
                </p>
              </div>
            )}
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Info</h3>
            
            <div className="space-y-4">
              <Input
                label="Topic (optional)"
                name="topic"
                value={data.topic}
                onChange={(e) => setData('topic', e.target.value)}
                placeholder="e.g., Regular Practice Session"
                hint="Leave empty to set topic individually later"
                error={errors.topic}
              />

              <TextArea
                label="Description (optional)"
                name="description"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                rows={3}
                placeholder="General description for all sessions..."
                error={errors.description}
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
                error={errors.meeting_link}
              />
            </div>
          </Card>

          <div className="flex items-center justify-end gap-3">
            <Link href="/teacher/class_sessions" className="btn-secondary">
              Cancel
            </Link>
            <Button 
              type="submit" 
              loading={processing}
              disabled={selectedDays.length === 0}
            >
              Create Recurring Sessions
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
