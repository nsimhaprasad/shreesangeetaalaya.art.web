class LearningResource < ApplicationRecord
  # Enums
  enum resource_type: { pdf: 'pdf', video: 'video', audio: 'audio', document: 'document', link: 'link', image: 'image', other: 'other' }

  # Associations
  belongs_to :uploaded_by_user, class_name: 'User', foreign_key: 'uploaded_by', optional: true
  has_many :resource_assignments, dependent: :destroy
  has_one_attached :file_attachment

  # Validations
  validates :title, presence: true
  validates :resource_type, presence: true
  validate :resource_url_or_file_present

  # Scopes
  scope :by_type, ->(type) { where(resource_type: type) }
  scope :recent, -> { order(created_at: :desc) }
  scope :with_files, -> { joins(:file_attachment_attachment) }

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

  private

  def resource_url_or_file_present
    if resource_url.blank? && !file_attachment.attached?
      errors.add(:base, "Either resource URL or file attachment must be present")
    end
  end
end
