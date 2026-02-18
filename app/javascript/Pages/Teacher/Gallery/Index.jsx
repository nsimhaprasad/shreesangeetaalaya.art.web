import { Head } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import Layout from '@components/Layout'
import { Card, EmptyState, Badge } from '@components/UI'

const icons = {
  image: (
    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  close: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  chevronLeft: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  chevronRight: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  externalLink: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  )
}

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, currentIndex])

  return (
    <Layout>
      <Head title={gallery_setting.title || 'Gallery'} />

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">{gallery_setting.title}</h1>
          {gallery_setting.description && (
            <p className="text-gray-500 text-sm mt-1">{gallery_setting.description}</p>
          )}
        </div>

        {gallery_setting.use_google_photos && gallery_setting.google_photos_album_url ? (
          <Card>
            <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
              <iframe
                src={gallery_setting.google_photos_album_url}
                className="w-full h-full border-0"
                allowFullScreen
                title="Google Photos Album"
              />
            </div>
            <div className="mt-4 text-center">
              <a
                href={gallery_setting.google_photos_album_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Open in Google Photos
                {icons.externalLink}
              </a>
            </div>
          </Card>
        ) : local_photos.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {local_photos.map((photo, index) => (
                <button
                  key={index}
                  className="aspect-square rounded-xl overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onClick={() => openLightbox(photo, index)}
                >
                  <img
                    src={photo.url}
                    alt={photo.filename}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="text-sm text-gray-500 text-center">
              {local_photos.length} photo{local_photos.length !== 1 ? 's' : ''}
            </div>
          </>
        ) : (
          <EmptyState
            icon={icons.image}
            title="No photos available"
            description="The gallery is currently empty. Check back later!"
          />
        )}
      </div>

      {lightboxOpen && currentImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/80 hover:text-white z-10 p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close"
          >
            {icons.close}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              prevImage()
            }}
            className="absolute left-4 text-white/80 hover:text-white z-10 p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Previous"
          >
            {icons.chevronLeft}
          </button>

          <div
            className="max-w-7xl max-h-[90vh] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage.url}
              alt={currentImage.filename}
              className="max-w-full max-h-[85vh] object-contain mx-auto"
            />
            <div className="text-center text-white/80 mt-4">
              <span className="text-sm">
                {currentIndex + 1} / {local_photos.length}
              </span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
            }}
            className="absolute right-4 text-white/80 hover:text-white z-10 p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Next"
          >
            {icons.chevronRight}
          </button>
        </div>
      )}
    </Layout>
  )
}
