# Shree Sangeetha Aalaya - Learning Management System

A comprehensive Learning Management System built with Ruby on Rails, React (via Inertia.js), and PostgreSQL/SQLite for managing music school operations.

## 🎯 Project Overview

This LMS enables:
- Multi-role authentication (Admin, Teacher, Student)
- Student enrollment and management
- Batch and class session management
- Fee structures with historical tracking
- Payment recording and tracking
- Attendance management
- Learning resource assignment
- Comprehensive reporting

## 🛠️ Tech Stack

- **Backend**: Ruby on Rails 7.2.3
- **Frontend**: React 19 with Inertia.js 2.2
- **Database**: SQLite (development), PostgreSQL (production-ready)
- **Styling**: Tailwind CSS 4
- **Authentication**: Devise
- **Authorization**: Pundit
- **Build Tool**: Vite + esbuild

## 📦 Installation & Setup

### Prerequisites
- Ruby 3.3.6
- Node.js 18+ / Yarn
- SQLite3 (for development)

### Installation Steps

1. **Install Dependencies**
   ```bash
   cd lms-app
   bundle install
   yarn install
   ```

2. **Setup Database**
   ```bash
   bin/rails db:migrate
   bin/rails db:seed
   ```

3. **Start Development Server**
   ```bash
   bin/dev
   ```

4. **Access the Application**
   Open your browser to `http://localhost:3000`

## 🔐 Login Credentials

After seeding, use these credentials:

### Admin
- Email: `admin@example.com`
- Password: `password`

### Teachers
- Email: `teacher1@example.com` (Admin Teacher)
- Password: `password`
- Email: `teacher2@example.com`
- Password: `password`

### Students
- Email: `student1@example.com` through `student10@example.com`
- Password: `password`

## 📊 Database Schema

### Core Models

1. **User** - Authentication and role management
2. **Student** - Student information and guardian details
3. **Teacher** - Teacher profiles and specializations
4. **Course** - Course catalog (Carnatic Vocal, Flute)
5. **Batch** - Class groupings (1-on-1 or group)
6. **BatchEnrollment** - Student-batch relationships
7. **FeeStructure** - Fee configurations with history
8. **FeeOffer** - Discounts and bulk offers
9. **Payment** - Payment records
10. **ClassSession** - Scheduled/completed classes
11. **Attendance** - Student attendance records
12. **LearningResource** - Study materials
13. **ResourceAssignment** - Resource-student/batch assignments

## ✅ Implemented Features

### Phase 1: Complete ✓
- [x] Rails 7.2 application setup
- [x] Devise authentication
- [x] Pundit authorization
- [x] Inertia.js + React integration
- [x] Tailwind CSS styling
- [x] ActiveStorage for file uploads
- [x] Vite build configuration

### Database & Models: Complete ✓
- [x] 14 database tables with proper relationships
- [x] All model associations and validations
- [x] Enum definitions for statuses
- [x] Scopes for common queries
- [x] Helper methods for business logic
- [x] Comprehensive seed data

### Authentication & Authorization: Complete ✓
- [x] User roles (admin, teacher, student)
- [x] Role-based access control
- [x] Protected routes
- [x] Login/logout functionality

### Basic UI: Complete ✓
- [x] Responsive layout with Navbar and Sidebar
- [x] Login page
- [x] Admin dashboard
- [x] Teacher dashboard
- [x] Student dashboard
- [x] Flash message handling

### Controllers: Partial ✓
- [x] DashboardController (role-based routing)
- [x] Users::SessionsController (Devise override)
- [x] Teacher::StudentsController (index, show)
- [x] Teacher::BatchesController (index, show)
- [x] Teacher::AttendancesController (index)
- [x] Student::DashboardController

## 🚧 In Progress / To-Do

### Phase 2: User & Student Management
- [ ] Add Student form (complete CRUD)
- [ ] Student search and filtering
- [ ] Student profile editing
- [ ] Guardian information management
- [ ] Student status management (active/inactive)

### Phase 3: Batch & Class Management
- [ ] Create batch form
- [ ] Batch roster management
- [ ] Class session scheduling interface
- [ ] Recurring class creation
- [ ] Batch status management

### Phase 4: Fee Management
- [ ] Fee structure creation/editing interface
- [ ] Fee history view
- [ ] Bulk offer creation form
- [ ] Fee calculator
- [ ] Fee change audit log

