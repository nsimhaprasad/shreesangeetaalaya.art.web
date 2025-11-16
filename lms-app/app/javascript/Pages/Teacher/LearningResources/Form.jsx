import { useForm } from '@inertiajs/react'
import { useState } from 'react'
import TextInput from '../../../Components/TextInput'
import SelectInput from '../../../Components/SelectInput'
import TextAreaInput from '../../../Components/TextAreaInput'
import FileInput from '../../../Components/FileInput'
import Button from '../../../Components/Button'
import Card from '../../../Components/Card'

export default function ResourceForm({ resource, resource_types, visibilities, submitText }) {
  const { data, setData, post, put, processing, errors } = useForm({
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

    data.tags.forEach((tag, index) => {
      formData.append(`learning_resource[tags][]`, tag)
    })

    if (resource.id) {
      router.post(`/teacher/learning_resources/${resource.id}`, {
        _method: 'put',
        ...Object.fromEntries(formData)
      }, {
        preserveScroll: true
      })
    } else {
      post('/teacher/learning_resources', {
        preserveScroll: true,
        data: formData
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>

        <div className="space-y-6">
          <TextInput
            label="Title"
            name="title"
            value={data.title}
            onChange={(e) => setData('title', e.target.value)}
            error={errors.title}
            required
            placeholder="Enter resource title"
          />

          <TextAreaInput
            label="Description"
            name="description"
            value={data.description}
            onChange={(e) => setData('description', e.target.value)}
            error={errors.description}
            rows={4}
            placeholder="Describe the learning resource..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectInput
              label="Resource Type"
              name="resource_type"
              value={data.resource_type}
              onChange={handleResourceTypeChange}
              options={resourceTypeOptions}
              error={errors.resource_type}
              required
            />

            <SelectInput
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

      {/* Resource Content */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Content</h3>

        {data.resource_type === 'youtube' || data.is_youtube ? (
          <div className="space-y-4">
            <TextInput
              label="YouTube URL"
              name="resource_url"
              value={data.resource_url}
              onChange={(e) => setData('resource_url', e.target.value)}
              error={errors.resource_url}
              placeholder="https://www.youtube.com/watch?v=..."
              required
            />
            <p className="text-sm text-gray-500">
              Enter a valid YouTube URL. Supported formats: youtube.com/watch?v=..., youtu.be/..., youtube.com/embed/...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <FileInput
              label="Upload File"
              name="file_attachment"
              onChange={(e) => setData('file_attachment', e.target.files[0])}
              error={errors.file_attachment}
              accept={
                data.resource_type === 'pdf' ? '.pdf' :
                data.resource_type === 'video' ? 'video/*' :
                data.resource_type === 'audio' ? 'audio/*' :
                data.resource_type === 'document' ? '.doc,.docx,.txt,.rtf' :
                '*'
              }
              helpText={
                data.resource_type === 'pdf' ? 'Upload a PDF file' :
                data.resource_type === 'video' ? 'Upload a video file (MP4, AVI, MOV, etc.)' :
                data.resource_type === 'audio' ? 'Upload an audio file (MP3, WAV, etc.)' :
                data.resource_type === 'document' ? 'Upload a document (DOC, DOCX, TXT, etc.)' :
                'Upload a file'
              }
            />

            {resource.has_file && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  <span className="font-medium">Current file:</span> {resource.file_name}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Upload a new file to replace the existing one
                </p>
              </div>
            )}

            <div className="mt-4">
              <TextInput
                label="Or provide a URL (optional)"
                name="resource_url"
                value={data.resource_url}
                onChange={(e) => setData('resource_url', e.target.value)}
                error={errors.resource_url}
                placeholder="https://example.com/resource"
              />
              <p className="text-sm text-gray-500 mt-1">
                You can provide a URL instead of uploading a file, or provide both
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Tags */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>

        <div className="space-y-4">
          <div className="flex space-x-2">
            <TextInput
              label="Add Tag"
              name="tag"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              placeholder="Enter a tag"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddTag()
                }
              }}
            />
            <div className="flex items-end">
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddTag}
              >
                Add
              </Button>
            </div>
          </div>

          {data.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {data.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 inline-flex items-center justify-center w-4 h-4 text-blue-600 hover:bg-blue-200 rounded-full"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
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
        >
          {submitText || (resource.id ? 'Update Resource' : 'Create Resource')}
        </Button>
      </div>
    </form>
  )
}
