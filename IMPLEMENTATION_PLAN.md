# Shree Sangeetha Aalaya - Learning Management System
## Comprehensive Implementation Plan

---

## 1. ARCHITECTURE OVERVIEW

### Tech Stack
- **Backend**: Ruby on Rails 7.x
- **Database**: PostgreSQL 14+
- **Frontend**: Inertia.js (React/Vue adapter) + Tailwind CSS
- **Authentication**: Devise gem
- **Authorization**: Pundit gem
- **File Storage**: ActiveStorage with AWS S3 or local storage
- **Background Jobs**: Sidekiq (for notifications, reports)
- **Payment Integration**: Razorpay/Stripe (future scope)

### Application Structure
```
rails new shreesangeetaalaya --database=postgresql --skip-action-cable
```

---

## 2. DATABASE SCHEMA DESIGN

### Core Tables

#### **users**
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | Primary key |
| email | string | Unique, indexed |
| encrypted_password | string | Devise |
| role | enum | ['admin', 'teacher', 'student'] |
| first_name | string | |
| last_name | string | |
| phone | string | |
| whatsapp | string | |
| date_of_birth | date | |
| address | text | |
| avatar | attachment | ActiveStorage |
| status | enum | ['active', 'inactive', 'suspended'] |
| created_at | datetime | |
| updated_at | datetime | |

**Indexes**: email, role, status

---

#### **students**
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | Primary key |
| user_id | bigint | Foreign key to users |
| guardian_name | string | For minors |
| guardian_phone | string | |
| guardian_email | string | |
| emergency_contact | string | |
| enrollment_date | date | |
| preferred_class_time | string | |
| notes | text | Internal notes |
| created_at | datetime | |
| updated_at | datetime | |

**Indexes**: user_id

---

#### **teachers**
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | Primary key |
| user_id | bigint | Foreign key to users |
| specialization | string | e.g., "Carnatic Vocal" |
| years_of_experience | integer | |
| qualification | string | |
| bio | text | |
| is_admin | boolean | Default: false |
| created_at | datetime | |
| updated_at | datetime | |

**Indexes**: user_id, is_admin

---

#### **courses**
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | Primary key |
| name | string | "Carnatic Vocal", "Flute" |
| description | text | |
| course_type | enum | ['carnatic_vocal', 'flute'] |
| status | enum | ['active', 'inactive'] |
| created_at | datetime | |
| updated_at | datetime | |

**Indexes**: course_type, status

---

#### **batches**
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | Primary key |
| name | string | e.g., "Morning Batch A" |
| course_id | bigint | Foreign key to courses |
| teacher_id | bigint | Foreign key to teachers |
| class_type | enum | ['one_on_one', 'group'] |
| schedule_day | string | e.g., "Monday, Wednesday" |
| schedule_time | time | |
| max_students | integer | NULL for 1-1, number for group |
| status | enum | ['active', 'completed', 'cancelled'] |
| start_date | date | |
| end_date | date | |
| created_at | datetime | |
| updated_at | datetime | |

**Indexes**: course_id, teacher_id, class_type, status

---

#### **batch_enrollments**
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | Primary key |
| batch_id | bigint | Foreign key to batches |
| student_id | bigint | Foreign key to students |
| enrollment_date | date | |
| status | enum | ['active', 'completed', 'dropped'] |
| created_at | datetime | |
| updated_at | datetime | |

**Indexes**: batch_id, student_id, status
**Unique**: [batch_id, student_id]

---

#### **fee_structures**
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | Primary key |
| batch_id | bigint | Foreign key to batches |
| class_type | enum | ['one_on_one', 'group'] |
| fee_type | enum | ['per_class', 'monthly'] |
| amount | decimal(10,2) | Base fee amount |
| effective_from | date | When this fee becomes active |
| effective_to | date | NULL if current |
| created_at | datetime | |
| updated_at | datetime | |

**Indexes**: batch_id, effective_from, effective_to
**Note**: Maintains historical fee records

---

