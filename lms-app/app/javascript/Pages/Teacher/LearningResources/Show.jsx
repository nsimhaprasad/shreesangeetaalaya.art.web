import { Head, Link, router } from '@inertiajs/react'
import Layout from '../../../Components/Layout'
import Card from '../../../Components/Card'
import Badge from '../../../Components/Badge'
import Button from '../../../Components/Button'

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

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Layout>
      <Head title={resource.title} />

      <div className="mb-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-gray-900">{resource.title}</h1>
              <Badge variant={resource.visibility === 'public' ? 'active' : 'inactive'}>
                {resource.visibility === 'private' ? 'Private' : 'Public'}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-gray-600 capitalize">
              {resource.is_youtube ? 'YouTube Video' : resource.resource_type}
            </p>
          </div>

          <div className="flex space-x-2">
            <Link href={`/teacher/learning_resources/${resource.id}/resource_assignments/new`}>
              <Button variant="primary">
                Assign to Students
              </Button>
            </Link>
            <Link href={`/teacher/learning_resources/${resource.id}/edit`}>
              <Button variant="secondary">
                Edit
              </Button>
            </Link>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>

        {/* Resource Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {resource.description || 'No description provided'}
              </p>
            </Card>

            {/* Resource Preview */}
            {resource.is_youtube && resource.youtube_embed_url && (
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Video Preview</h2>
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={resource.youtube_embed_url}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-96 rounded-lg"
                  />
                </div>
              </Card>
            )}

            {resource.has_file && resource.resource_type === 'pdf' && (
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">PDF Preview</h2>
                <iframe
                  src={resource.file_url}
                  className="w-full h-96 rounded-lg border"
                  title="PDF Preview"
                />
              </Card>
            )}

            {resource.has_file && (resource.resource_type === 'audio' || resource.resource_type === 'video') && (
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Media Player</h2>
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

            {/* Assignments */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Assignments</h2>

              {assignments.length > 0 ? (
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-gray-900">
                              {assignment.assignable_name}
                            </span>
                            <Badge variant="secondary">
                              {assignment.assignable_type}
                            </Badge>
                            {assignment.priority && (
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(assignment.priority)}`}>
                                {assignment.priority}
                              </span>
                            )}
                          </div>

                          {assignment.notes && (
                            <p className="text-sm text-gray-600 mb-2">{assignment.notes}</p>
                          )}

                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>
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
                              <span>By: {assignment.assigned_by}</span>
                            )}
                          </div>
                        </div>

                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteAssignment(assignment.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">This resource has not been assigned to anyone yet</p>
                  <div className="mt-4">
                    <Link href={`/teacher/learning_resources/${resource.id}/resource_assignments/new`}>
                      <Button variant="primary">
                        Assign Now
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Resource Info */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Information</h3>

              <div className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Type</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">
                    {resource.is_youtube ? 'YouTube Video' : resource.resource_type}
                  </dd>
                </div>

                {resource.has_file && (
                  <>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">File Name</dt>
                      <dd className="mt-1 text-sm text-gray-900 break-words">
                        {resource.file_name}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-500">File Size</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {formatFileSize(resource.file_size)}
                      </dd>
                    </div>
                  </>
                )}

                {resource.has_url && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">URL</dt>
                    <dd className="mt-1 text-sm text-blue-600 break-words">
                      <a href={resource.resource_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {resource.resource_url}
                      </a>
                    </dd>
                  </div>
                )}

                <div>
                  <dt className="text-sm font-medium text-gray-500">Visibility</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">
                    {resource.visibility}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(resource.created_at).toLocaleDateString()}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(resource.updated_at).toLocaleDateString()}
                  </dd>
                </div>

                {resource.uploaded_by && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Uploaded By</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {resource.uploaded_by.name}
                    </dd>
                  </div>
                )}
              </div>

              {resource.has_file && (
                <div className="mt-4">
                  <a
                    href={resource.file_url}
                    download
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Download File
                  </a>
                </div>
              )}
            </Card>

            {/* Tags */}
            {resource.tags && resource.tags.length > 0 && (
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
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
