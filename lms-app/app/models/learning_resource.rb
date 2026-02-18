class LearningResource < ApplicationRecord
  # Enums
  enum resource_type: { pdf: 'pdf', video: 'video', audio: 'audio', document: 'document', youtube: 'youtube', link: 'link', image: 'image', other: 'other' }
  enum visibility: { private_resource: 'private', public_resource: 'public' }, _prefix: :visibility

  # Associations
  belongs_to :uploaded_by_user, class_name: 'User', foreign_key: 'uploaded_by', optional: true
  has_many :resource_assignments, dependent: :destroy
  has_many :assigned_students, through: :resource_assignments, source: :assignable, source_type: 'Student'
  has_many :assigned_batches, through: :resource_assignments, source: :assignable, source_type: 'Batch'
  has_one_attached :file_attachment

  # Validations
  validates :title, presence: true
  validates :resource_type, presence: true
  validates :visibility, presence: true
  validate :resource_url_or_file_present
  validate :youtube_url_format, if: :is_youtube?

  # Scopes
  scope :by_type, ->(type) { where(resource_type: type) }
  scope :recent, -> { order(created_at: :desc) }
  scope :with_files, -> { joins(:file_attachment_attachment) }
  scope :public_resources, -> { where(visibility: 'public') }
  scope :private_resources, -> { where(visibility: 'private') }
  scope :by_tag, ->(tag) { where("tags LIKE ?", "%#{tag}%") }

  # Helper methods
  def has_file?
    file_attachment.attached?
  end

  def has_url?
    resource_url.present?
  end

  def display_name
    title
  end

  def file_size
    return nil unless file_attachment.attached?
    file_attachment.blob.byte_size
  end

  def file_name
    return nil unless file_attachment.attached?
    file_attachment.blob.filename.to_s
  end

  def tag_list
    return [] if tags.blank?
    JSON.parse(tags) rescue []
  end

  def tag_list=(array)
    self.tags = array.to_json
  end

  def youtube_embed_url
    return nil unless is_youtube? && resource_url.present?

    # Extract video ID from various YouTube URL formats
    video_id = extract_youtube_id(resource_url)
    return nil unless video_id

    "https://www.youtube.com/embed/#{video_id}"
  end

  private

  def resource_url_or_file_present
    if resource_url.blank? && !file_attachment.attached?
      errors.add(:base, "Either resource URL or file attachment must be present")
    end
  end

  def youtube_url_format
    if resource_url.present? && !valid_youtube_url?(resource_url)
      errors.add(:resource_url, "must be a valid YouTube URL")
    end
  end

  def valid_youtube_url?(url)
    extract_youtube_id(url).present?
  end

  def extract_youtube_id(url)
    patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\?\/]+)/,
      /youtube\.com\/embed\/([^&\?\/]+)/
    ]

    patterns.each do |pattern|
      match = url.match(pattern)
      return match[1] if match
    end

    nil
  end
end