#### **fee_offers**
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | Primary key |
| name | string | "3-Month Package" |
| description | text | |
| offer_type | enum | ['percentage', 'fixed_amount', 'bulk_months'] |
| duration_months | integer | 3, 6, 12, etc. |
| discount_percentage | decimal(5,2) | For percentage type |
| discount_amount | decimal(10,2) | For fixed amount type |
| applicable_to | enum | ['group', 'one_on_one', 'both'] |
| valid_from | date | |
| valid_to | date | |
| status | enum | ['active', 'inactive', 'expired'] |
| created_at | datetime | |
| updated_at | datetime | |

**Indexes**: status, valid_from, valid_to, applicable_to

---

#### **payments**
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | Primary key |
| student_id | bigint | Foreign key to students |
| batch_enrollment_id | bigint | Foreign key to batch_enrollments |
| amount | decimal(10,2) | |
| payment_date | date | |
| payment_method | enum | ['cash', 'upi', 'card', 'bank_transfer'] |
| fee_offer_id | bigint | NULL if no offer applied |
| transaction_reference | string | |
| months_covered | integer | For monthly payments |
| classes_covered | integer | For per-class payments |
| notes | text | |
| recorded_by | bigint | Foreign key to users (teacher) |
| created_at | datetime | |
| updated_at | datetime | |

**Indexes**: student_id, batch_enrollment_id, payment_date, recorded_by

---

#### **classes** (scheduled class sessions)
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | Primary key |
| batch_id | bigint | Foreign key to batches |
| class_date | date | |
| class_time | time | |
| duration_minutes | integer | Default: 60 |
| topic | string | Lesson topic |
| notes | text | Teacher notes |
| status | enum | ['scheduled', 'completed', 'cancelled'] |
| created_at | datetime | |
| updated_at | datetime | |

**Indexes**: batch_id, class_date, status

---

#### **attendances**
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | Primary key |
| class_id | bigint | Foreign key to classes |
| student_id | bigint | Foreign key to students |
| status | enum | ['present', 'absent', 'late', 'excused'] |
| marked_at | datetime | |
| marked_by | bigint | Foreign key to users (teacher) |
| notes | text | |
| created_at | datetime | |
| updated_at | datetime | |

**Indexes**: class_id, student_id, status
**Unique**: [class_id, student_id]

---

#### **learning_resources** (notes, materials)
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | Primary key |
| title | string | |
| description | text | |
| resource_type | enum | ['audio', 'video', 'youtube', 'pdf', 'text'] |
| resource_url | string | For YouTube links |
| file_attachment | attachment | ActiveStorage for files |
| uploaded_by | bigint | Foreign key to users (teacher) |
| created_at | datetime | |
| updated_at | datetime | |

**Indexes**: uploaded_by, resource_type

---

#### **resource_assignments**
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | Primary key |
| learning_resource_id | bigint | Foreign key to learning_resources |
| assignable_type | string | Polymorphic (Student/Batch) |
| assignable_id | bigint | |
| assigned_by | bigint | Foreign key to users (teacher) |
| assigned_at | datetime | |
| notes | text | Assignment specific notes |
| created_at | datetime | |
| updated_at | datetime | |

**Indexes**: learning_resource_id, [assignable_type, assignable_id], assigned_by

---

## 3. MODELS AND ASSOCIATIONS

### User Model
```ruby
class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  enum role: { student: 'student', teacher: 'teacher', admin: 'admin' }
  enum status: { active: 'active', inactive: 'inactive', suspended: 'suspended' }

  has_one :student, dependent: :destroy
  has_one :teacher, dependent: :destroy
  has_one_attached :avatar

  validates :email, presence: true, uniqueness: true
  validates :role, presence: true

  def full_name
    "#{first_name} #{last_name}".strip
  end

  def admin?
    role == 'admin' || (teacher? && teacher&.is_admin)
  end
end
```

### Student Model
```ruby
class Student < ApplicationRecord
  belongs_to :user
  has_many :batch_enrollments, dependent: :destroy
  has_many :batches, through: :batch_enrollments
  has_many :payments
  has_many :attendances
  has_many :resource_assignments, as: :assignable

  validates :user_id, presence: true, uniqueness: true
end
```

### Teacher Model
```ruby
class Teacher < ApplicationRecord
  belongs_to :user
  has_many :batches
  has_many :learning_resources, foreign_key: 'uploaded_by'

  validates :user_id, presence: true, uniqueness: true
end
```

