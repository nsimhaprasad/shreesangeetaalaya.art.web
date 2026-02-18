import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import Layout from '@components/Layout'
import { 
  Card, Button, Badge, Avatar, EmptyState, 
  SearchInput, Select, Progress 
} from '@components/UI'

const icons = {
  plus: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  pdf: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  video: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  audio: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  ),
  document: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  youtube: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  chevronRight: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}

export default function Index({ resources, filters, pagination, available_tags, resource_types, visibilities }) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '')
  const [resourceType, setResourceType] = useState(filters.resource_type || '')
  const [visibility, setVisibility] = useState(filters.visibility || '')
  const [tag, setTag] = useState(filters.tag || '')
  const [sort, setSort] = useState(filters.sort || 'recent')

  const handleSearch = () => {
    router.get('/teacher/learning_resources', {
      search: searchTerm,
      resource_type: resourceType,
      visibility: visibility,
      tag: tag,
      sort: sort
    }, { preserveState: true, preserveScroll: true })
  }

  const handleReset = () => {
    setSearchTerm('')
    setResourceType('')
    setVisibility('')
    setTag('')
    setSort('recent')
    router.get('/teacher/learning_resources', {}, { preserveState: true, preserveScroll: true })
  }

  const handlePageChange = (page) => {
    router.get('/teacher/learning_resources', {
      page,
      search: searchTerm,
      resource_type: resourceType,
      visibility: visibility,
      tag: tag,
      sort: sort
    }, { preserveState: true, preserveScroll: true })
  }

  const resourceTypeOptions = [
    { value: '', label: 'All Types' },
    ...resource_types.map(type => ({
      value: type,
      label: type.charAt(0).toUpperCase() + type.slice(1)
    }))
  ]

  const visibilityOptions = [
    { value: '', label: 'All Visibility' },
    ...visibilities.map(vis => ({
      value: vis,
      label: vis.charAt(0).toUpperCase() + vis.slice(1).replace('_resource', '')
    }))
  ]

  const tagOptions = [
    { value: '', label: 'All Tags' },
    ...available_tags.map(t => ({ value: t, label: t }))
  ]

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'title', label: 'Title A-Z' },
    { value: 'type', label: 'Type' }
  ]

  const getResourceIcon = (type, isYoutube) => {
    if (isYoutube) {
      return <div className="text-red-500">{icons.youtube}</div>
    }
    switch(type) {
      case 'pdf': return <div className="text-red-500">{icons.pdf}</div>
      case 'video': return <div className="text-purple-500">{icons.video}</div>
      case 'audio': return <div className="text-blue-500">{icons.audio}</div>
      case 'document': return <div className="text-green-500">{icons.document}</div>
      default: return <div className="text-gray-500">{icons.document}</div>
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <Layout>
      <Head title="Learning Resources" />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">Learning Resources</h1>
            <p className="text-gray-500 text-sm mt-1">Manage and share educational content with your students</p>
          </div>
          <Link href="/teacher/learning_resources/new" className="btn-primary">
            {icons.plus}
            <span>Upload Resource</span>
          </Link>
        </div>

        <Card>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <SearchInput
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClear={searchTerm ? () => setSearchTerm('') : undefined}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value)}
                options={resourceTypeOptions}
                className="w-36"
              />
              <Select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                options={visibilityOptions}
                className="w-36"
              />
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                options={sortOptions}
                className="w-36"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSearch}>Search</Button>
            <Button variant="ghost" onClick={handleReset}>Reset</Button>
          </div>
        </Card>

        {pagination && (
          <p className="text-sm text-gray-500">
            Showing {resources?.length || 0} of {pagination.total_count || 0} resources
          </p>
        )}

        {resources && resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {resources.map((resource) => (
              <Link
                key={resource.id}
                href={`/teacher/learning_resources/${resource.id}`}
                className="block"
              >
                <Card hover className="h-full">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {getResourceIcon(resource.resource_type, resource.is_youtube)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {resource.title}
                        </h3>
                        <Badge variant={resource.visibility === 'public' ? 'success' : 'default'}>
                          {resource.visibility === 'private_resource' ? 'Private' : 'Public'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                        {resource.description || 'No description'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Type</p>
                      <p className="font-medium text-gray-900 capitalize">
                        {resource.is_youtube ? 'YouTube' : resource.resource_type}
                      </p>
                    </div>
                    {resource.has_file && (
                      <div>
                        <p className="text-gray-500">Size</p>
                        <p className="font-medium text-gray-900">{formatFileSize(resource.file_size)}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-500">Assigned</p>
                      <p className="font-medium text-gray-900">{resource.assignments_count || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Students</p>
                      <p className="font-medium text-gray-900">{resource.students_count || 0}</p>
                    </div>
                  </div>

                  {resource.tags && resource.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {resource.tags.slice(0, 3).map((t, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-50 text-primary-700"
                        >
                          {t}
                        </span>
                      ))}
                      {resource.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{resource.tags.length - 3}</span>
                      )}
                    </div>
                  )}

                  <div className="mt-3 flex items-center text-sm text-primary-600">
                    <span>View details</span>
                    {icons.chevronRight}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={icons.document}
            title="No resources found"
            description={searchTerm || resourceType ? "Try adjusting your search filters" : "Upload your first resource to get started"}
            action={
              !searchTerm && !resourceType && (
                <Link href="/teacher/learning_resources/new" className="btn-primary">
                  Upload Resource
                </Link>
              )
            }
          />
        )}

        {pagination && pagination.total_pages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600 px-4">
              Page {pagination.current_page} of {pagination.total_pages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.total_pages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </Layout>
  )
}
