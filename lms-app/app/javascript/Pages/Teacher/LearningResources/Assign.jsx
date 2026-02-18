import { Head, router } from '@inertiajs/react'
import { useForm } from '@inertiajs/react'
import { useState } from 'react'
import Layout from '../../../Components/Layout'
import Card from '../../../Components/Card'
import Button from '../../../Components/Button'
import SelectInput from '../../../Components/SelectInput'
import TextAreaInput from '../../../Components/TextAreaInput'
import DateInput from '../../../Components/DateInput'

export default function Assign({ resource, students, batches, priorities, assignment }) {
  const { data, setData, post, processing, errors } = useForm({
    assignable_type: assignment.assignable_type || 'Student',
    assignable_ids: assignment.assignable_ids || [],
    notes: assignment.notes || '',
    due_date: assignment.due_date || '',
    priority: assignment.priority || 'medium'
  })

  const [selectedItems, setSelectedItems] = useState(assignment.assignable_ids || [])

  const handleSubmit = (e) => {
    e.preventDefault()

    post(`/teacher/learning_resources/${resource.id}/resource_assignments`, {
      preserveScroll: true,
      data: {
        resource_assignment: {
          assignable_type: data.assignable_type,
          assignable_ids: selectedItems,
          notes: data.notes,
          due_date: data.due_date,
          priority: data.priority
        }
      }
    })
  }

  const handleToggleItem = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId))
    } else {
      setSelectedItems([...selectedItems, itemId])
    }
  }

  const handleSelectAll = () => {
    const allIds = data.assignable_type === 'Student'
      ? students.map(s => s.id)
      : batches.map(b => b.id)
    setSelectedItems(allIds)
  }

  const handleDeselectAll = () => {
    setSelectedItems([])
  }

  const availableItems = data.assignable_type === 'Student' ? students : batches

  const priorityOptions = priorities.map(priority => ({
    value: priority,
    label: priority.charAt(0).toUpperCase() + priority.slice(1)
  }))

  return (
    <Layout>
      <Head title={`Assign ${resource.title}`} />

      <div className="mb-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Assign Resource</h1>
          <p className="mt-1 text-sm text-gray-600">
            Assign "{resource.title}" to students or batches
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Resource Info */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Details</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <svg className="h-8 w-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                </svg>
                <div>
                  <h4 className="font-medium text-gray-900">{resource.title}</h4>
                  <p className="text-sm text-gray-500 capitalize">{resource.resource_type}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Assignment Type */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign To</h3>

            <div className="space-y-4">
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setData('assignable_type', 'Student')
                    setSelectedItems([])
                  }}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                    data.assignable_type === 'Student'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                    </svg>
                    Individual Students
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setData('assignable_type', 'Batch')
                    setSelectedItems([])
                  }}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                    data.assignable_type === 'Batch'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    Batches
                  </div>
                </button>
              </div>

              {/* Selection Controls */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600">
                  {selectedItems.length} of {availableItems.length} selected
                </span>
                <div className="space-x-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    Select All
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleDeselectAll}
                  >
                    Deselect All
                  </Button>
                </div>
              </div>

              {/* Item List */}
              <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                {availableItems.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {availableItems.map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleToggleItem(item.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="ml-3 flex-1">
                          <div className="font-medium text-gray-900">
                            {data.assignable_type === 'Student' ? item.name : item.name}
                          </div>
                          {data.assignable_type === 'Student' && item.email && (
                            <div className="text-sm text-gray-500">{item.email}</div>
                          )}
                          {data.assignable_type === 'Batch' && (
                            <div className="text-sm text-gray-500">
                              {item.course_name} • {item.student_count} students
                            </div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No {data.assignable_type === 'Student' ? 'students' : 'batches'} available
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Assignment Details */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Details</h3>

            <div className="space-y-6">
              <TextAreaInput
                label="Notes (Optional)"
                name="notes"
                value={data.notes}
                onChange={(e) => setData('notes', e.target.value)}
                error={errors.notes}
                rows={4}
                placeholder="Add any instructions or notes for this assignment..."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DateInput
                  label="Due Date (Optional)"
                  name="due_date"
                  value={data.due_date}
                  onChange={(e) => setData('due_date', e.target.value)}
                  error={errors.due_date}
                  min={new Date().toISOString().split('T')[0]}
                />

                <SelectInput
                  label="Priority"
                  name="priority"
                  value={data.priority}
                  onChange={(e) => setData('priority', e.target.value)}
                  options={priorityOptions}
                  error={errors.priority}
                  required
                />
              </div>
            </div>
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
              disabled={selectedItems.length === 0}
            >
              Assign Resource ({selectedItems.length})
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