### Course Model
```ruby
class Course < ApplicationRecord
  enum course_type: { carnatic_vocal: 'carnatic_vocal', flute: 'flute' }
  enum status: { active: 'active', inactive: 'inactive' }

  has_many :batches

  validates :name, presence: true
  validates :course_type, presence: true
end
```

### Batch Model
```ruby
class Batch < ApplicationRecord
  enum class_type: { one_on_one: 'one_on_one', group: 'group' }
  enum status: { active: 'active', completed: 'completed', cancelled: 'cancelled' }

  belongs_to :course
  belongs_to :teacher
  has_many :batch_enrollments, dependent: :destroy
  has_many :students, through: :batch_enrollments
  has_many :fee_structures
  has_many :classes
  has_many :resource_assignments, as: :assignable

  validates :name, presence: true
  validates :class_type, presence: true
  validate :validate_max_students

  def current_fee
    fee_structures.where('effective_from <= ? AND (effective_to IS NULL OR effective_to >= ?)',
                         Date.today, Date.today).first
  end

  private

  def validate_max_students
    if group? && max_students.nil?
      errors.add(:max_students, "must be set for group classes")
    end
  end
end
```

### FeeStructure Model
```ruby
class FeeStructure < ApplicationRecord
  enum class_type: { one_on_one: 'one_on_one', group: 'group' }
  enum fee_type: { per_class: 'per_class', monthly: 'monthly' }

  belongs_to :batch

  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :effective_from, presence: true
  validate :no_overlap_in_dates

  scope :current, -> { where('effective_from <= ? AND (effective_to IS NULL OR effective_to >= ?)',
                             Date.today, Date.today) }

  private

  def no_overlap_in_dates
    overlapping = FeeStructure.where(batch_id: batch_id)
                              .where.not(id: id)
                              .where('(effective_from, COALESCE(effective_to, ?)) OVERLAPS (?, COALESCE(?, ?))',
                                     Date::Infinity.new, effective_from, effective_to, Date::Infinity.new)
    if overlapping.exists?
      errors.add(:base, "Date range overlaps with existing fee structure")
    end
  end
end
```

### Payment Model
```ruby
class Payment < ApplicationRecord
  enum payment_method: { cash: 'cash', upi: 'upi', card: 'card', bank_transfer: 'bank_transfer' }

  belongs_to :student
  belongs_to :batch_enrollment
  belongs_to :fee_offer, optional: true
  belongs_to :recorded_by, class_name: 'User'

  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :payment_date, presence: true

  scope :by_date_range, ->(start_date, end_date) { where(payment_date: start_date..end_date) }
  scope :by_month, ->(date) { where(payment_date: date.beginning_of_month..date.end_of_month) }
end
```

### Class Model
```ruby
class Class < ApplicationRecord
  enum status: { scheduled: 'scheduled', completed: 'completed', cancelled: 'cancelled' }

  belongs_to :batch
  has_many :attendances, dependent: :destroy
  has_many :students, through: :attendances

  validates :class_date, presence: true
  validates :class_time, presence: true

  scope :upcoming, -> { where('class_date >= ?', Date.today).where(status: 'scheduled') }
  scope :past, -> { where('class_date < ?', Date.today) }
end
```

### Attendance Model
```ruby
class Attendance < ApplicationRecord
  enum status: { present: 'present', absent: 'absent', late: 'late', excused: 'excused' }

  belongs_to :class
  belongs_to :student
  belongs_to :marked_by, class_name: 'User'

  validates :class_id, uniqueness: { scope: :student_id }
  validates :status, presence: true
end
```

### LearningResource Model
```ruby
class LearningResource < ApplicationRecord
  enum resource_type: { audio: 'audio', video: 'video', youtube: 'youtube', pdf: 'pdf', text: 'text' }

  belongs_to :uploaded_by, class_name: 'User'
  has_one_attached :file_attachment
  has_many :resource_assignments, dependent: :destroy

  validates :title, presence: true
  validates :resource_type, presence: true
  validate :resource_content_present

  private

  def resource_content_present
    if youtube?
      errors.add(:resource_url, "must be present for YouTube resources") if resource_url.blank?
    else
      errors.add(:file_attachment, "must be attached") unless file_attachment.attached?
    end
  end
end
```

