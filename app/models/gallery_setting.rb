class GallerySetting < ApplicationRecord
  # Validations
  validates :title, presence: true, if: :is_enabled?
  validate :google_photos_url_or_local_folder

  # Callbacks
  before_save :extract_album_id

  # Singleton pattern - only one gallery settings record
  def self.instance
    first_or_create(title: 'Gallery', description: 'Photo gallery')
  end

  private

  def extract_album_id
    return unless google_photos_album_url.present? && use_google_photos?

    # Extract album ID from various Google Photos URL formats
    # Format 1: https://photos.app.goo.gl/ALBUM_ID
    # Format 2: https://photos.google.com/share/ALBUM_ID
    # Format 3: https://photos.google.com/u/0/album/ALBUM_ID

    if google_photos_album_url.match(/photos\.app\.goo\.gl\/([A-Za-z0-9_-]+)/)
      self.album_id = $1
    elsif google_photos_album_url.match(/photos\.google\.com\/share\/([A-Za-z0-9_-]+)/)
      self.album_id = $1
    elsif google_photos_album_url.match(/photos\.google\.com\/.*\/album\/([A-Za-z0-9_-]+)/)
      self.album_id = $1
    end
  end

  def google_photos_url_or_local_folder
    if is_enabled? && use_google_photos? && google_photos_album_url.blank?
      errors.add(:google_photos_album_url, "can't be blank when Google Photos is enabled")
    end
  end
end
