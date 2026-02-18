import { Head, Link, useForm } from '@inertiajs/react'
import Layout from '@components/Layout'

export default function BatchForm({ batch, courses = [], is_edit = false }) {
  const { data, setData, post, put, processing, errors } = useForm({
    name: batch?.name || '',
    course_id: batch?.course_id || '',
    class_type: batch?.class_type || 'group',
    schedule: batch?.schedule || '',
    start_date: batch?.start_date || '',
    end_date: batch?.end_date || '',
    max_students: batch?.max_students || '',
    status: batch?.status || 'draft',
    description: batch?.description || '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    if (is_edit) {
      put(`/teacher/batches/${batch.id}`)
    } else {
      post('/teacher/batches')
    }
  }

  return (
    <Layout>
      <Head title={is_edit ? 'Edit Batch' : 'Create Batch'} />

      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Link
            href="/teacher/batches"
            className="text-blue-600 hover:text-blue-800 mb-2 inline-block"
          >
            ← Back to Batches
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {is_edit ? 'Edit Batch' : 'Create New Batch'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Batch Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Batch Name *
            </label>
            <input
              type="text"
              id="name"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Beginner Vocal Batch - Fall 2024"
              required
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Course Selection */}
          <div>
            <label htmlFor="course_id" className="block text-sm font-medium text-gray-700 mb-2">
              Course *
            </label>
            <select
              id="course_id"
              value={data.course_id}
              onChange={(e) => setData('course_id', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.value} value={course.value}>
                  {course.label} ({course.course_type})
                </option>
              ))}
            </select>
            {errors.course_id && (
              <p className="mt-1 text-sm text-red-600">{errors.course_id}</p>
            )}
          </div>

          {/* Class Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class Type *
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="one_on_one"
                  checked={data.class_type === 'one_on_one'}
                  onChange={(e) => setData('class_type', e.target.value)}
                  className="mr-2"
                />
                <span className="text-gray-700">1-on-1</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="group"
                  checked={data.class_type === 'group'}
                  onChange={(e) => setData('class_type', e.target.value)}
                  className="mr-2"
                />
                <span className="text-gray-700">Group</span>
              </label>
            </div>
            {errors.class_type && (
              <p className="mt-1 text-sm text-red-600">{errors.class_type}</p>
            )}
          </div>

          {/* Max Students (only for group classes) */}
          {data.class_type === 'group' && (
            <div>
              <label htmlFor="max_students" className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Students
              </label>
              <input
                type="number"
                id="max_students"
                value={data.max_students}
                onChange={(e) => setData('max_students', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 10"
                min="1"
              />
              {errors.max_students && (
                <p className="mt-1 text-sm text-red-600">{errors.max_students}</p>
              )}
            </div>
          )}

          {/* Schedule */}
          <div>
            <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 mb-2">
              Schedule
            </label>
            <input
              type="text"
              id="schedule"
              value={data.schedule}
              onChange={(e) => setData('schedule', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Mon, Wed, Fri - 4:00 PM to 5:00 PM"
            />
            <p className="mt-1 text-sm text-gray-500">
              Describe the regular schedule for this batch
            </p>
            {errors.schedule && (
              <p className="mt-1 text-sm text-red-600">{errors.schedule}</p>
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
                End Date
              </label>
              <input
                type="date"
                id="end_date"
                value={data.end_date}
                onChange={(e) => setData('end_date', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">Leave empty for ongoing batch</p>
              {errors.end_date && (
                <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
              )}
            </div>
          </div>

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
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status}</p>
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
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Additional information about this batch..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Link
              href="/teacher/batches"
              className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={processing}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50"
            >
              {processing ? 'Saving...' : is_edit ? 'Update Batch' : 'Create Batch'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