---

## 4. AUTHENTICATION & AUTHORIZATION

### Devise Setup
```ruby
# User roles: admin, teacher, student
# Authentication with Devise
# Sessions managed via Inertia.js
```

### Pundit Policies

#### UserPolicy
```ruby
class UserPolicy < ApplicationPolicy
  def index?
    user.admin?
  end

  def create?
    user.admin? || user.teacher?
  end

  def update?
    user.admin? || record.id == user.id
  end

  def destroy?
    user.admin? && record.id != user.id
  end
end
```

#### StudentPolicy
```ruby
class StudentPolicy < ApplicationPolicy
  def index?
    user.admin? || user.teacher?
  end

  def show?
    user.admin? || user.teacher? || record.user_id == user.id
  end

  def create?
    user.admin? || user.teacher?
  end

  def update?
    user.admin? || user.teacher? || record.user_id == user.id
  end
end
```

#### AttendancePolicy
```ruby
class AttendancePolicy < ApplicationPolicy
  def create?
    user.teacher? || user.admin?
  end

  def update?
    user.teacher? || user.admin?
  end

  def index?
    true # Students can view their own, teachers can view all
  end
end
```

---

## 5. FEATURE BREAKDOWN BY MODULE

### Module 1: Authentication & User Management
**Components:**
- Login page (all user types)
- User registration (admin-controlled for teachers, teacher-controlled for students)
- Profile management
- Password reset
- Role-based dashboards

**Routes:**
```ruby
devise_for :users, controllers: {
  sessions: 'users/sessions',
  registrations: 'users/registrations'
}

namespace :admin do
  resources :users
  resources :teachers
  resources :students
end
```

---

### Module 2: Student Management
**Components:**
- Add new student form (teacher/admin)
- Student list with search/filter
- Student profile view
- Edit student details
- Student status management

**Fields to Collect:**
- Basic: Name, DOB, Email, Phone, WhatsApp
- Guardian: Name, Phone, Email (for minors)
- Emergency contact
- Preferred class timings
- Course interest

**Routes:**
```ruby
namespace :teacher do
  resources :students do
    member do
      get :attendance_report
      get :payment_history
    end
  end
end
```

---

### Module 3: Batch & Class Management
**Components:**
- Create batch (with class type selection)
- Assign students to batches
- Schedule classes
- View batch details
- Batch roster management

**Class Type Configuration:**
- **1-1 Classes**:
  - Fee per class
  - Individual scheduling
  - Fee history tracking

- **Group Classes**:
  - Monthly fee
  - Max students limit
  - Group scheduling
  - Bulk offers (3/6/12 months)

**Routes:**
```ruby
namespace :teacher do
  resources :batches do
    resources :classes
    resources :batch_enrollments
    member do
      get :schedule
      post :create_recurring_classes
    end
  end
end
```

---

### Module 4: Fee Management
**Components:**
- Set fee structure (with effective dates)
- Fee history view
- Apply offers/discounts
- Fee calculator

**Offer Types:**
- Percentage discount (e.g., 10% off)
- Fixed amount discount (e.g., ₹500 off)
- Bulk month packages (3/6/12 months)
- Early bird offers
- Referral discounts

**Fee History Tracking:**
- Previous fee records
- Effective date ranges
- Fee change audit log

**Routes:**
```ruby
namespace :admin do
  resources :fee_structures
  resources :fee_offers

  get 'reports/fee_history/:batch_id', to: 'reports#fee_history'
end
```

---

### Module 5: Payment Tracking
**Components:**
- Record payment
- Payment history (student-wise, batch-wise)
- Payment receipts
- Due amount calculation

**Routes:**
```ruby
namespace :teacher do
  resources :payments do
    collection do
      get :pending_payments
    end
    member do
      get :receipt
    end
  end
end
```

---

### Module 6: Attendance Management
**Components:**
- Mark attendance (single class)
- Bulk attendance marking
- Attendance calendar view
- Student attendance report
- Batch attendance summary

