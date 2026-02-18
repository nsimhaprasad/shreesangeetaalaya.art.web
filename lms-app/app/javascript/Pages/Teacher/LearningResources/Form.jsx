import { useForm, router } from '@inertiajs/react'
import { useState } from 'react'
import { Card, Button, Input, Select, TextArea } from '@components/UI'

const icons = {
  x: (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  ),
  upload: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  )
}

export default function ResourceForm({ resource, resource_types, visibilities, submitText }) {
  const { data, setData, post, processing, errors } = useForm({
    title: resource.title || '',
    description: resource.description || '',
    resource_type: resource.resource_type || 'document',
    resource_url: resource.resource_url || '',
    visibility: resource.visibility || 'private',
    is_youtube: resource.is_youtube || false,
    tags: resource.tags || [],
    file_attachment: null
  })

  const [currentTag, setCurrentTag] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('learning_resource[title]', data.title)
    formData.append('learning_resource[description]', data.description)
    formData.append('learning_resource[resource_type]', data.resource_type)
    formData.append('learning_resource[resource_url]', data.resource_url)
    formData.append('learning_resource[visibility]', data.visibility)
    formData.append('learning_resource[is_youtube]', data.is_youtube)

    if (data.file_attachment) {
      formData.append('learning_resource[file_attachment]', data.file_attachment)
    }

    data.tags.forEach((tag) => {
      formData.append('learning_resource[tags][]', tag)
    })

    if (resource.id) {
      formData.append('_method', 'put')
      post(`/teacher/learning_resources/${resource.id}`, formData, {
        preserveScroll: true
      })
    } else {
      post('/teacher/learning_resources', formData, {
        preserveScroll: true
      })
    }
  }

  const handleAddTag = () => {
    if (currentTag && !data.tags.includes(currentTag)) {
      setData('tags', [...data.tags, currentTag])
      setCurrentTag('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setData('tags', data.tags.filter(tag => tag !== tagToRemove))
  }

  const handleResourceTypeChange = (e) => {
    const type = e.target.value
    setData('resource_type', type)
    setData('is_youtube', type === 'youtube')
  }

  const resourceTypeOptions = resource_types.map(type => ({
    value: type,
    label: type.charAt(0).toUpperCase() + type.slice(1)
  }))

  const visibilityOptions = visibilities.map(vis => ({
    value: vis,
    label: vis.charAt(0).toUpperCase() + vis.slice(1).replace('_resource', '')
  }))

  const fileAccept = {
    pdf: '.pdf',
    video: 'video/*',
    audio: 'audio/*',
    document: '.doc,.docx,.txt,.rtf'
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>

        <div className="space-y-4">
          <Input
            label="Title"
            name="title"
            value={data.title}
            onChange={(e) => setData('title', e.target.value)}
            error={errors.title}
            required
            placeholder="Enter resource title"
          />

          <TextArea
            label="Description"
            name="description"
            value={data.description}
            onChange={(e) => setData('description', e.target.value)}
            error={errors.description}
            rows={4}
            placeholder="Describe the learning resource..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Resource Type"
              name="resource_type"
              value={data.resource_type}
              onChange={handleResourceTypeChange}
              options={resourceTypeOptions}
              error={errors.resource_type}
              required
            />

            <Select
              label="Visibility"
              name="visibility"
              value={data.visibility}
              onChange={(e) => setData('visibility', e.target.value)}
              options={visibilityOptions}
              error={errors.visibility}
              required
            />
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Content</h3>

        {data.resource_type === 'youtube' || data.is_youtube ? (
          <div className="space-y-4">
            <Input
              label="YouTube URL"
              name="resource_url"
              value={data.resource_url}
              onChange={(e) => setData('resource_url', e.target.value)}
              error={errors.resource_url}
              placeholder="https://www.youtube.com/watch?v=..."
              required
            />
            <p className="text-sm text-gray-500">
              Supported formats: youtube.com/watch?v=..., youtu.be/..., youtube.com/embed/...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="label">Upload File</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-primary-400 transition-colors">
                <div className="space-y-2 text-center">
                  <div className="mx-auto h-12 w-12 text-gray-400">
                    {icons.upload}
                  </div>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file_attachment"
                      className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file_attachment"
                        name="file_attachment"
                        type="file"
                        className="sr-only"
                        accept={fileAccept[data.resource_type] || '*'}
                        onChange={(e) => setData('file_attachment', e.target.files[0])}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {data.resource_type === 'pdf' && 'PDF files only'}
                    {data.resource_type === 'video' && 'MP4, AVI, MOV, etc.'}
                    {data.resource_type === 'audio' && 'MP3, WAV, etc.'}
                    {data.resource_type === 'document' && 'DOC, DOCX, TXT, RTF'}
                  </p>
                </div>
              </div>
              {errors.file_attachment && (
                <p className="mt-1.5 text-sm text-red-600">{errors.file_attachment}</p>
              )}
            </div>

            {resource.has_file && (
              <div className="p-4 bg-primary-50 rounded-lg">
                <p className="text-sm text-primary-900">
                  <span className="font-medium">Current file:</span> {resource.file_name}
                </p>
                <p className="text-xs text-primary-600 mt-1">
                  Upload a new file to replace the existing one
                </p>
              </div>
            )}

            <Input
              label="Or provide a URL (optional)"
              name="resource_url"
              value={data.resource_url}
              onChange={(e) => setData('resource_url', e.target.value)}
              error={errors.resource_url}
              placeholder="https://example.com/resource"
            />
          </div>
        )}
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter a tag"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddTag()
                }
              }}
            />
            <Button type="button" variant="secondary" onClick={handleAddTag}>
              Add
            </Button>
          </div>

          {data.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-primary-500 hover:text-primary-700"
                  >
                    {icons.x}
                  </button>
                </span>
              ))}
            </div>
          )}
          <p className="text-sm text-gray-500">
            Add tags to help categorize and search for this resource
          </p>
        </div>
      </Card>

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="ghost" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type="submit" loading={processing}>
          {submitText || (resource.id ? 'Update Resource' : 'Create Resource')}
        </Button>
      </div>
    </form>
  )
}
