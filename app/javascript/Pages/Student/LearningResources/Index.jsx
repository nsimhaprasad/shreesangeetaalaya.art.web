import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import Layout from '../../../Components/Layout'
import Card from '../../../Components/Card'
import Badge from '../../../Components/Badge'
import Button from '../../../Components/Button'
import TextInput from '../../../Components/TextInput'
import SelectInput from '../../../Components/SelectInput'

export default function Index({ resources, filters, pagination, available_tags, resource_types, priorities, stats }) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '')
  const [resourceType, setResourceType] = useState(filters.resource_type || '')
  const [tag, setTag] = useState(filters.tag || '')
  const [priority, setPriority] = useState(filters.priority || '')
  const [dueStatus, setDueStatus] = useState(filters.due_status || '')
  const [sort, setSort] = useState(filters.sort || 'recent')

  const handleSearch = () => {
    router.get('/student/learning_resources', {
      search: searchTerm,
      resource_type: resourceType,
      tag: tag,
      priority: priority,
      due_status: dueStatus,
      sort: sort
    }, {
      preserveState: true,
      preserveScroll: true
    })
  }

  const handleReset = () => {
    setSearchTerm('')
    setResourceType('')
    setTag('')
    setPriority('')
    setDueStatus('')
    setSort('recent')
    router.get('/student/learning_resources', {}, {
      preserveState: true,
      preserveScroll: true
    })
  }

  const handlePageChange = (page) => {
    router.get('/student/learning_resources', {
      page: page,
      search: searchTerm,
      resource_type: resourceType,
      tag: tag,
      priority: priority,
      due_status: dueStatus,
      sort: sort
    }, {
      preserveState: true,
      preserveScroll: true
    })
  }

  const resourceTypeOptions = resource_types.map(type => ({
    value: type,
    label: type.charAt(0).toUpperCase() + type.slice(1)
  }))

  const tagOptions = available_tags.map(tag => ({
    value: tag,
    label: tag
  }))

  const priorityOptions = priorities.map(priority => ({
    value: priority,
    label: priority.charAt(0).toUpperCase() + priority.slice(1)
  }))

  const dueStatusOptions = [
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'overdue', label: 'Overdue' }
  ]

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'title', label: 'Title A-Z' },
    { value: 'type', label: 'Type' },
    { value: 'due_date', label: 'Due Date' },
    { value: 'priority', label: 'Priority' }
  ]

  const getResourceIcon = (type) => {
    switch(type) {
      case 'pdf':
        return (
          <svg className="h-8 w-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
          </svg>
        )
      case 'video':
      case 'youtube':
        return (
          <svg className="h-8 w-8 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
        )
      case 'audio':
        return (
          <svg className="h-8 w-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" />
          </svg>
        )
      case 'document':
        return (
          <svg className="h-8 w-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" />
          </svg>
        )
      default:
        return (
          <svg className="h-8 w-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
          </svg>
        )
    }
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
      <Head title="My Learning Resources" />

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Learning Resources</h1>
            <p className="mt-1 text-sm text-gray-600">
              Access your assigned educational content
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Resources</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 bg-red-100 rounded-lg">
                  <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.overdue}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <svg className="h-6 w-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.high_priority}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <TextInput
                label="Search"
                name="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or description..."
              />
            </div>

            <SelectInput
              label="Type"
              name="resource_type"
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value)}
              options={resourceTypeOptions}
              placeholder="All Types"
            />

            <SelectInput
              label="Priority"
              name="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              options={priorityOptions}
              placeholder="All Priorities"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <SelectInput
              label="Tag"
              name="tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              options={tagOptions}
              placeholder="All Tags"
            />

            <SelectInput
              label="Due Status"
              name="due_status"
              value={dueStatus}
              onChange={(e) => setDueStatus(e.target.value)}
              options={dueStatusOptions}
              placeholder="All"
            />

            <SelectInput
              label="Sort By"
              name="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              options={sortOptions}
            />
          </div>

          <div className="flex items-end space-x-2 mt-4">
            <Button
              variant="primary"
              onClick={handleSearch}
              className="flex-1"
            >
              Search
            </Button>
            <Button
              variant="secondary"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </Card>

        {/* Results Info */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {resources.length} of {pagination.total_count} resources
        </div>

        {/* Resources Grid */}
        {resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <Card key={resource.id} padding={false} className="hover:shadow-lg transition-shadow duration-200">
                <Link href={`/student/learning_resources/${resource.id}`} className="block">
                  <div className="p-6">
                    {/* Resource Icon & Title */}
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {getResourceIcon(resource.resource_type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {resource.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                          {resource.description || 'No description'}
                        </p>
                      </div>
                    </div>

                    {/* Resource Details */}
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium text-gray-900 capitalize">
                          {resource.is_youtube ? 'YouTube' : resource.resource_type}
                        </span>
                      </div>

                      {resource.assignment && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Assigned via:</span>
                            <span className="font-medium text-gray-900">
                              {resource.assignment.assigned_via}
                            </span>
                          </div>

                          {resource.assignment.due_date && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Due:</span>
                              <span className={`font-medium ${resource.assignment.overdue ? 'text-red-600' : 'text-gray-900'}`}>
                                {new Date(resource.assignment.due_date).toLocaleDateString()}
                                {resource.assignment.days_until_due !== null && (
                                  resource.assignment.overdue
                                    ? ` (${Math.abs(resource.assignment.days_until_due)}d overdue)`
                                    : ` (${resource.assignment.days_until_due}d left)`
                                )}
                              </span>
                            </div>
                          )}

                          {resource.assignment.priority && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Priority:</span>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(resource.assignment.priority)}`}>
                                {resource.assignment.priority}
                              </span>
                            </div>
                          )}

                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Assigned:</span>
                            <span className="font-medium text-gray-900">
                              {new Date(resource.assignment.assigned_at).toLocaleDateString()}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Tags */}
                    {resource.tags && resource.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1">
                        {resource.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                        {resource.tags.length > 3 && (
                          <span className="text-xs text-gray-500">+{resource.tags.length - 3} more</span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No resources found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filters.search || filters.resource_type ? 'Try adjusting your filters' : 'You have no assigned resources yet'}
              </p>
            </div>
          </Card>
        )}

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page {pagination.current_page} of {pagination.total_pages}
            </div>

            <div className="flex space-x-2">
              <Button
                variant="secondary"
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
              >
                Previous
              </Button>

              {[...Array(pagination.total_pages)].map((_, index) => {
                const page = index + 1
                if (
                  page === 1 ||
                  page === pagination.total_pages ||
                  (page >= pagination.current_page - 2 && page <= pagination.current_page + 2)
                ) {
                  return (
                    <Button
                      key={page}
                      variant={page === pagination.current_page ? 'primary' : 'secondary'}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  )
                } else if (
                  page === pagination.current_page - 3 ||
                  page === pagination.current_page + 3
                ) {
                  return <span key={page} className="px-2 py-2">...</span>
                }
                return null
              })}

              <Button
                variant="secondary"
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.total_pages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
