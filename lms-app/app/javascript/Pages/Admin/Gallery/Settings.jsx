import { Head, router } from '@inertiajs/react'
import { useState } from 'react'
import Layout from '../../../Components/Layout'
import Card from '../../../Components/Card'
import Button from '../../../Components/Button'
import TextInput from '../../../Components/TextInput'
import TextAreaInput from '../../../Components/TextAreaInput'
import Badge from '../../../Components/Badge'

export default function Settings({ gallery_setting, local_photos = [], errors = [] }) {
  const [formData, setFormData] = useState({
    google_photos_album_url: gallery_setting.google_photos_album_url || '',
    title: gallery_setting.title || '',
    description: gallery_setting.description || '',
    is_enabled: gallery_setting.is_enabled || false,
    use_google_photos: gallery_setting.use_google_photos !== false
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    router.put(`/admin/gallery/${gallery_setting.id}`, {
      gallery_setting: formData
    })
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1048576).toFixed(1) + ' MB'
  }

  return (
    <Layout>
      <Head title="Gallery Settings" />

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gallery Settings</h1>
            <p className="mt-1 text-sm text-gray-600">
              Configure Google Photos integration or use local photo folder
            </p>
          </div>
        </div>

        {errors.length > 0 && (
          <Card className="mb-6 bg-red-50 border-red-200">
            <div className="text-red-800">
              <h3 className="font-semibold mb-2">Please fix the following errors:</h3>
              <ul className="list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </Card>
        )}

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <h2 className="text-xl font-semibold mb-4">General Settings</h2>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_enabled"
                  name="is_enabled"
                  checked={formData.is_enabled}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_enabled" className="ml-2 block text-sm text-gray-900">
                  Enable Gallery (make gallery visible to users)
                </label>
              </div>

              <TextInput
                label="Gallery Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Photo Gallery"
                required={formData.is_enabled}
              />

              <TextAreaInput
                label="Gallery Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add a description for your gallery..."
                rows={3}
              />
            </div>
          </Card>

          <Card className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Photo Source</h2>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="use_google_photos"
                  name="use_google_photos"
                  checked={formData.use_google_photos}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="use_google_photos" className="ml-2 block text-sm text-gray-900">
                  Use Google Photos (if unchecked, will use local folder)
                </label>
              </div>

              {formData.use_google_photos && (
                <div>
                  <TextInput
                    label="Google Photos Album URL"
                    name="google_photos_album_url"
                    value={formData.google_photos_album_url}
                    onChange={handleChange}
                    placeholder="https://photos.app.goo.gl/..."
                    required={formData.is_enabled && formData.use_google_photos}
                  />

                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <h3 className="font-semibold text-blue-900 mb-2">How to get Google Photos Album URL:</h3>
                    <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
                      <li>Open Google Photos and create or select an album</li>
                      <li>Click the "Share" button</li>
                      <li>Turn on "Share album" to make it public</li>
                      <li>Copy the shared link (it will look like: https://photos.app.goo.gl/...)</li>
                      <li>Paste it in the field above</li>
                    </ol>
                    <p className="mt-2 text-xs text-blue-700">
                      Note: The album must be publicly shared for the embed to work properly.
                    </p>
                  </div>

                  {gallery_setting.album_id && (
                    <div className="mt-2">
                      <Badge variant="success">Album ID extracted: {gallery_setting.album_id}</Badge>
                    </div>
                  )}
                </div>
              )}

              {!formData.use_google_photos && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                  <h3 className="font-semibold text-gray-900 mb-2">Local Photo Folder</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    Upload photos to: <code className="bg-gray-200 px-2 py-1 rounded">public/gallery/</code>
                  </p>
                  <p className="text-sm text-gray-600">
                    Supported formats: JPG, JPEG, PNG, GIF, WebP
                  </p>
                </div>
              )}
            </div>
          </Card>

          {!formData.use_google_photos && local_photos.length > 0 && (
            <Card className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Local Photos ({local_photos.length})</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preview
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Filename
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Modified
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {local_photos.map((photo, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src={photo.url}
                            alt={photo.filename}
                            className="h-16 w-16 object-cover rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{photo.filename}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatFileSize(photo.size)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(photo.modified_at).toLocaleString()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          <div className="flex space-x-4">
            <Button type="submit" variant="primary">
              Save Settings
            </Button>
            {gallery_setting.is_enabled && (
              <a
                href="/gallery"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button type="button" variant="secondary">
                  Preview Gallery
                </Button>
              </a>
            )}
          </div>
        </form>
      </div>
    </Layout>
  )
}
