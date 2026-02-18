import { Head, Link, router } from '@inertiajs/react'
import Layout from '@components/Layout'
import { Card, Button, Badge, EmptyState } from '@components/UI'

const icons = {
  arrowLeft: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  edit: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  trash: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  plus: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  download: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  calendar: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  user: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}

export default function Show({ resource, assignments }) {
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this resource? This action cannot be undone.')) {
      router.delete(`/teacher/learning_resources/${resource.id}`)
    }
  }

  const handleDeleteAssignment = (assignmentId) => {
    if (confirm('Are you sure you want to remove this assignment?')) {
      router.delete(`/teacher/learning_resources/${resource.id}/resource_assignments/${assignmentId}`)
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getPriorityConfig = (priority) => {
    const configs = {
      urgent: { variant: 'danger', label: 'Urgent' },
      high: { variant: 'warning', label: 'High' },
      medium: { variant: 'info', label: 'Medium' },
      low: { variant: 'success', label: 'Low' },
    }
    return configs[priority] || { variant: 'default', label: priority }
  }

  return (
    <Layout>
      <Head title={resource.title} />

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/teacher/learning_resources" className="text-gray-500 hover:text-gray-700">
            {icons.arrowLeft}
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-display font-bold text-gray-900">{resource.title}</h1>
              <Badge variant={resource.visibility === 'public' ? 'success' : 'default'}>
                {resource.visibility === 'private_resource' ? 'Private' : 'Public'}
              </Badge>
            </div>
            <p className="text-gray-500 text-sm mt-1 capitalize">
              {resource.is_youtube ? 'YouTube Video' : resource.resource_type}
            </p>
          </div>
          <div className="flex gap-2">
            <Link 
              href={`/teacher/learning_resources/${resource.id}/resource_assignments/new`} 
              className="btn-primary"
            >
              {icons.plus}
              <span>Assign</span>
            </Link>
            <Link href={`/teacher/learning_resources/${resource.id}/edit`} className="btn-secondary">
              {icons.edit}
              <span>Edit</span>
            </Link>
            <Button variant="danger" onClick={handleDelete}>
              {icons.trash}
              <span>Delete</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {resource.description || 'No description provided'}
              </p>
            </Card>

            {resource.is_youtube && resource.youtube_embed_url && (
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Video Preview</h2>
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <iframe
                    src={resource.youtube_embed_url}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </Card>
            )}

            {resource.has_file && resource.resource_type === 'pdf' && (
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">PDF Preview</h2>
                <iframe
                  src={resource.file_url}
                  className="w-full h-96 rounded-lg border"
                  title="PDF Preview"
                />
              </Card>
            )}

            {resource.has_file && (resource.resource_type === 'audio' || resource.resource_type === 'video') && (
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Media Player</h2>
                {resource.resource_type === 'audio' ? (
                  <audio controls className="w-full">
                    <source src={resource.file_url} />
                    Your browser does not support the audio element.
                  </audio>
                ) : (
                  <video controls className="w-full rounded-lg">
                    <source src={resource.file_url} />
                    Your browser does not support the video element.
                  </video>
                )}
              </Card>
            )}

            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Assignments</h2>

              {assignments.length > 0 ? (
                <div className="space-y-3">
                  {assignments.map((assignment) => {
                    const priorityConfig = getPriorityConfig(assignment.priority)
                    return (
                      <div key={assignment.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-gray-900">
                                {assignment.assignable_name}
                              </span>
                              <Badge variant="secondary">{assignment.assignable_type}</Badge>
                              {assignment.priority && (
                                <Badge variant={priorityConfig.variant}>{priorityConfig.label}</Badge>
                              )}
                            </div>

                            {assignment.notes && (
                              <p className="text-sm text-gray-600 mb-2">{assignment.notes}</p>
                            )}

                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                {icons.calendar}
                                Assigned: {new Date(assignment.assigned_at).toLocaleDateString()}
                              </span>
                              {assignment.due_date && (
                                <span className={assignment.overdue ? 'text-red-600 font-medium' : ''}>
                                  Due: {new Date(assignment.due_date).toLocaleDateString()}
                                  {assignment.days_until_due !== null && (
                                    assignment.overdue
                                      ? ` (${Math.abs(assignment.days_until_due)} days overdue)`
                                      : ` (${assignment.days_until_due} days left)`
                                  )}
                                </span>
                              )}
                              {assignment.assigned_by && (
                                <span className="flex items-center gap-1">
                                  {icons.user}
                                  {assignment.assigned_by}
                                </span>
                              )}
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAssignment(assignment.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            {icons.trash}
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <EmptyState
                  title="No assignments"
                  description="This resource has not been assigned yet"
                  action={
                    <Link href={`/teacher/learning_resources/${resource.id}/resource_assignments/new`} className="btn-primary">
                      Assign Now
                    </Link>
                  }
                />
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Info</h3>

              <div className="space-y-4">
                <div>
                  <dt className="text-sm text-gray-500">Type</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900 capitalize">
                    {resource.is_youtube ? 'YouTube Video' : resource.resource_type}
                  </dd>
                </div>

                {resource.has_file && (
                  <>
                    <div>
                      <dt className="text-sm text-gray-500">File Name</dt>
                      <dd className="mt-1 text-sm font-medium text-gray-900 break-words">
                        {resource.file_name}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">File Size</dt>
                      <dd className="mt-1 text-sm font-medium text-gray-900">
                        {formatFileSize(resource.file_size)}
                      </dd>
                    </div>
                  </>
                )}

                {resource.has_url && (
                  <div>
                    <dt className="text-sm text-gray-500">URL</dt>
                    <dd className="mt-1 text-sm text-primary-600 break-words">
                      <a href={resource.resource_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {resource.resource_url}
                      </a>
                    </dd>
                  </div>
                )}

                <div>
                  <dt className="text-sm text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900">
                    {new Date(resource.created_at).toLocaleDateString()}
                  </dd>
                </div>

                {resource.uploaded_by && (
                  <div>
                    <dt className="text-sm text-gray-500">Uploaded By</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900">
                      {resource.uploaded_by.name}
                    </dd>
                  </div>
                )}
              </div>

              {resource.has_file && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <a
                    href={resource.file_url}
                    download
                    className="btn-secondary w-full justify-center"
                  >
                    {icons.download}
                    <span>Download File</span>
                  </a>
                </div>
              )}
            </Card>

            {resource.tags && resource.tags.length > 0 && (
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-primary-50 text-primary-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
