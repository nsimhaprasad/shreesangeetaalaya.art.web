class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

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
end