**Quick Attendance Flow:**
1. Teacher selects batch
2. Selects class date
3. View student roster
4. Mark present/absent/late/excused
5. Save with one click

**Routes:**
```ruby
namespace :teacher do
  resources :classes do
    resources :attendances do
      collection do
        post :bulk_mark
      end
    end
  end

  get 'attendance/calendar/:batch_id', to: 'attendances#calendar'
  get 'attendance/report/:student_id', to: 'attendances#student_report'
end
```

---

### Module 7: Learning Resources & Notes
**Components:**
- Upload resources (audio, video, PDF, YouTube links)
- Assign to students/batches
- Resource library
- Categorization/tagging

**Resource Types:**
- Audio files (practice tracks, recordings)
- Video files (recorded lessons)
- YouTube links (tutorials, performances)
- PDF documents (notation, theory)
- Text notes

**Routes:**
```ruby
namespace :teacher do
  resources :learning_resources do
    member do
      post :assign_to_student
      post :assign_to_batch
    end
  end
end

namespace :student do
  resources :learning_resources, only: [:index, :show]
end
```

---

### Module 8: Reports & Analytics (Teacher/Admin)
**Components:**
- **Earnings Reports:**
  - Monthly earnings
  - As of today (total accumulated)
  - Last 6 months trend
  - Amortized per-class earnings
  - Revenue by course/batch
  - Payment method breakdown

- **Attendance Reports:**
  - Batch-wise attendance percentage
  - Student-wise attendance
  - Attendance trends

- **Student Reports:**
  - Active students count
  - Enrollment trends
  - Course popularity

**Report Views:**
```ruby
namespace :admin do
  namespace :reports do
    get :earnings_monthly
    get :earnings_current
    get :earnings_six_months
    get :earnings_amortized
    get :attendance_summary
    get :student_analytics
    get :batch_performance
  end
end
```

---

### Module 9: Student Portal
**Components:**
- Dashboard (overview)
- View fees paid
- Payment history with receipts
- Classes attended
- Attendance percentage
- Assigned learning resources
- Batch information
- Upcoming classes

**Student Dashboard Metrics:**
- Total classes attended
- Total classes conducted (for their batch)
- Attendance percentage
- Total fees paid
- Outstanding fees (if any)
- Next class date/time
- Recent assignments

**Routes:**
```ruby
namespace :student do
  get :dashboard
  get :fees_paid
  get :attendance
  get :learning_resources
  get :batch_info
  get :upcoming_classes
end
```

---

## 6. INERTIA.JS STRUCTURE

### Page Components

```
app/javascript/Pages/
├── Auth/
│   ├── Login.jsx
│   ├── Register.jsx
│   └── ForgotPassword.jsx
├── Admin/
│   ├── Dashboard.jsx
│   ├── Users/
│   │   ├── Index.jsx
│   │   └── Form.jsx
│   ├── FeeStructures/
│   │   ├── Index.jsx
│   │   └── Form.jsx
│   ├── FeeOffers/
│   │   ├── Index.jsx
│   │   └── Form.jsx
│   └── Reports/
│       ├── Earnings.jsx
│       ├── Attendance.jsx
│       └── Students.jsx
├── Teacher/
│   ├── Dashboard.jsx
│   ├── Students/
│   │   ├── Index.jsx
│   │   ├── Show.jsx
│   │   └── Form.jsx
│   ├── Batches/
│   │   ├── Index.jsx
│   │   ├── Show.jsx
│   │   └── Form.jsx
│   ├── Classes/
│   │   ├── Index.jsx
│   │   ├── Show.jsx
│   │   └── Calendar.jsx
│   ├── Attendance/
│   │   ├── Mark.jsx
│   │   ├── BulkMark.jsx
│   │   └── Report.jsx
│   ├── Payments/
│   │   ├── Index.jsx
│   │   └── Form.jsx
│   └── LearningResources/
│       ├── Index.jsx
│       ├── Form.jsx
│       └── Assign.jsx
├── Student/
│   ├── Dashboard.jsx
│   ├── FeesPaid.jsx
│   ├── Attendance.jsx
│   ├── LearningResources.jsx
│   └── BatchInfo.jsx
└── Shared/
    ├── Layout.jsx
    ├── Navbar.jsx
    ├── Sidebar.jsx
    └── Footer.jsx
```

