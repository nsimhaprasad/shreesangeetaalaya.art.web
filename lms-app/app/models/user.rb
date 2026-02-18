class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :omniauthable, omniauth_providers: [:google_oauth2]

  # Enums
  enum role: { admin: 'admin', teacher: 'teacher', student: 'student' }
  enum status: { active: 'active', inactive: 'inactive', suspended: 'suspended' }

  # Associations
  has_one :student, dependent: :destroy
  has_one :teacher, dependent: :destroy
  has_one_attached :avatar

  # Validations
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :role, presence: true
  validates :status, presence: true
  validates :phone, format: { with: /\A[\d\s\-\+\(\)]+\z/, message: "must be a valid phone number" }, allow_blank: true
  validates :email, uniqueness: true

  # Helper methods
  def full_name
    "#{first_name} #{last_name}".strip
  end

  def admin?
    role == 'admin'
  end

  def teacher?
    role == 'teacher'
  end

  def student?
    role == 'student'
  end

  def active?
    status == 'active'
  end

  # OAuth class method
  def self.from_omniauth(auth)
    user = find_or_initialize_by(provider: auth.provider, uid: auth.uid)
    
    if user.new_record?
      user.email = auth.info.email
      user.first_name = auth.info.first_name || auth.info.name&.split&.first || 'Google'
      user.last_name = auth.info.last_name || auth.info.name&.split&.last || 'User'
      user.password = Devise.friendly_token[0, 20]
      user.role = 'student' # Default role for OAuth users
      user.status = 'active'
      
      # Create associated student record
      user.build_student if user.student.blank?
    end
    
    user
  end
end
