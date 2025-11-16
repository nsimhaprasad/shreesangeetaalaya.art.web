class Teacher::GalleryController < ApplicationController
  before_action :authenticate_teacher!

  def index
    @gallery_setting = GallerySetting.instance

    # Only show if gallery is enabled
    unless @gallery_setting.is_enabled
      redirect_to root_path, alert: 'Gallery is not available at this time.'
      return
    end

    gallery_data = {
      id: @gallery_setting.id,
      google_photos_album_url: @gallery_setting.google_photos_album_url,
      album_id: @gallery_setting.album_id,
      title: @gallery_setting.title,
      description: @gallery_setting.description,
      use_google_photos: @gallery_setting.use_google_photos
    }

    # Get local photos from public/gallery folder
    local_photos = get_local_photos

    render inertia: 'Teacher/Gallery/Index', props: {
      gallery_setting: gallery_data,
      local_photos: local_photos
    }
  end

  private

  def authenticate_teacher!
    unless current_user&.teacher?
      redirect_to root_path, alert: 'Access denied.'
    end
  end

  def get_local_photos
    gallery_path = Rails.root.join('public', 'gallery')
    return [] unless Dir.exist?(gallery_path)

    # Get all image files from gallery folder
    image_extensions = %w[.jpg .jpeg .png .gif .webp]
    photos = Dir.glob(gallery_path.join('*')).select do |file|
      File.file?(file) && image_extensions.include?(File.extname(file).downcase)
    end

    photos.map do |photo|
      {
        filename: File.basename(photo),
        url: "/gallery/#{File.basename(photo)}",
        size: File.size(photo),
        modified_at: File.mtime(photo)
      }
    end.sort_by { |p| p[:modified_at] }.reverse
  end
end
