import { Head, useForm } from '@inertiajs/react'
import { useState } from 'react'
import Layout from '@components/Layout'
import { Card, Button, Input, Select, TextArea, Badge } from '@components/UI'

const icons = {
  arrowLeft: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  user: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
    </svg>
  ),
  users: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
    </svg>
  ),
  document: (
    <svg className="w-8 h-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

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

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/teacher/learning_resources/${resource.id}`} className="text-gray-500 hover:text-gray-700">
            {icons.arrowLeft}
          </Link>
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">Assign Resource</h1>
            <p className="text-gray-500 text-sm mt-1">
              Assign "{resource.title}" to students or batches
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              {icons.document}
              <div>
                <h4 className="font-medium text-gray-900">{resource.title}</h4>
                <p className="text-sm text-gray-500 capitalize">{resource.resource_type}</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign To</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setData('assignable_type', 'Student')
                    setSelectedItems([])
                  }}
                  className={`p-4 rounded-xl border-2 transition-colors ${
                    data.assignable_type === 'Student'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {icons.user}
                    <span className="font-medium">Individual Students</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setData('assignable_type', 'Batch')
                    setSelectedItems([])
                  }}
                  className={`p-4 rounded-xl border-2 transition-colors ${
                    data.assignable_type === 'Batch'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {icons.users}
                    <span className="font-medium">Batches</span>
                  </div>
                </button>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-600">
                  {selectedItems.length} of {availableItems.length} selected
                </span>
                <div className="flex gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={handleSelectAll}>
                    Select All
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={handleDeselectAll}>
                    Deselect
                  </Button>
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                {availableItems.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {availableItems.map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleToggleItem(item.id)}
                          className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <div className="ml-3 flex-1">
                          <div className="font-medium text-gray-900">{item.name}</div>
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

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Details</h3>

            <div className="space-y-4">
              <TextArea
                label="Notes (Optional)"
                name="notes"
                value={data.notes}
                onChange={(e) => setData('notes', e.target.value)}
                error={errors.notes}
                rows={3}
                placeholder="Add any instructions or notes for this assignment..."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="Due Date (Optional)"
                  name="due_date"
                  value={data.due_date}
                  onChange={(e) => setData('due_date', e.target.value)}
                  error={errors.due_date}
                  min={new Date().toISOString().split('T')[0]}
                />

                <Select
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

          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button type="submit" loading={processing} disabled={selectedItems.length === 0}>
              Assign Resource ({selectedItems.length})
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