### Phase 5: Payment Tracking
- [ ] Payment recording form
- [ ] Payment receipt generation (PDF)
- [ ] Payment history views
- [ ] Due amount calculation
- [ ] Payment method analytics

### Phase 6: Attendance Management
- [ ] Quick attendance marking interface
- [ ] Bulk attendance marking
- [ ] Attendance calendar view
- [ ] Student attendance reports
- [ ] Batch attendance summaries

### Phase 7: Learning Resources
- [ ] Resource upload interface
- [ ] YouTube link embedding
- [ ] Resource assignment to students/batches
- [ ] Resource library with filtering
- [ ] Resource preview

### Phase 8: Reports & Analytics
- [ ] Monthly earnings report
- [ ] Earnings as of today
- [ ] 6-month earnings trend
- [ ] Amortized per-class earnings
- [ ] Attendance analytics
- [ ] Student enrollment trends
- [ ] Export to PDF/Excel

### Phase 9: Student Portal Enhancement
- [ ] Detailed fee paid view with receipts
- [ ] Class attendance history
- [ ] Batch schedule view
- [ ] Assigned resources library
- [ ] Progress tracking

### Phase 10: Google Photos Integration
- [ ] Google Photos API integration
- [ ] Album embedding
- [ ] Photo gallery view
- [ ] Auto-sync from Google Photos

## 🎨 Frontend Structure

```
app/javascript/
├── Pages/
│   ├── Auth/
│   │   └── Login.jsx
│   ├── Dashboard/
│   │   ├── Admin.jsx
│   │   ├── Teacher.jsx
│   │   └── Student.jsx
│   └── (Additional pages to be added)
├── Components/
│   ├── Layout.jsx
│   ├── Navbar.jsx
│   └── Sidebar.jsx
└── application.jsx (Entry point)
```

## 🔧 Development

### Running Tests
```bash
# Not yet implemented - will use RSpec
bundle exec rspec
```

### Code Quality
```bash
# Run Rubocop
bundle exec rubocop

# Auto-fix issues
bundle exec rubocop -a
```

### Database Commands
```bash
# Reset database
bin/rails db:reset

# Create migration
bin/rails generate migration AddFieldToModel field:type

# Run migrations
bin/rails db:migrate

# Rollback migration
bin/rails db:rollback
```

## 🚀 Deployment

### Railway.app (Recommended - Low Cost)
1. Create Railway account
2. Connect GitHub repository
3. Add PostgreSQL service
4. Set environment variables
5. Deploy

### Render.com
1. Create Render account
2. Connect repository
3. Add PostgreSQL database
4. Configure build & start commands
5. Deploy

### Environment Variables (Production)
```
RAILS_ENV=production
SECRET_KEY_BASE=<generate with `rails secret`>
DATABASE_URL=<postgresql url>
```

## 📝 Key Implementation Details

### Enum Fields with Prefixes
To avoid Rails conflicts, some enums use prefixes:
- `Batch.class_type` → `class_one_on_one`, `class_group`
- `FeeStructure.class_type` → `class_one_on_one`, `class_group`
- `FeeOffer.applicable_to` → `for_all_students`, `for_new_students`, `for_existing_students`

### Fee Structure History
Fee changes are tracked historically:
- `effective_from` and `effective_to` dates
- No deletion - new records created for changes
- `current_fee` scope returns active fee

### Polymorphic Associations
`ResourceAssignment` can be assigned to:
- Students (individual assignments)
- Batches (group assignments)
- ClassSessions (class-specific materials)

## 🎓 Business Logic

### 1-on-1 vs Group Classes
- **1-on-1**: `fee_type: 'per_class'`, no `max_students`
- **Group**: `fee_type: 'monthly'`, has `max_students`

### Fee Offers
Supports multiple offer types:
- Percentage discount (e.g., 10% off)
- Flat discount (e.g., ₹500 off)
- Duration-based (3/6/12 months)

### Attendance
Statuses: `present`, `absent`, `late`, `excused`
- Unique per student per class
- Tracked by teacher with timestamp
- Used for attendance reports

## 📞 Support

For issues or questions:
1. Check existing documentation
2. Review implementation plan: `/IMPLEMENTATION_PLAN.md`
3. Create GitHub issue (if repository is set up)

## 📄 License

[Add your license here]

## 👥 Contributors

- Vibha Shree MS - Founder & Director
- [Your development team]

---

**Note**: This is an MVP (Minimum Viable Product) with core functionality implemented. Additional features and UI polish are ongoing as per the 10-phase implementation plan.
