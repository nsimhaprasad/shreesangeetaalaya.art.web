import { Head, Link } from '@inertiajs/react'
import Layout from '../../../Components/Layout'
import Card from '../../../Components/Card'
import Badge from '../../../Components/Badge'
import Button from '../../../Components/Button'

export default function Show({ resource, assignment }) {
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
              {assignment && assignment.priority && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(assignment.priority)}`}>
                  {assignment.priority}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-600 capitalize">
              {resource.is_youtube ? 'YouTube Video' : resource.resource_type}
            </p>
          </div>

          <div className="flex space-x-2">
            <Link href="/student/learning_resources">
              <Button variant="secondary">
                Back to Resources
              </Button>
            </Link>
          </div>
        </div>

        {/* Assignment Alert */}
        {assignment && assignment.due_date && (
          <div className={`mb-6 p-4 rounded-lg ${assignment.overdue ? 'bg-red-50 border-l-4 border-red-400' : 'bg-blue-50 border-l-4 border-blue-400'}`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className={`h-5 w-5 ${assignment.overdue ? 'text-red-400' : 'text-blue-400'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${assignment.overdue ? 'text-red-800' : 'text-blue-800'}`}>
                  {assignment.overdue ? 'This assignment is overdue!' : 'Assignment due soon'}
                </p>
                <p className={`text-sm ${assignment.overdue ? 'text-red-700' : 'text-blue-700'}`}>
                  Due: {new Date(assignment.due_date).toLocaleDateString()}
                  {assignment.days_until_due !== null && (
                    assignment.overdue
                      ? ` - ${Math.abs(assignment.days_until_due)} days overdue`
                      : ` - ${assignment.days_until_due} days remaining`
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Resource Content */}
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

            {/* Assignment Notes */}
            {assignment && assignment.notes && (
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Teacher's Notes</h2>
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
                  <p className="text-gray-700 whitespace-pre-wrap">{assignment.notes}</p>
                </div>
              </Card>
            )}

            {/* YouTube Video */}
            {resource.is_youtube && resource.youtube_embed_url && (
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Video</h2>
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

            {/* PDF Preview */}
            {resource.has_file && resource.resource_type === 'pdf' && (
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">PDF Viewer</h2>
                <iframe
                  src={resource.file_url}
                  className="w-full h-screen rounded-lg border"
                  title="PDF Preview"
                />
              </Card>
            )}

            {/* Audio Player */}
            {resource.has_file && resource.resource_type === 'audio' && (
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Audio Player</h2>
                <audio controls className="w-full">
                  <source src={resource.file_url} />
                  Your browser does not support the audio element.
                </audio>
              </Card>
            )}

            {/* Video Player */}
            {resource.has_file && resource.resource_type === 'video' && !resource.is_youtube && (
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Video Player</h2>
                <video controls className="w-full rounded-lg">
                  <source src={resource.file_url} />
                  Your browser does not support the video element.
                </video>
              </Card>
            )}

            {/* Document Download */}
            {resource.has_file && resource.resource_type === 'document' && (
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Document</h2>
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" />
                  </svg>
                  <p className="text-sm text-gray-600 mb-4">
                    {resource.file_name}
                  </p>
                  <a
                    href={resource.file_url}
                    download
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" />
                    </svg>
                    Download Document
                  </a>
                </div>
              </Card>
            )}

            {/* External Link */}
            {resource.has_url && !resource.is_youtube && (
              <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">External Link</h2>
                <div className="bg-blue-50 rounded-lg p-6">
                  <p className="text-sm text-gray-600 mb-4">
                    This resource is available at an external URL
                  </p>
                  <a
                    href={resource.resource_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                    Open Resource
                  </a>
                  <p className="text-xs text-gray-500 mt-2 break-words">
                    {resource.resource_url}
                  </p>
                </div>
              </Card>
            )}
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

                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(resource.created_at).toLocaleDateString()}
                  </dd>
                </div>
              </div>

              {resource.has_file && (
                <div className="mt-4">
                  <a
                    href={resource.file_url}
                    download
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" />
                    </svg>
                    Download
                  </a>
                </div>
              )}
            </Card>

            {/* Assignment Details */}
            {assignment && (
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Details</h3>

                <div className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Assigned Via</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {assignment.assigned_via}: {assignment.assigned_via_name}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">Assigned On</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(assignment.assigned_at).toLocaleDateString()}
                    </dd>
                  </div>

                  {assignment.due_date && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                      <dd className={`mt-1 text-sm font-medium ${assignment.overdue ? 'text-red-600' : 'text-gray-900'}`}>
                        {new Date(assignment.due_date).toLocaleDateString()}
                      </dd>
                    </div>
                  )}

                  {assignment.priority && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Priority</dt>
                      <dd className="mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getPriorityColor(assignment.priority)}`}>
                          {assignment.priority}
                        </span>
                      </dd>
                    </div>
                  )}
                </div>
              </Card>
            )}

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
