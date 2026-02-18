import { Head } from '@inertiajs/react'
import { useState } from 'react'
import Layout from '../../../Components/Layout'
import Card from '../../../Components/Card'

export default function Index({ gallery_setting, local_photos = [] }) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openLightbox = (photo, index) => {
    setCurrentImage(photo)
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setCurrentImage(null)
  }

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % local_photos.length
    setCurrentImage(local_photos[nextIndex])
    setCurrentIndex(nextIndex)
  }

  const prevImage = () => {
    const prevIndex = currentIndex === 0 ? local_photos.length - 1 : currentIndex - 1
    setCurrentImage(local_photos[prevIndex])
    setCurrentIndex(prevIndex)
  }

  const handleKeyDown = (e) => {
    if (!lightboxOpen) return
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowRight') nextImage()
    if (e.key === 'ArrowLeft') prevImage()
  }

  // Add keyboard event listener
  useState(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, currentIndex])

  return (
    <Layout>
      <Head title={gallery_setting.title || 'Gallery'} />

      <div className="mb-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{gallery_setting.title}</h1>
          {gallery_setting.description && (
            <p className="mt-2 text-gray-600">{gallery_setting.description}</p>
          )}
        </div>

        {gallery_setting.use_google_photos && gallery_setting.google_photos_album_url ? (
          <Card>
            <div className="relative w-full" style={{ paddingBottom: '75%' }}>
              <iframe
                src={gallery_setting.google_photos_album_url}
                className="absolute top-0 left-0 w-full h-full border-0 rounded-lg"
                allowFullScreen
                title="Google Photos Album"
              />
            </div>
            <div className="mt-4 text-center">
              <a
                href={gallery_setting.google_photos_album_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Open in Google Photos
              </a>
            </div>
          </Card>
        ) : local_photos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {local_photos.map((photo, index) => (
                <div
                  key={index}
                  className="relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-gray-100 hover:opacity-90 transition-opacity"
                  onClick={() => openLightbox(photo, index)}
                >
                  <img
                    src={photo.url}
                    alt={photo.filename}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Lightbox */}
            {lightboxOpen && currentImage && (
              <div
                className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
                onClick={closeLightbox}
              >
                <button
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-10"
                  aria-label="Close"
                >
                  &times;
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    prevImage()
                  }}
                  className="absolute left-4 text-white text-4xl hover:text-gray-300 z-10"
                  aria-label="Previous"
                >
                  &#8249;
                </button>

                <div
                  className="max-w-7xl max-h-screen p-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={currentImage.url}
                    alt={currentImage.filename}
                    className="max-w-full max-h-screen object-contain"
                  />
                  <div className="text-center text-white mt-4">
                    <p className="text-sm">
                      {currentIndex + 1} / {local_photos.length}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    nextImage()
                  }}
                  className="absolute right-4 text-white text-4xl hover:text-gray-300 z-10"
                  aria-label="Next"
                >
                  &#8250;
                </button>
              </div>
            )}
          </>
        ) : (
          <Card>
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No photos available</h3>
              <p className="mt-1 text-sm text-gray-500">
                The gallery is currently empty. Check back later!
              </p>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  )
}