### Shared Components
```
app/javascript/Components/
├── Forms/
│   ├── Input.jsx
│   ├── Select.jsx
│   ├── Textarea.jsx
│   ├── DatePicker.jsx
│   └── FileUpload.jsx
├── Tables/
│   ├── DataTable.jsx
│   ├── Pagination.jsx
│   └── SearchFilter.jsx
├── Cards/
│   ├── StatCard.jsx
│   ├── StudentCard.jsx
│   └── BatchCard.jsx
├── Modals/
│   ├── ConfirmDialog.jsx
│   └── FormModal.jsx
└── Charts/
    ├── LineChart.jsx
    ├── BarChart.jsx
    └── PieChart.jsx
```

---

## 7. IMPLEMENTATION PHASES

### **Phase 1: Project Setup & Authentication** (Week 1)
**Tasks:**
1. Initialize Rails project with PostgreSQL
2. Setup Inertia.js with React
3. Install and configure Devise
4. Install and configure Pundit
5. Setup Tailwind CSS
6. Create User model with roles
7. Implement login/logout
8. Create basic layouts (Admin, Teacher, Student)
9. Setup ActiveStorage for file uploads
10. Create initial database migrations

**Deliverables:**
- Working authentication system
- Role-based routing
- Basic dashboard for each role

---

### **Phase 2: User & Student Management** (Week 2)
**Tasks:**
1. Create Student and Teacher models
2. Admin: User management CRUD
3. Teacher: Add/edit students
4. Student profile pages
5. Form validations
6. Student listing with search/filter
7. Upload student photos

**Deliverables:**
- Complete student management module
- Teacher can add and manage students
- Admin can manage all users

---

### **Phase 3: Course, Batch & Class Management** (Week 3)
**Tasks:**
1. Create Course model (seed Carnatic Vocal, Flute)
2. Create Batch model
3. Create Class model
4. Batch creation flow (1-1 vs Group selection)
5. Student enrollment to batches
6. Class scheduling
7. Recurring class creation
8. Batch roster view

**Deliverables:**
- Teachers can create batches
- Assign students to batches
- Schedule classes (single and recurring)

---

### **Phase 4: Fee Management** (Week 4)
**Tasks:**
1. Create FeeStructure model
2. Create FeeOffer model
3. Fee structure form (per-class vs monthly)
4. Fee history tracking
5. Offer creation (3/6/12 month packages)
6. Fee calculator
7. Apply offers to enrollments

**Deliverables:**
- Complete fee management
- Fee history maintained
- Flexible offer system

---

### **Phase 5: Payment Tracking** (Week 5)
**Tasks:**
1. Create Payment model
2. Record payment form
3. Payment history view
4. Fee due calculation
5. Payment receipts (PDF generation)
6. Payment reminders
7. Payment analytics

**Deliverables:**
- Teachers can record payments
- Students can view payment history
- Automated receipt generation

---

### **Phase 6: Attendance Management** (Week 6)
**Tasks:**
1. Create Attendance model
2. Mark attendance interface
3. Bulk attendance marking
4. Attendance calendar view
5. Student attendance report
6. Batch attendance summary
7. Attendance statistics

**Deliverables:**
- Easy attendance marking
- Comprehensive attendance reports
- Calendar visualization

---

### **Phase 7: Learning Resources** (Week 7)
**Tasks:**
1. Create LearningResource model
2. Create ResourceAssignment model
3. Upload audio/video/PDF files
4. YouTube link embedding
5. Assign resources to students/batches
6. Student resource library view
7. Resource categorization

**Deliverables:**
- Teachers can upload and assign resources
- Students can access assigned materials
- Support for multiple resource types

---

### **Phase 8: Reports & Analytics** (Week 8)
**Tasks:**
1. Monthly earnings report
2. Current earnings dashboard
3. 6-month earnings trend
4. Amortized per-class earnings
5. Attendance analytics
6. Student enrollment analytics
7. Export reports to PDF/Excel
8. Graphical visualizations (charts)

**Deliverables:**
- Comprehensive reporting module
- Multiple earnings views
- Visual dashboards

---

### **Phase 9: Student Portal** (Week 9)
**Tasks:**
1. Student dashboard
2. Fees paid view
3. Attendance view
4. Learning resources access
5. Batch information
6. Upcoming classes
7. Download receipts
8. View attendance statistics

**Deliverables:**
- Fully functional student portal
- All student-facing features
- Mobile-responsive design

---

### **Phase 10: Polish & Optimization** (Week 10)
**Tasks:**
1. Code review and refactoring
2. Performance optimization
3. Add loading states
4. Error handling improvements
5. Form validation enhancements
6. Mobile responsiveness fixes
7. Accessibility improvements
8. Security audit
9. Add notifications (email/SMS)
10. Documentation

**Deliverables:**
- Production-ready application
- Optimized performance
- Complete documentation

---

## 8. DATABASE MIGRATION STRATEGY

### Migration from Static Site
1. Keep current static website running at `shreesangeetaalaya.art`
2. Deploy Rails app on subdomain: `app.shreesangeetaalaya.art`
3. Update main site with "Student Login" button pointing to app subdomain
4. Eventually integrate or replace main site

### Seed Data
```ruby
# db/seeds.rb

# Create courses
carnatic = Course.create!(name: 'Carnatic Vocal', course_type: 'carnatic_vocal', status: 'active')
flute = Course.create!(name: 'Flute', course_type: 'flute', status: 'active')

# Create admin user
admin = User.create!(
  email: 'admin@shreesangeetaalaya.art',
  password: 'change_me_immediately',
  role: 'admin',
  first_name: 'Admin',
  last_name: 'User',
  status: 'active'
)

# Create teacher
teacher_user = User.create!(
  email: 'vibha@shreesangeetaalaya.art',
  password: 'change_me',
  role: 'teacher',
  first_name: 'Vibha',
  last_name: 'Shree MS',
  status: 'active'
)

teacher = Teacher.create!(
  user: teacher_user,
  specialization: 'Carnatic Vocal',
  years_of_experience: 15,
  is_admin: true
)
```

---

## 9. TECHNOLOGY DECISIONS

### Why Inertia.js?
- Seamless integration with Rails
- No need for separate API
- Server-side routing with client-side rendering
- Easy to learn for Rails developers
- Better than traditional Rails views for modern UX

### Why Pundit?
- Simple, object-oriented authorization
- Easy to test
- Explicit policy definitions
- Better than CanCanCan for complex rules

### Why Sidekiq?
- Background job processing (email notifications, report generation)
- Redis-backed
- Web UI for monitoring
- Retry mechanisms

### Why ActiveStorage?
- Built into Rails
- Easy file uploads
- Cloud storage support (S3, GCS)
- Image variants/transformations

---

## 10. SECURITY CONSIDERATIONS

1. **Authentication**: Devise with secure defaults
2. **Authorization**: Pundit policies for every action
3. **CSRF Protection**: Rails default
4. **SQL Injection**: Use parameterized queries (ActiveRecord default)
5. **File Upload**: Validate file types and sizes
6. **Sensitive Data**: Encrypt payment details
7. **Password Policy**: Minimum 8 characters, complexity requirements
8. **Session Management**: Secure cookies, timeout
9. **Rate Limiting**: Use Rack::Attack for API endpoints
10. **HTTPS**: Enforce SSL in production

---

## 11. FUTURE ENHANCEMENTS

### Short-term
- Email notifications (class reminders, payment due)
- SMS notifications (class cancellations)
- Calendar integration (Google Calendar, iCal)
- Parent portal (separate from student login)
- Progress tracking (teacher notes on student improvement)

### Medium-term
- Online payment gateway (Razorpay/Stripe)
- Automated invoicing
- Certificate generation (on course completion)
- Practice log (students log practice hours)
- Exam/assessment module

### Long-term
- Video conferencing integration (Zoom/Google Meet)
- Recording repository (class recordings)
- Mobile app (React Native)
- WhatsApp integration (notifications)
- Advanced analytics (ML-based insights)

---

## 12. DEPLOYMENT STRATEGY

### Development Environment
- Local PostgreSQL database
- Rails server on localhost:3000
- Vite dev server for Inertia.js (HMR)

### Staging Environment
- Heroku/Railway/Render
- PostgreSQL add-on
- S3 for file storage
- Redis for Sidekiq

### Production Environment
- VPS (DigitalOcean/AWS EC2) or Heroku
- PostgreSQL database (managed service)
- S3 for file storage
- Redis for caching and Sidekiq
- Nginx reverse proxy
- SSL certificate (Let's Encrypt)
- Daily backups
- Monitoring (New Relic/Datadog)

---

## 13. TESTING STRATEGY

### Test Coverage
- **Models**: Unit tests (RSpec)
- **Controllers**: Request specs
- **Policies**: Policy specs
- **Services**: Service object specs
- **Integration**: Feature specs (Capybara)

### Tools
- RSpec for testing
- FactoryBot for fixtures
- Faker for test data
- SimpleCov for coverage reports
- Rubocop for code quality

---

## 14. ESTIMATED TIMELINE

**Total Duration**: 10-12 weeks for MVP

**Breakdown:**
- Phase 1: 1 week (Setup & Auth)
- Phase 2: 1 week (User/Student Management)
- Phase 3: 1 week (Batch/Class Management)
- Phase 4: 1 week (Fee Management)
- Phase 5: 1 week (Payment Tracking)
- Phase 6: 1 week (Attendance)
- Phase 7: 1 week (Learning Resources)
- Phase 8: 1 week (Reports & Analytics)
- Phase 9: 1 week (Student Portal)
- Phase 10: 1-2 weeks (Polish & Deploy)

**Post-MVP**: Ongoing maintenance and feature additions

---

## 15. COST ESTIMATE (Monthly)

### Infrastructure
- **Hosting** (Heroku/Railway): $25-50/month
- **PostgreSQL** (managed): $15-30/month
- **Redis** (for Sidekiq): $10-20/month
- **S3 Storage**: $5-10/month
- **Domain & SSL**: Minimal (existing)

**Total**: ~$55-110/month

### Development
- **Initial Development**: As per agreement
- **Maintenance**: Ongoing

---

## 16. SUCCESS METRICS

### Technical Metrics
- Page load time < 2 seconds
- API response time < 200ms
- Test coverage > 80%
- Zero critical security vulnerabilities

### Business Metrics
- Teacher time saved on admin tasks
- Student engagement (resource views, portal logins)
- Payment collection efficiency
- Attendance tracking accuracy

---

## NEXT STEPS

1. **Review this plan** and provide feedback
2. **Prioritize features** (if any adjustments needed)
3. **Approve technology stack**
4. **Begin Phase 1 implementation**
5. **Set up project repository**
6. **Create project management board** (Trello/GitHub Projects)

---

**CONFIRMED DECISIONS:**

1. ✅ Payment gateway: **Add later** (post-MVP phase)
2. ✅ Multi-teacher support: **YES** (2 teachers from day one)
3. ✅ Parent portal: **Use student credentials** (no separate portal)
4. ✅ SMS notifications: **Defer** to later phase
5. ✅ Budget: **Very low** - optimize for cheap deployment
6. ✅ Development strategy: **Local first**, deploy when complete

## BUDGET-OPTIMIZED DEPLOYMENT

### Local Development
- **Database**: SQLite (switch to PostgreSQL before production)
- **File Storage**: Local storage (switch to S3/Cloudinary later)
- **Background Jobs**: ActiveJob with async adapter (no Redis needed)
- **Cost**: $0/month

### Production Deployment (When Ready)
**Option 1: Railway.app (Recommended)**
- Free tier with $5 monthly credit
- PostgreSQL included
- Easy Rails deployment
- **Cost**: $0-10/month

**Option 2: Render.com**
- Free web service tier
- Free PostgreSQL (90 days)
- Auto-deploy from GitHub
- **Cost**: $0-7/month

**Option 3: Fly.io**
- 3 free VMs
- Free PostgreSQL
- Good performance in India
- **Cost**: $0-5/month

**Total Monthly Cost: $0-10** (vs initial estimate of $55-110)

Let me know your thoughts on this plan, and we can begin implementation!
